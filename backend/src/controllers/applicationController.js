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

module.exports = { submitApplication };
