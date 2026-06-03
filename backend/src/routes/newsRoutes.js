const express = require("express");
const {
  getNews,
  getPublishedNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadNewsCover } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedNews));
router.get("/slug/:slug", asyncHandler(getNewsBySlug));
router.get("/", protect, requirePermission("news"), asyncHandler(getNews));
router.post(
  "/",
  protect,
  requirePermission("news"),
  uploadNewsCover.single("coverImageFile"),
  asyncHandler(createNews)
);
router.put(
  "/:id",
  protect,
  requirePermission("news"),
  uploadNewsCover.single("coverImageFile"),
  asyncHandler(updateNews)
);
router.delete("/:id", protect, requirePermission("news"), asyncHandler(deleteNews));

module.exports = router;
