const express = require("express");
const {
  submitApplication,
  getAdminApplications,
  deleteApplication,
  deleteApplicationsBulk,
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
  "/admin/bulk-delete",
  protect,
  adminOnly,
  asyncHandler(deleteApplicationsBulk)
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  asyncHandler(deleteApplication)
);

router.post(
  "/",
  uploadResume.single("resume"),
  asyncHandler(submitApplication)
);

module.exports = router;
