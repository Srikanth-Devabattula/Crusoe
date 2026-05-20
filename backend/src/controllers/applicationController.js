const Application = require("../models/Application");
const Job = require("../models/Job");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");

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

module.exports = { submitApplication, getAdminApplications };
