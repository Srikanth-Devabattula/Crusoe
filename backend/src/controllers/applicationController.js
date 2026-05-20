const fs = require("fs");
const path = require("path");

const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");

const resumeDir = path.join(__dirname, "../uploads/resumes");

const removeResumeFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(resumeDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

/**
 * @route   POST /api/applications
 * @desc    Submit job application with resume
 * @access  Public
 */
const submitApplication = async (req, res) => {
  try {
    const { jobId, name, email, phone } = req.body;

    if (!jobId || !name || !email) {
      return sendError(res, 400, "Job ID, name, and email are required");
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }

    if (!req.file) {
      return sendError(res, 400, "Resume file is required");
    }

    const job = await Job.findOne({ _id: jobId, published: true });
    if (!job) {
      return sendError(res, 404, "This position is not available");
    }

    const application = await Application.create({
      job: jobId,
      name,
      email,
      phone,
      resume: req.file.filename,
    });

    return sendSuccess(res, 201, "Application submitted", application);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   GET /api/applications/admin
 * @desc    Jobs grouped with their applications (admin)
 * @access  Admin
 */
const getAdminApplications = async (req, res) => {
  const applications = await Application.find()
    .populate("job", "title experience location department type")
    .sort({ createdAt: -1 })
    .lean();

  const grouped = new Map();

  for (const application of applications) {
    if (!application.job) continue;

    const jobId = String(application.job._id);

    if (!grouped.has(jobId)) {
      grouped.set(jobId, {
        job: application.job,
        applications: [],
      });
    }

    grouped.get(jobId).applications.push({
      _id: application._id,
      name: application.name,
      email: application.email,
      phone: application.phone,
      resume: application.resume,
      status: application.status,
      createdAt: application.createdAt,
    });
  }

  const data = Array.from(grouped.values()).sort((a, b) =>
    a.job.title.localeCompare(b.job.title)
  );

  return sendSuccess(res, 200, "Applications retrieved", data);
};

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete a single application and its resume file
 * @access  Admin
 */
const deleteApplication = async (req, res) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return sendError(res, 404, "Application not found");
  }

  removeResumeFile(application.resume);
  await application.deleteOne();

  return sendSuccess(res, 200, "Application deleted");
};

/**
 * @route   POST /api/applications/admin/bulk-delete
 * @desc    Delete multiple applications and their resume files
 * @access  Admin
 */
const deleteApplicationsBulk = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return sendError(res, 400, "Application IDs are required");
  }

  const applications = await Application.find({ _id: { $in: ids } });

  if (applications.length === 0) {
    return sendError(res, 404, "No applications found");
  }

  for (const application of applications) {
    removeResumeFile(application.resume);
  }

  await Application.deleteMany({ _id: { $in: applications.map((a) => a._id) } });

  return sendSuccess(res, 200, `${applications.length} application(s) deleted`, {
    deletedCount: applications.length,
  });
};

module.exports = {
  submitApplication,
  getAdminApplications,
  deleteApplication,
  deleteApplicationsBulk,
};
