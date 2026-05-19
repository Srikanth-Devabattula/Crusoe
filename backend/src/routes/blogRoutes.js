const express = require("express");
const {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getBlogs));
router.post("/", protect, adminOnly, asyncHandler(createBlog));
router.put("/:id", protect, adminOnly, asyncHandler(updateBlog));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteBlog));

module.exports = router;
