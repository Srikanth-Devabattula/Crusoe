const express = require("express");
const { sendOtp, verifyOtp, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/send-otp", authLimiter, asyncHandler(sendOtp));
router.post("/verify-otp", authLimiter, asyncHandler(verifyOtp));
router.get("/me", protect, asyncHandler(getMe));

module.exports = router;
