const express = require("express");
const {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getJobs));
router.post("/", protect, adminOnly, asyncHandler(createJob));
router.put("/:id", protect, adminOnly, asyncHandler(updateJob));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteJob));

module.exports = router;
