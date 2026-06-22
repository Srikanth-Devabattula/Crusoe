const TeamMember = require("../models/TeamMember");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const {
  removeCoverAsset,
  resolveCoverFromRequest,
  validateCoverImageValue,
} = require("../utils/gridfsStorage");

const TEAM_PHOTO_BUCKET = "team-photos";

const parseTeamBody = (body) => ({
  name: body.name,
  role: body.role,
  bio: body.bio,
  photo: body.photo,
  linkedIn: body.linkedIn,
  twitter: body.twitter,
  email: body.email,
  published: body.published === true || body.published === "true",
  sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
  removePhoto: body.removePhoto === true || body.removePhoto === "true",
});

const validateTeamBody = (body, isUpdate = false) => {
  const { name, role, photo, email } = body;

  if (!isUpdate || name !== undefined) {
    if (!name || !String(name).trim()) return "Name is required";
  }

  if (!isUpdate || role !== undefined) {
    if (!role || !String(role).trim()) return "Role is required";
  }

  if (photo !== undefined && photo) {
    const photoError = validateCoverImageValue(photo);
    if (photoError) return photoError;
  }

  if (email !== undefined && email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return "Email must be valid";
  }

  return null;
};

const sanitizeTeamBody = (body) => {
  const payload = {};

  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.role !== undefined) payload.role = String(body.role).trim();
  if (body.bio !== undefined) payload.bio = String(body.bio).trim();
  if (body.photo !== undefined) payload.photo = String(body.photo).trim();
  if (body.linkedIn !== undefined) payload.linkedIn = String(body.linkedIn).trim();
  if (body.twitter !== undefined) payload.twitter = String(body.twitter).trim();
  if (body.email !== undefined) payload.email = String(body.email).trim();
  if (body.published !== undefined) payload.published = Boolean(body.published);
  if (body.sortOrder !== undefined) payload.sortOrder = Number(body.sortOrder) || 0;

  return payload;
};

const getTeamMembers = async (req, res) => {
  const items = await TeamMember.find().sort({ sortOrder: 1, createdAt: -1 });
  return sendSuccess(res, 200, "Team members retrieved", items);
};

const getPublishedTeam = async (req, res) => {
  const items = await TeamMember.find({ published: true }).sort({
    sortOrder: 1,
    createdAt: -1,
  });
  return sendSuccess(res, 200, "Published team retrieved", items);
};

const createTeamMember = async (req, res) => {
  const body = parseTeamBody(req.body);
  req.body.coverImage = req.body.photo;
  req.body.removeCoverImage = req.body.removePhoto;
  const photo = await resolveCoverFromRequest(req, TEAM_PHOTO_BUCKET, null, null);
  if (photo.value !== undefined) body.photo = photo.value;

  const error = validateTeamBody(body);
  if (error) return sendError(res, 400, error);

  const item = await TeamMember.create(sanitizeTeamBody(body));
  return sendSuccess(res, 201, "Team member created", item);
};

const updateTeamMember = async (req, res) => {
  const existing = await TeamMember.findById(req.params.id);
  if (!existing) return sendError(res, 404, "Team member not found");

  const body = parseTeamBody(req.body);
  req.body.coverImage = req.body.photo;
  req.body.removeCoverImage = req.body.removePhoto;
  const photo = await resolveCoverFromRequest(req, TEAM_PHOTO_BUCKET, null, existing.photo);
  if (photo.value !== undefined) body.photo = photo.value;
  if (body.removePhoto) body.photo = "";

  const error = validateTeamBody(body, true);
  if (error) return sendError(res, 400, error);

  const payload = sanitizeTeamBody(body);

  if (photo.value !== undefined && photo.previous && photo.previous !== photo.value) {
    await removeCoverAsset(photo.previous, TEAM_PHOTO_BUCKET, null);
  }
  if (body.removePhoto && existing.photo) {
    await removeCoverAsset(existing.photo, TEAM_PHOTO_BUCKET, null);
  }

  const item = await TeamMember.findByIdAndUpdate(existing._id, payload, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, "Team member updated", item);
};

const deleteTeamMember = async (req, res) => {
  const item = await TeamMember.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 404, "Team member not found");

  if (item.photo) {
    await removeCoverAsset(item.photo, TEAM_PHOTO_BUCKET, null);
  }

  return sendSuccess(res, 200, "Team member deleted");
};

module.exports = {
  getTeamMembers,
  getPublishedTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
