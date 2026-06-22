const express = require("express");
const {
  getTeamMembers,
  getPublishedTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} = require("../controllers/teamController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadTeamPhoto } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedTeam));
router.get("/", protect, requirePermission("team"), asyncHandler(getTeamMembers));
router.post(
  "/",
  protect,
  requirePermission("team"),
  uploadTeamPhoto,
  asyncHandler(createTeamMember)
);
router.put(
  "/:id",
  protect,
  requirePermission("team"),
  uploadTeamPhoto,
  asyncHandler(updateTeamMember)
);
router.delete(
  "/:id",
  protect,
  requirePermission("team"),
  asyncHandler(deleteTeamMember)
);

module.exports = router;
