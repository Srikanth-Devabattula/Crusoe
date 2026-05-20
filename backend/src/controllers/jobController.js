const Job = require("../models/Job");
const { sendSuccess, sendError } = require("../utils/responseHandler");

const getJobs = async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Jobs retrieved", jobs);
};

const validateJobBody = (body, isUpdate = false) => {
  const {
    title,
    shortDescription,
    longDescription,
    experience,
    location,
    department,
    type,
    published,
  } = body;

  if (!isUpdate || title !== undefined) {
    if (!title || !String(title).trim()) {
      return "Job title is required";
    }
  }

  if (!isUpdate || shortDescription !== undefined) {
    if (!shortDescription || !String(shortDescription).trim()) {
      return "Short description is required";
    }
  }

  if (!isUpdate || longDescription !== undefined) {
    if (!longDescription || !String(longDescription).trim()) {
      return "Long description is required";
    }
  }

  if (!isUpdate || experience !== undefined) {
    if (!experience || !String(experience).trim()) {
      return "Experience is required";
    }
  }

  if (!isUpdate || location !== undefined) {
    if (!location || !String(location).trim()) {
      return "Location is required";
    }
  }

  if (type !== undefined) {
    const allowed = ["full-time", "part-time", "contract", "remote"];
    if (!allowed.includes(type)) {
      return "Invalid job type";
    }
  }

  return null;
};

const sanitizeJobBody = (body) => {
  const payload = {};

  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.shortDescription !== undefined) {
    payload.shortDescription = String(body.shortDescription).trim();
  }
  if (body.longDescription !== undefined) {
    payload.longDescription = String(body.longDescription).trim();
  }
  if (body.experience !== undefined) payload.experience = String(body.experience).trim();
  if (body.location !== undefined) payload.location = String(body.location).trim();
  if (body.department !== undefined) payload.department = String(body.department).trim();
  if (body.type !== undefined) payload.type = body.type;
  if (body.published !== undefined) payload.published = Boolean(body.published);

  return payload;
};

const createJob = async (req, res) => {
  const error = validateJobBody(req.body);
  if (error) {
    return sendError(res, 400, error);
  }

  const job = await Job.create(sanitizeJobBody(req.body));
  return sendSuccess(res, 201, "Job created successfully", job);
};

const updateJob = async (req, res) => {
  const error = validateJobBody(req.body, true);
  if (error) {
    return sendError(res, 400, error);
  }

  const job = await Job.findByIdAndUpdate(req.params.id, sanitizeJobBody(req.body), {
    new: true,
    runValidators: true,
  });

  if (!job) {
    return sendError(res, 404, "Job not found");
  }

  return sendSuccess(res, 200, "Job updated successfully", job);
};

const deleteJob = async (req, res) => {
  const job = await Job.findByIdAndDelete(req.params.id);

  if (!job) {
    return sendError(res, 404, "Job not found");
  }

  return sendSuccess(res, 200, "Job deleted successfully");
};

module.exports = { getJobs, createJob, updateJob, deleteJob };
