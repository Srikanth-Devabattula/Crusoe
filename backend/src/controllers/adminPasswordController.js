const User = require("../models/User");
const OTP = require("../models/OTP");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { sendOTPEmail } = require("../services/otpEmailService");
const {
  getConfiguredAdminEmail,
  isConfiguredAdminEmail,
  isEnvAdminConfigured,
} = require("../constants/envAdmin");

const isEmailDeliveryError = (error) => {
  const message = String(error?.message || "");
  const code = error?.code;

  return (
    message.includes("SMTP") ||
    message.includes("Resend") ||
    message.includes("Email is not configured") ||
    /timeout|timed out|ETIMEDOUT|ESOCKET|ECONNREFUSED|ENOTFOUND|ECONNRESET/i.test(
      message
    ) ||
    ["ETIMEDOUT", "ESOCKET", "ECONNREFUSED", "ENOTFOUND", "ECONNRESET", "EAUTH"].includes(
      code
    )
  );
};

const ensureAdminConfigured = (res) => {
  if (!isEnvAdminConfigured()) {
    sendError(
      res,
      503,
      "Admin email is not configured. Set ADMIN_EMAIL in server environment."
    );
    return false;
  }
  return true;
};

const requestAdminPasswordOtp = async (req, res) => {
  if (!ensureAdminConfigured(res)) return;

  const { email } = req.body;
  if (!email) return sendError(res, 400, "Email is required");
  if (!isValidEmail(email)) return sendError(res, 400, "Invalid email format");

  if (!isConfiguredAdminEmail(email)) {
    return sendError(res, 403, "This email is not authorized as administrator.");
  }

  try {
    const normalizedEmail = getConfiguredAdminEmail();
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const { plainOTP } = await OTP.createOTP(normalizedEmail, ipAddress, userAgent);

    await sendOTPEmail(normalizedEmail, plainOTP, {
      expiryMinutes: 5,
      userName: process.env.ADMIN_NAME || "Administrator",
    });

    return sendSuccess(res, 200, "Verification code sent", {
      email: normalizedEmail,
      expiresIn: 300,
      message: "Check your email for the verification code",
    });
  } catch (error) {
    console.error("Admin password OTP error:", error.message || error);

    if (isEmailDeliveryError(error)) {
      return sendError(
        res,
        503,
        "Email service temporarily unavailable. Please try again later."
      );
    }

    if (error.code === 11000 || error.code === "P2002") {
      return sendError(res, 429, "Please wait before requesting another code.");
    }

    return sendError(res, 500, "Failed to send verification code.");
  }
};

const resetAdminPassword = async (req, res) => {
  if (!ensureAdminConfigured(res)) return;

  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return sendError(res, 400, "Email, OTP, and new password are required");
  }

  if (!isValidEmail(email)) return sendError(res, 400, "Invalid email format");
  if (!isConfiguredAdminEmail(email)) {
    return sendError(res, 403, "This email is not authorized as administrator.");
  }

  if (!/^\d{6}$/.test(String(otp))) {
    return sendError(res, 400, "Invalid OTP format. Enter the 6-digit code.");
  }

  if (String(password).length < 6) {
    return sendError(res, 400, "Password must be at least 6 characters");
  }

  try {
    const normalizedEmail = getConfiguredAdminEmail();
    const otpDoc = await OTP.findValidOTP(normalizedEmail);

    if (!otpDoc || !otpDoc.isValid()) {
      return sendError(res, 400, "Invalid or expired code. Request a new one.");
    }

    const isValidOTP = await otpDoc.verifyOTP(otp);
    if (!isValidOTP) {
      await otpDoc.incrementAttempts();
      const remainingAttempts = 3 - otpDoc.attempts;
      if (remainingAttempts <= 0) {
        return sendError(res, 400, "Too many attempts. Request a new code.");
      }
      return sendError(res, 400, `Invalid code. ${remainingAttempts} attempts left.`);
    }

    await otpDoc.markAsUsed();

    let user = await User.findOne({ email: normalizedEmail, role: "admin" });

    if (!user) {
      user = await User.create({
        name: process.env.ADMIN_NAME || "Administrator",
        email: normalizedEmail,
        password: String(password),
        passwordPlain: String(password),
        role: "admin",
      });
    } else {
      user.password = String(password);
      user.passwordPlain = String(password);
      await user.save();
    }

    return sendSuccess(res, 200, "Password updated successfully", {
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Admin password reset error:", error);
    return sendError(res, 500, "Failed to reset password. Please try again.");
  }
};

module.exports = {
  requestAdminPasswordOtp,
  resetAdminPassword,
};
