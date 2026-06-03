const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const { formatUser } = require("../utils/formatUser");
const { staffHasAnyPermission } = require("../middleware/authMiddleware");

/**
 * @route   GET /api/auth/has-admin
 * @desc    Check if any admin user exists
 * @access  Public
 */
const hasAdmin = async (req, res) => {
  const count = await User.countDocuments({ role: "admin" });
  return sendSuccess(res, 200, "Admin status retrieved", { hasAdmin: count > 0 });
};

/**
 * @route   POST /api/auth/register
 * @desc    Create first admin user
 * @access  Public (only when no admin exists)
 */
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendError(res, 400, "Name, email, and password are required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (password.length < 6) {
    return sendError(res, 400, "Password must be at least 6 characters");
  }

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    return sendError(res, 400, "Admin already exists. Please log in.");
  }

  const emailTaken = await User.findOne({ email: email.toLowerCase() });
  if (emailTaken) {
    return sendError(res, 400, "Email is already registered");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  const token = generateToken(user._id);
  setAuthCookie(res, token);

  return sendSuccess(res, 201, "User created successfully", {
    user: formatUser(user),
    token,
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Admin login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return sendError(res, 401, "Invalid email or password");
  }

  if (user.role === "staff" && !staffHasAnyPermission(user)) {
    return sendError(
      res,
      403,
      "Your account has no section access. Contact an administrator.",
    );
  }

  const token = generateToken(user._id);
  setAuthCookie(res, token);

  return sendSuccess(res, 200, "User logged in successfully", {
    user: formatUser(user),
    token,
  });
};

/**
 * @route   GET /api/auth/me
 * @desc    Get logged-in user
 * @access  Private
 */
const getMe = async (req, res) => {
  return sendSuccess(res, 200, "User profile retrieved", {
    user: formatUser(req.user),
  });
};

module.exports = { hasAdmin, register, login, getMe };
