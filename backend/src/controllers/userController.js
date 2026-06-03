const User = require("../models/User");
const { normalizePermissions } = require("../constants/permissions");
const { formatUser } = require("../utils/formatUser");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");

const formatUserForAdmin = (user) => ({
  ...formatUser(user),
  passwordPlain: user.passwordPlain || "",
});

const listUsers = async (req, res) => {
  const users = await User.find()
    .select("+passwordPlain -password")
    .sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Users retrieved", {
    users: users.map(formatUserForAdmin),
  });
};

const createUser = async (req, res) => {
  const { name, email, password, permissions } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, "Name, email, and password are required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (password.length < 6) {
    return sendError(res, 400, "Password must be at least 6 characters");
  }

  const normalized = normalizePermissions(permissions);
  const hasAny = Object.values(normalized).some(Boolean);
  if (!hasAny) {
    return sendError(res, 400, "Select at least one section access permission");
  }

  const emailTaken = await User.findOne({ email: email.toLowerCase() });
  if (emailTaken) {
    return sendError(res, 400, "Email is already registered");
  }

  const user = await User.create({
    name: String(name).trim(),
    email: email.toLowerCase(),
    password,
    passwordPlain: password,
    role: "staff",
    permissions: normalized,
  });

  const saved = await User.findById(user._id).select("+passwordPlain -password");
  return sendSuccess(res, 201, "User created successfully", {
    user: formatUserForAdmin(saved),
  });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, permissions, isActive } = req.body;

  const user = await User.findById(id).select("+password");
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  if (user.role === "admin" && req.user._id.toString() !== user._id.toString()) {
    return sendError(res, 400, "Administrator accounts cannot be edited here");
  }

  if (name) user.name = String(name).trim();

  if (email && email.toLowerCase() !== user.email) {
    if (!isValidEmail(email)) {
      return sendError(res, 400, "Invalid email format");
    }
    const taken = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: user._id },
    });
    if (taken) {
      return sendError(res, 400, "Email is already in use");
    }
    user.email = email.toLowerCase();
  }

  if (password) {
    if (password.length < 6) {
      return sendError(res, 400, "Password must be at least 6 characters");
    }
    user.password = password;
    user.passwordPlain = password;
  }

  if (permissions !== undefined) {
    const normalized = normalizePermissions(permissions);
    const hasAny = Object.values(normalized).some(Boolean);
    if (!hasAny) {
      return sendError(res, 400, "Select at least one section access permission");
    }
    user.permissions = normalized;
  }

  if (isActive === false) {
    return sendError(res, 400, "Use delete to remove a user account");
  }

  await user.save();

  const publicUser = await User.findById(user._id).select("+passwordPlain -password");
  return sendSuccess(res, 200, "User updated successfully", {
    user: formatUserForAdmin(publicUser),
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() === id) {
    return sendError(res, 400, "You cannot delete your own account");
  }

  const user = await User.findById(id);
  if (!user) {
    return sendError(res, 404, "User not found");
  }

  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return sendError(res, 400, "Cannot delete the only administrator");
    }
  }

  await user.deleteOne();
  return sendSuccess(res, 200, "User deleted successfully");
};

module.exports = { listUsers, createUser, updateUser, deleteUser };
