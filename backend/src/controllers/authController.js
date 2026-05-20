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

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const normalizeEmail = (email) => String(email).trim().toLowerCase();

/**
 * @route   POST /api/auth/create-account
 * @desc    Create admin account (Postman / API only)
 * @access  Public — requires existing admin_email when admins already exist
 */
const createAccount = async (req, res) => {
  const { admin_email, name, new_user_email, password } = req.body;

  if (!name || !new_user_email || !password) {
    return sendError(res, 400, "name, new_user_email, and password are required");
  }

  if (!isValidEmail(new_user_email)) {
    return sendError(res, 400, "Invalid new_user_email format");
  }

  if (password.length < 6) {
    return sendError(res, 400, "Password must be at least 6 characters");
  }

  const adminCount = await User.countDocuments({ role: "admin" });

  if (adminCount > 0) {
    if (!admin_email) {
      return sendError(res, 400, "admin_email is required to create new accounts");
    }

    if (!isValidEmail(admin_email)) {
      return sendError(res, 400, "Invalid admin_email format");
    }

    const requestingAdmin = await User.findOne({
      email: normalizeEmail(admin_email),
      role: "admin",
    });

    if (!requestingAdmin) {
      return sendError(res, 403, "admin_email is not a valid admin account");
    }
  }

  const email = normalizeEmail(new_user_email);
  const emailTaken = await User.findOne({ email });
  if (emailTaken) {
    return sendError(res, 400, "new_user_email is already registered");
  }

  const user = await User.create({
    name: String(name).trim(),
    email,
    password,
    role: "admin",
  });

  return sendSuccess(res, 201, "Admin account created successfully", {
    user: formatUser(user),
  });
};

/**
 * @route   POST /api/auth/login
 * @desc    Admin login (website)
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

  const user = await User.findOne({ email: normalizeEmail(email) }).select("+password");

  if (!user || user.role !== "admin") {
    return sendError(res, 401, "Invalid email or password");
  }

  if (!(await user.matchPassword(password))) {
    return sendError(res, 401, "Invalid email or password");
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
 * @desc    Get logged-in admin
 * @access  Private
 */
const getMe = async (req, res) => {
  if (req.user.role !== "admin") {
    return sendError(res, 403, "Not authorized as admin");
  }

  return sendSuccess(res, 200, "User profile retrieved", {
    user: formatUser(req.user),
  });
};

module.exports = { createAccount, login, getMe };
