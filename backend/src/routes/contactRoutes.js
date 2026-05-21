const express = require("express");
const {
  submitContact,
  getAdminContacts,
  updateContactStatus,
  deleteContact,
  deleteContactsBulk,
} = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/admin", protect, adminOnly, asyncHandler(getAdminContacts));

router.post(
  "/admin/bulk-delete",
  protect,
  adminOnly,
  asyncHandler(deleteContactsBulk)
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  asyncHandler(updateContactStatus)
);

router.delete("/:id", protect, adminOnly, asyncHandler(deleteContact));

router.post("/", asyncHandler(submitContact));

module.exports = router;
