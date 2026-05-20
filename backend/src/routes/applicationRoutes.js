const express = require("express");
const {
  submitApplication,
  getAdminApplications,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadResume } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/admin",
  protect,
  adminOnly,
  asyncHandler(getAdminApplications)
);

router.post(
  "/",
  uploadResume.single("resume"),
  asyncHandler(submitApplication)
);

module.exports = router;
