const express = require("express");
const {
  submitApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");
const { uploadResume } = require("../middleware/uploadMiddleware");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/",
  uploadResume.single("resume"),
  asyncHandler(submitApplication)
);
router.get(
  "/",
  protect,
  requirePermission("applications"),
  asyncHandler(getApplications)
);
router.patch(
  "/:id",
  protect,
  requirePermission("applications"),
  asyncHandler(updateApplication)
);
router.delete(
  "/:id",
  protect,
  requirePermission("applications"),
  asyncHandler(deleteApplication)
);

module.exports = router;
