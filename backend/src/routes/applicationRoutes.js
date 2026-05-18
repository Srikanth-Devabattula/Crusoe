const express = require("express");
const { submitApplication } = require("../controllers/applicationController");
const { uploadResume } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/",
  uploadResume.single("resume"),
  asyncHandler(submitApplication)
);

module.exports = router;
