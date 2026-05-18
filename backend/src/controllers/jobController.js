const Job = require("../models/Job");
const { sendSuccess, sendError } = require("../utils/responseHandler");

/**
 * @route   GET /api/jobs
 * @desc    Get all jobs
 * @access  Public
 */
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Jobs retrieved", jobs);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   POST /api/jobs
 * @desc    Create job
 * @access  Private/Admin
 */
const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    return sendSuccess(res, 201, "Job created", job);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update job
 * @access  Private/Admin
 */
const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return sendError(res, 404, "Job not found");
    }

    return sendSuccess(res, 200, "Job updated", job);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete job
 * @access  Private/Admin
 */
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return sendError(res, 404, "Job not found");
    }

    return sendSuccess(res, 200, "Job deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };
