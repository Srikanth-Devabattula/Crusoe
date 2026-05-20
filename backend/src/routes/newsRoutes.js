const express = require("express");
const {
  getNews,
  getPublishedNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/newsController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadNewsCover } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedNews));
router.get("/slug/:slug", asyncHandler(getNewsBySlug));
router.get("/", protect, adminOnly, asyncHandler(getNews));
router.post(
  "/",
  protect,
  adminOnly,
  uploadNewsCover.single("coverImageFile"),
  asyncHandler(createNews)
);
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadNewsCover.single("coverImageFile"),
  asyncHandler(updateNews)
);
router.delete("/:id", protect, adminOnly, asyncHandler(deleteNews));

module.exports = router;
