const crypto = require("crypto");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { isAdminEmail, normalizeEmail } = require("../config/adminEmails");
const { sendEmail } = require("../config/mail");

const OTP_EXPIRY_MINUTES = 10;
const ACCESS_DENIED_MESSAGE = "You don't have access to admin panel";

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

const generateOtpCode = () => String(crypto.randomInt(100000, 1000000));

const ensureAdminAccess = (email) => {
  if (!isValidEmail(email)) {
    return { ok: false, status: 400, message: "Invalid email format" };
  }
  if (!isAdminEmail(email)) {
    return { ok: false, status: 403, message: ACCESS_DENIED_MESSAGE };
  }
  return { ok: true, email: normalizeEmail(email) };
};

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to allowlisted admin email
 * @access  Public
 */
const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 400, "Email is required");
  }

  const access = ensureAdminAccess(email);
  if (!access.ok) {
    return sendError(res, access.status, access.message);
  }

  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.deleteMany({ email: access.email });
  await Otp.create({ email: access.email, code, expiresAt });

  try {
    await sendEmail({
      to: access.email,
      subject: "Crusoe Tech Admin Login OTP",
      text: `Your admin login OTP is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      html: `<p>Your admin login OTP is <strong>${code}</strong>.</p><p>It expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`,
    });
  } catch (error) {
    console.error("[Auth] Failed to send OTP email:", error.message);
    return sendError(res, 500, "Failed to send OTP. Please try again later.");
  }

  return sendSuccess(res, 200, "OTP sent to your email");
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and log in admin
 * @access  Public
 */
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendError(res, 400, "Email and OTP are required");
  }

  const access = ensureAdminAccess(email);
  if (!access.ok) {
    return sendError(res, access.status, access.message);
  }

  const normalizedOtp = String(otp).trim();
  if (!/^\d{6}$/.test(normalizedOtp)) {
    return sendError(res, 400, "OTP must be a 6-digit code");
  }

  const record = await Otp.findOne({
    email: access.email,
    code: normalizedOtp,
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return sendError(res, 401, "Invalid or expired OTP");
  }

  await Otp.deleteMany({ email: access.email });

  let user = await User.findOne({ email: access.email });

  if (!user) {
    user = await User.create({
      name: access.email.split("@")[0],
      email: access.email,
      password: crypto.randomBytes(32).toString("hex"),
      role: "admin",
    });
  } else if (user.role !== "admin") {
    user.role = "admin";
    await user.save();
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
  if (!isAdminEmail(req.user.email)) {
    return sendError(res, 403, ACCESS_DENIED_MESSAGE);
  }

  return sendSuccess(res, 200, "User profile retrieved", {
    user: formatUser(req.user),
  });
};

module.exports = { sendOtp, verifyOtp, getMe };
