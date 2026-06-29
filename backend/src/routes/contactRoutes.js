const express = require("express");
const {
  submitContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(submitContact));
router.get("/", protect, requirePermission("contacts"), asyncHandler(getContacts));
router.patch(
  "/:id",
  protect,
  requirePermission("contacts"),
  asyncHandler(updateContact)
);
router.delete(
  "/:id",
  protect,
  requirePermission("contacts"),
  asyncHandler(deleteContact)
);

module.exports = router;
