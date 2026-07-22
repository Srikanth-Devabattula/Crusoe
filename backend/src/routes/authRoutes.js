const express = require("express");
const {
  hasAdmin,
  adminLogin,
  register,
  login,
  getMe,
} = require("../controllers/authController");
const {
  requestOTP,
  verifyOTP,
  resendOTP,
} = require("../controllers/otpController");
const {
  requestAdminPasswordOtp,
  resetAdminPassword,
} = require("../controllers/adminPasswordController");
const { protect } = require("../middleware/authMiddleware");
const {
  authLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
} = require("../middleware/rateLimitMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/has-admin", asyncHandler(hasAdmin));
router.post("/admin-login", authLimiter, asyncHandler(adminLogin));
router.post("/register", authLimiter, asyncHandler(register));
router.post("/login", authLimiter, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));

router.post("/request-otp", otpRequestLimiter, asyncHandler(requestOTP));
router.post("/verify-otp", otpVerifyLimiter, asyncHandler(verifyOTP));
router.post("/resend-otp", otpRequestLimiter, asyncHandler(resendOTP));

router.post(
  "/admin/forgot-password/request-otp",
  otpRequestLimiter,
  asyncHandler(requestAdminPasswordOtp)
);
router.post(
  "/admin/forgot-password/reset",
  otpVerifyLimiter,
  asyncHandler(resetAdminPassword)
);

module.exports = router;
