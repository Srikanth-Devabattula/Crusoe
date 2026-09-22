const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendError } = require("../utils/responseHandler");
const { PERMISSION_KEYS } = require("../constants/permissions");
const { ENV_ADMIN_ID, getEnvAdminUser } = require("../constants/envAdmin");

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

    if (decoded.id === ENV_ADMIN_ID) {
      req.user = getEnvAdminUser();
      return next();
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, 401, "Not authorized, user not found");
    }

    req.user = user;
    next();
  } catch {
    return sendError(res, 401, "Not authorized, token failed");
  }
};

const userHasPermission = (user, permission) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (!PERMISSION_KEYS.includes(permission)) return false;
  return Boolean(user.permissions?.[permission]);
};

const staffHasAnyPermission = (user) => {
  if (!user) return false;
  if (user.role === "admin") return true;
  return PERMISSION_KEYS.some((key) => user.permissions?.[key]);
};

/**
 * Full admin only (e.g. user management).
 */
const superAdminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return sendError(res, 403, "Only administrators can perform this action");
};

/**
 * Admin or staff with the given section permission.
 */
const requirePermission = (permission) => (req, res, next) => {
  if (userHasPermission(req.user, permission)) {
    return next();
  }
  return sendError(res, 403, "You do not have access to this section");
};

const requireAnyPermission =
  (...permissions) =>
  (req, res, next) => {
    if (permissions.some((permission) => userHasPermission(req.user, permission))) {
      return next();
    }
    return sendError(res, 403, "You do not have access to this section");
  };

module.exports = {
  protect,
  superAdminOnly,
  requirePermission,
  requireAnyPermission,
  userHasPermission,
  staffHasAnyPermission,
};
