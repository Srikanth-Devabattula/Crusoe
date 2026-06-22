const express = require("express");
const {
  getTestimonials,
  getPublishedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadTestimonialPhoto } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedTestimonials));
router.get("/", protect, requirePermission("testimonials"), asyncHandler(getTestimonials));
router.post(
  "/",
  protect,
  requirePermission("testimonials"),
  uploadTestimonialPhoto,
  asyncHandler(createTestimonial)
);
router.put(
  "/:id",
  protect,
  requirePermission("testimonials"),
  uploadTestimonialPhoto,
  asyncHandler(updateTestimonial)
);
router.delete(
  "/:id",
  protect,
  requirePermission("testimonials"),
  asyncHandler(deleteTestimonial)
);

module.exports = router;
