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

module.exports = { apiLimiter, authLimiter };
