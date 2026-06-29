const express = require("express");
const {
  getPartners,
  getPublishedPartners,
  createPartner,
  updatePartner,
  deletePartner,
} = require("../controllers/partnerController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadPartnerLogo } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedPartners));
router.get("/", protect, requirePermission("partners"), asyncHandler(getPartners));
router.post(
  "/",
  protect,
  requirePermission("partners"),
  uploadPartnerLogo,
  asyncHandler(createPartner)
);
router.put(
  "/:id",
  protect,
  requirePermission("partners"),
  uploadPartnerLogo,
  asyncHandler(updatePartner)
);
router.delete(
  "/:id",
  protect,
  requirePermission("partners"),
  asyncHandler(deletePartner)
);

module.exports = router;
