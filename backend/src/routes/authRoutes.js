const express = require("express");
const {
  hasAdmin,
  register,
  login,
  getMe,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/has-admin", asyncHandler(hasAdmin));
router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));

module.exports = router;
