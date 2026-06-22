const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { secureCompare } = require("../utils/secureCompare");
const {
  ENV_ADMIN_ID,
  getEnvAdminUser,
  isEnvAdminConfigured,
} = require("../constants/envAdmin");

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
 * @desc    Check if admin login is configured
 * @access  Public
 */
const hasAdmin = async (req, res) => {
  return sendSuccess(res, 200, "Admin status retrieved", {
    hasAdmin: isEnvAdminConfigured(),
  });
};

/**
 * @route   POST /api/auth/admin-login
 * @desc    Admin login using ADMIN_EMAIL + ADMIN_PASSWORD from .env
 * @access  Public
 */
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendError(res, 400, "Email and password are required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (!isEnvAdminConfigured()) {
    return sendError(
      res,
      503,
      "Admin login is not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in server environment."
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const inputEmail = email.trim().toLowerCase();

  const emailMatch = secureCompare(inputEmail, adminEmail);
  const passwordMatch = secureCompare(password, process.env.ADMIN_PASSWORD);

  if (!emailMatch || !passwordMatch) {
    return sendError(res, 401, "Invalid email or password");
  }

  const token = generateToken(ENV_ADMIN_ID);
  setAuthCookie(res, token);

  return sendSuccess(res, 200, "Logged in successfully", {
    user: formatUser(getEnvAdminUser()),
    token,
    loginMethod: "env-admin",
  });
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

module.exports = { hasAdmin, adminLogin, register, login, getMe };
