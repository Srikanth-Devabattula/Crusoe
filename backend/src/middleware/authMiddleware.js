const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/responseHandler");
const { isAdminEmail } = require("../config/adminEmails");
const { ADMIN_TOKEN_COOKIE } = require("../utils/adminCookie");

const extractToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer")) {
    return req.headers.authorization.split(" ")[1];
  }

  if (req.cookies?.[ADMIN_TOKEN_COOKIE]) {
    return req.cookies[ADMIN_TOKEN_COOKIE];
  }

  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};

/**
 * Protect routes — requires valid JWT
 */
const protect = async (req, res, next) => {
  const token = extractToken(req);

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
 * Restrict to allowlisted admin
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin" && isAdminEmail(req.user.email)) {
    next();
  } else {
    return sendError(res, 403, "You don't have access to admin panel");
  }
};

module.exports = { protect, adminOnly };
