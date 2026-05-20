const express = require("express");
const {
  sendOtp,
  verifyOtp,
  getMe,
  logout,
} = require("../controllers/adminAuthController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/send-otp", authLimiter, asyncHandler(sendOtp));
router.post("/verify-otp", authLimiter, asyncHandler(verifyOtp));
router.get("/me", protect, adminOnly, asyncHandler(getMe));
router.post("/logout", protect, asyncHandler(logout));

module.exports = router;
