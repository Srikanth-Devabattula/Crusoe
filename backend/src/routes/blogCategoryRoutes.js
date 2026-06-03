const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/blogCategoryController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getCategories));
router.post("/", protect, requirePermission("blogs"), asyncHandler(createCategory));
router.delete("/:id", protect, requirePermission("blogs"), asyncHandler(deleteCategory));

module.exports = router;
