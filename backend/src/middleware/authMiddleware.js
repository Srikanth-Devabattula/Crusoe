const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/responseHandler");

/**
 * Protect routes — requires valid JWT
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return sendError(res, 401, "Not authorized, no token");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return sendError(res, 401, "Not authorized, user not found");
    }

    next();
  } catch {
    return sendError(res, 401, "Not authorized, token failed");
  }
};

/**
 * Restrict to admin role
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return sendError(res, 403, "Not authorized as admin");
  }
};

module.exports = { protect, adminOnly };
