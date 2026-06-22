const express = require("express");
const {
  getBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const { uploadBlogCover } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/public", asyncHandler(getPublishedBlogs));
router.get("/slug/:slug", asyncHandler(getBlogBySlug));
router.get("/", protect, requirePermission("blogs"), asyncHandler(getBlogs));
router.post(
  "/",
  protect,
  requirePermission("blogs"),
  uploadBlogCover,
  asyncHandler(createBlog)
);
router.put(
  "/:id",
  protect,
  requirePermission("blogs"),
  uploadBlogCover,
  asyncHandler(updateBlog)
);
router.delete("/:id", protect, requirePermission("blogs"), asyncHandler(deleteBlog));

module.exports = router;
