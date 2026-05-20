const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/newsCategoryController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/", asyncHandler(getCategories));
router.post("/", protect, adminOnly, asyncHandler(createCategory));
router.delete("/:id", protect, adminOnly, asyncHandler(deleteCategory));

module.exports = router;
