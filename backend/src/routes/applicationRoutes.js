const express = require("express");
const {
  submitApplication,
  getAdminApplications,
  deleteApplication,
  deleteApplicationsBulk,
} = require("../controllers/applicationController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadResume } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get(
  "/admin",
  protect,
  requirePermission("applications"),
  asyncHandler(getAdminApplications)
);

router.post(
  "/admin/bulk-delete",
  protect,
  requirePermission("applications"),
  asyncHandler(deleteApplicationsBulk)
);

router.delete(
  "/:id",
  protect,
  requirePermission("applications"),
  asyncHandler(deleteApplication)
);

router.post(
  "/",
  uploadResume.single("resume"),
  asyncHandler(submitApplication)
);

module.exports = router;
