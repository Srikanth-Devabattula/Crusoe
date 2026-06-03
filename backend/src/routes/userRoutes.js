const express = require("express");
const {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, superAdminOnly } = require("../middleware/authMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.use(protect, superAdminOnly);

router.get("/", asyncHandler(listUsers));
router.post("/", asyncHandler(createUser));
router.put("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

module.exports = router;
