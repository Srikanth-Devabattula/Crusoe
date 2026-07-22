const express = require("express");
const {
  getHeroSlides,
  getPublishedHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} = require("../controllers/heroSlideController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadHeroSlideImages } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedHeroSlides));
router.get("/", protect, requirePermission("heroSlides"), asyncHandler(getHeroSlides));
router.post(
  "/",
  protect,
  requirePermission("heroSlides"),
  uploadHeroSlideImages,
  asyncHandler(createHeroSlide)
);
router.put(
  "/:id",
  protect,
  requirePermission("heroSlides"),
  uploadHeroSlideImages,
  asyncHandler(updateHeroSlide)
);
router.delete(
  "/:id",
  protect,
  requirePermission("heroSlides"),
  asyncHandler(deleteHeroSlide)
);

module.exports = router;
