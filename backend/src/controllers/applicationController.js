const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { validateApplicationMessage } = require("../utils/wordCount");
const {
  notifyJobApplication,
  notifyGeneralApplication,
} = require("../services/formNotifyService");
const fs = require("fs");
const path = require("path");

const APPLICATION_STATUSES = ["pending", "reviewed", "accepted", "rejected"];

/**
 * @route   POST /api/applications
 * @desc    Submit job or general application with resume
 * @access  Public
 */
const submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, phone, message } = req.body;

    if (!name || !email) {
      return sendError(res, 400, "Name and email are required");
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }

    const messageError = validateApplicationMessage(message);
    if (messageError) {
      return sendError(res, 400, messageError);
    }

    if (!req.file) {
      return sendError(res, 400, "Resume file is required");
    }

    if (jobId) {
      const job = await Job.findOne({ _id: jobId, published: true });
      if (!job) {
        return sendError(res, 404, "This position is not available");
      }

      const application = await Application.create({
        job: jobId,
        applicationType: "job",
        name,
        email,
        phone,
        message: message.trim(),
        resume: req.file.filename,
      });

      await notifyJobApplication({
        application,
        job,
        resumeFile: req.file,
      }).catch((err) => {
        console.error("Application notification email failed:", err.message);
      });

      return sendSuccess(res, 201, "Application submitted", application);
    }

    const application = await Application.create({
      job: null,
      applicationType: "general",
      name,
      email,
      phone,
      message: message.trim(),
      resume: req.file.filename,
    });

    await notifyGeneralApplication({
      application,
      resumeFile: req.file,
    }).catch((err) => {
      console.error("General application notification email failed:", err.message);
    });

    return sendSuccess(res, 201, "Application submitted", application);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   GET /api/applications
 * @desc    List job and general applications
 * @access  Private (applications permission)
 */
const getApplications = async (req, res) => {
  const items = await Application.find().sort({ createdAt: -1 });
  const populated = await Promise.all(items.map((item) => Application.populateJob(item)));
  return sendSuccess(res, 200, "Applications retrieved", populated);
};

/**
 * @route   PATCH /api/applications/:id
 * @desc    Update application status
 * @access  Private (applications permission)
 */
const updateApplication = async (req, res) => {
  const { status } = req.body;

  if (status !== undefined && !APPLICATION_STATUSES.includes(status)) {
    return sendError(res, 400, "Invalid status");
  }

  const application = await Application.findById(req.params.id);
  if (!application) {
    return sendError(res, 404, "Application not found");
  }

  if (status !== undefined) application.status = status;
  await application.save();

  const populated = await Application.populateJob(application);

  return sendSuccess(res, 200, "Application updated", populated);
};

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete application and resume file
 * @access  Private (applications permission)
 */
const deleteApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    return sendError(res, 404, "Application not found");
  }

  if (application.resume) {
    const resumePath = path.join(__dirname, "..", "uploads", "resumes", application.resume);
    fs.unlink(resumePath, () => {});
  }

  await application.deleteOne();

  return sendSuccess(res, 200, "Application deleted");
};

module.exports = {
  submitApplication,
  getApplications,
  updateApplication,
  deleteApplication,
};
