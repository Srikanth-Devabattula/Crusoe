const User = require("../models/User");
const OTP = require("../models/OTP");
const generateToken = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { isValidEmail } = require("../utils/validators");
const { sendOTPEmail } = require("../services/otpEmailService");

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

const setAuthCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/**
 * @route   POST /api/auth/request-otp
 * @desc    Send OTP to user's email
 * @access  Public
 */
const requestOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 400, "Email is required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name: email.split("@")[0],
        email: email.toLowerCase(),
        password: "temp-password-will-be-updated",
        role: "user",
      });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const { otpDoc, plainOTP } = await OTP.createOTP(
      email,
      ipAddress,
      userAgent,
    );

    await sendOTPEmail(email, plainOTP, {
      expiryMinutes: 5,
      userName: user.name,
    });

    // Log OTP request without exposing email in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`OTP requested for ${email} from IP: ${ipAddress}`);
    }

    return sendSuccess(res, 200, "OTP sent successfully", {
      email: email.toLowerCase(),
      expiresIn: 300,
      message: "Please check your email for the verification code",
    });
  } catch (error) {
    console.error("OTP request error:", error.message || error);

    if (isEmailDeliveryError(error)) {
      return sendError(
        res,
        503,
        "Email service temporarily unavailable. Please try again later.",
      );
    }

    if (error.code === 11000) {
      return sendError(
        res,
        429,
        "OTP request in progress. Please wait before requesting again.",
      );
    }

    return sendError(res, 500, "Failed to send OTP. Please try again.");
  }
};

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP and login user
 * @access  Public
 */
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendError(res, 400, "Email and OTP are required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  if (!/^\d{6}$/.test(otp)) {
    return sendError(
      res,
      400,
      "Invalid OTP format. Please enter a 6-digit code.",
    );
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(res, 404, "User not found. Please request a new OTP.");
    }

    const otpDoc = await OTP.findValidOTP(email);
    if (!otpDoc) {
      return sendError(
        res,
        400,
        "Invalid or expired OTP. Please request a new one.",
      );
    }

    if (!otpDoc.isValid()) {
      return sendError(
        res,
        400,
        "OTP has expired or maximum attempts exceeded. Please request a new one.",
      );
    }

    const isValidOTP = await otpDoc.verifyOTP(otp);

    if (!isValidOTP) {
      await otpDoc.incrementAttempts();

      const remainingAttempts = 3 - otpDoc.attempts;
      if (remainingAttempts <= 0) {
        return sendError(
          res,
          400,
          "Maximum verification attempts exceeded. Please request a new OTP.",
        );
      }

      return sendError(
        res,
        400,
        `Invalid OTP. ${remainingAttempts} attempts remaining.`,
      );
    }

    await otpDoc.markAsUsed();

    const token = generateToken(user._id);
    setAuthCookie(res, token);

    const ipAddress = req.ip || req.connection.remoteAddress;
    // Log successful login without exposing email in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Successful OTP login for ${email} from IP: ${ipAddress}`);
    }

    return sendSuccess(res, 200, "Login successful", {
      user: formatUser(user),
      token,
      loginMethod: "otp",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return sendError(res, 500, "Failed to verify OTP. Please try again.");
  }
};

/**
 * @route   POST /api/auth/resend-otp
 * @desc    Resend OTP to user's email
 * @access  Public
 */
const resendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendError(res, 400, "Email is required");
  }

  if (!isValidEmail(email)) {
    return sendError(res, 400, "Invalid email format");
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return sendError(
        res,
        404,
        "User not found. Please request a new OTP first.",
      );
    }

    const existingOTP = await OTP.findOne({
      email: email.toLowerCase(),
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (existingOTP) {
      return sendError(
        res,
        429,
        "Please wait at least 1 minute before requesting another OTP.",
      );
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("User-Agent");

    const { otpDoc, plainOTP } = await OTP.createOTP(
      email,
      ipAddress,
      userAgent,
    );

    await sendOTPEmail(email, plainOTP, {
      expiryMinutes: 5,
      userName: user.name,
    });

    // Log OTP resend without exposing email in production
    if (process.env.NODE_ENV !== 'production') {
      console.log(`OTP resent for ${email} from IP: ${ipAddress}`);
    }

    return sendSuccess(res, 200, "OTP resent successfully", {
      email: email.toLowerCase(),
      expiresIn: 300,
      message: "Please check your email for the new verification code",
    });
  } catch (error) {
    console.error("OTP resend error:", error);

    if (isEmailDeliveryError(error)) {
      return sendError(
        res,
        503,
        "Email service temporarily unavailable. Please try again later.",
      );
    }

    return sendError(res, 500, "Failed to resend OTP. Please try again.");
  }
};

module.exports = {
  requestOTP,
  verifyOTP,
  resendOTP,
};
