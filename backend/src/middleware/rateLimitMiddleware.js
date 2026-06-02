const rateLimit = require("express-rate-limit");

const skipOptions = (req) => req.method === "OPTIONS";

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
});

/**
 * Stricter limiter for auth routes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
  },
  skip: skipOptions,
});

/**
 * OTP request rate limiter - stricter for OTP requests
 */
const otpRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again in 1 hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: (req) => {
    // Rate limit by both IP and email for better security
    return `otp-request-${req.ip}-${req.body.email || "unknown"}`;
  },
});

/**
 * OTP verification rate limiter - allow more attempts for verification
 */
const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 verification attempts per 15 minutes per IP
  message: {
    success: false,
    message: "Too many verification attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipOptions,
  keyGenerator: (req) => {
    // Rate limit by both IP and email
    return `otp-verify-${req.ip}-${req.body.email || "unknown"}`;
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
};
