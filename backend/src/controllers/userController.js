const User = require("../models/User");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { normalizePermissions, PERMISSION_KEYS } = require("../constants/permissions");
const { isConfiguredAdminEmail } = require("../constants/envAdmin");

const formatStaffUser = (user) => {
  const doc = user?.toObject ? user.toObject() : user;
  return {
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    permissions: doc.permissions || {},
    passwordPlain: doc.passwordPlain || "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const parsePermissionsBody = (body) => {
  const input = {};
  PERMISSION_KEYS.forEach((key) => {
    const value = body[key] ?? body.permissions?.[key];
    if (value !== undefined) {
      input[key] = value === true || value === "true";
    }
  });
  return normalizePermissions(input);
};

const permissionsHasAny = (permissions) =>
  PERMISSION_KEYS.some((key) => Boolean(permissions?.[key]));

const getUsers = async (req, res) => {
  const users = await User.find({ role: "staff" })
    .select("+passwordPlain")
    .sort({ createdAt: -1 });
  return sendSuccess(
    res,
    200,
    "Staff users retrieved",
    users.map(formatStaffUser)
  );
};

const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (isConfiguredAdminEmail(email)) {
    return sendError(res, 400, "This email is reserved for the administrator account.");
  }

  if (String(password).length < 6) {
    return sendError(res, 400, "Password must be at least 6 characters");
  }

  const permissions = parsePermissionsBody(req.body);
  if (!permissionsHasAny(permissions)) {
    return sendError(res, 400, "Select at least one admin section for this user");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return sendError(res, 400, "Email is already registered");
  }

  const displayName = name?.trim() || email.split("@")[0];

  const user = await User.create({
    name: displayName,
    email: email.toLowerCase(),
    password,
    passwordPlain: String(password),
    role: "staff",
    permissions,
  });

  const created = await User.findById(user._id).select("+passwordPlain");
  return sendSuccess(res, 201, "User created", formatStaffUser(created));
};

const updateUser = async (req, res) => {
  const existing = await User.findById(req.params.id).select("+password +passwordPlain");
  if (!existing) return sendError(res, 404, "User not found");
  if (existing.role !== "staff") {
    return sendError(res, 400, "Only staff users can be edited here");
  }

  const { name, email, password } = req.body;
  const updates = {};

  if (name !== undefined) {
    const trimmed = String(name).trim();
    if (!trimmed) return sendError(res, 400, "Name is required");
    updates.name = trimmed;
  }

  if (email !== undefined) {
    const normalized = String(email).trim().toLowerCase();
    if (!isValidEmail(normalized)) return sendError(res, 400, "Invalid email format");
    if (normalized !== existing.email) {
      const taken = await User.findOne({ email: normalized });
      if (taken) return sendError(res, 400, "Email is already registered");
    }
    updates.email = normalized;
  }

  const permissions = parsePermissionsBody(req.body);
  if (Object.keys(req.body).some((k) => PERMISSION_KEYS.includes(k) || k === "permissions")) {
    if (!permissionsHasAny(permissions)) {
      return sendError(res, 400, "Select at least one admin section for this user");
    }
    updates.permissions = permissions;
  }

  if (password !== undefined && String(password).trim()) {
    if (String(password).length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters");
    }
    updates.password = String(password);
    updates.passwordPlain = String(password);
  }

  Object.assign(existing, updates);
  await existing.save();

  const updated = await User.findById(existing._id).select("+passwordPlain");
  return sendSuccess(res, 200, "User updated", formatStaffUser(updated));
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return sendError(res, 404, "User not found");
  if (user.role !== "staff") {
    return sendError(res, 400, "Only staff users can be deleted here");
  }

  if (String(user._id) === String(req.user._id)) {
    return sendError(res, 400, "You cannot delete your own account");
  }

  await user.deleteOne();
  return sendSuccess(res, 200, "User deleted");
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
