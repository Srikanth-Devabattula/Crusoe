const express = require("express");
const {
  submitContact,
  getAdminContacts,
  updateContactStatus,
  deleteContact,
  deleteContactsBulk,
} = require("../controllers/contactController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/admin", protect, requirePermission("contacts"), asyncHandler(getAdminContacts));

router.post(
  "/admin/bulk-delete",
  protect,
  requirePermission("contacts"),
  asyncHandler(deleteContactsBulk)
);

router.patch(
  "/:id/status",
  protect,
  requirePermission("contacts"),
  asyncHandler(updateContactStatus)
);

router.delete("/:id", protect, requirePermission("contacts"), asyncHandler(deleteContact));

router.post("/", asyncHandler(submitContact));

module.exports = router;
