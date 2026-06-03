const express = require("express");
const {
  getJobs,
  getPublishedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedJobs));
router.get("/:id", asyncHandler(getJobById));
router.get("/", asyncHandler(getJobs));
router.post("/", protect, requirePermission("jobs"), asyncHandler(createJob));
router.put("/:id", protect, requirePermission("jobs"), asyncHandler(updateJob));
router.delete("/:id", protect, requirePermission("jobs"), asyncHandler(deleteJob));

module.exports = router;
