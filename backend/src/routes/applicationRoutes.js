const express = require("express");
const { submitApplication } = require("../controllers/applicationController");
const { uploadResume } = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/", uploadResume.single("resume"), submitApplication);

module.exports = router;
