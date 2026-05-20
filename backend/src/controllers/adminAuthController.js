const crypto = require("crypto");
const User = require("../models/User");
const Otp = require("../models/Otp");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { isAdminEmail, normalizeEmail } = require("../config/adminEmails");
const { sendEmail } = require("../config/mail");
const {
  OTP_EXPIRY_MINUTES,
  generateOtpCode,
  hashOtp,
  verifyOtpHash,
} = require("../utils/otp");
const { setAdminTokenCookie, clearAdminTokenCookie } = require("../utils/adminCookie");

const ACCESS_DENIED_MESSAGE = "You don't have access to admin panel";
const MAX_OTP_ATTEMPTS = 5;

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

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
 * @route   POST /api/admin/send-otp
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
  await Otp.create({
    email: access.email,
    codeHash: hashOtp(code),
    expiresAt,
  });

  try {
    await sendEmail({
      to: access.email,
      subject: "Crusoe Tech — Admin login code",
      text: `Your admin login code is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share this code.`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
          <h2 style="color:#111827;">Admin login</h2>
          <p>Your one-time verification code:</p>
          <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#111827;">${code}</p>
          <p style="color:#6b7280;font-size:14px;">Expires in ${OTP_EXPIRY_MINUTES} minutes. If you did not request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[AdminAuth] OTP email failed:", error.message);
    return sendError(res, 500, "Failed to send OTP. Check SMTP configuration.");
  }

  return sendSuccess(res, 200, "OTP sent to your email", {
    expiresInMinutes: OTP_EXPIRY_MINUTES,
  });
};

/**
 * @route   POST /api/admin/verify-otp
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
    expiresAt: { $gt: new Date() },
  });

  if (!record) {
    return sendError(res, 401, "Invalid or expired OTP");
  }

  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    await Otp.deleteMany({ email: access.email });
    return sendError(res, 429, "Too many attempts. Request a new OTP.");
  }

  if (!verifyOtpHash(normalizedOtp, record.codeHash)) {
    record.attempts += 1;
    await record.save();
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
  setAdminTokenCookie(res, token);

  return sendSuccess(res, 200, "Logged in successfully", {
    user: formatUser(user),
    token,
  });
};

/**
 * @route   GET /api/admin/me
 */
const getMe = async (req, res) => {
  if (!isAdminEmail(req.user.email) || req.user.role !== "admin") {
    return sendError(res, 403, ACCESS_DENIED_MESSAGE);
  }

  return sendSuccess(res, 200, "Admin profile retrieved", {
    user: formatUser(req.user),
  });
};

/**
 * @route   POST /api/admin/logout
 */
const logout = async (req, res) => {
  clearAdminTokenCookie(res);
  return sendSuccess(res, 200, "Logged out successfully");
};

module.exports = { sendOtp, verifyOtp, getMe, logout };
