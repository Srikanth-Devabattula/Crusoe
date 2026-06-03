const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/newsCategoryController");
const { protect, requirePermission } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getCategories));
router.post("/", protect, requirePermission("news"), asyncHandler(createCategory));
router.delete("/:id", protect, requirePermission("news"), asyncHandler(deleteCategory));

module.exports = router;
