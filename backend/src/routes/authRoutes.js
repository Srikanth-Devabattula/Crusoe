const express = require("express");
const { createAccount, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/create-account", authLimiter, asyncHandler(createAccount));
router.post("/login", authLimiter, asyncHandler(login));
router.get("/me", protect, asyncHandler(getMe));

module.exports = router;
