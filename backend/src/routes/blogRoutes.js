const express = require("express");
const {
  getBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadBlogCover } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedBlogs));
router.get("/slug/:slug", asyncHandler(getBlogBySlug));
router.get("/", protect, adminOnly, asyncHandler(getBlogs));
router.post(
  "/",
  protect,
  adminOnly,
  uploadBlogCover.single("coverImageFile"),
  asyncHandler(createBlog)
);
router.put(
  "/:id",
  protect,
  adminOnly,
  uploadBlogCover.single("coverImageFile"),
  asyncHandler(updateBlog)
);
router.delete("/:id", protect, adminOnly, asyncHandler(deleteBlog));

module.exports = router;
