const express = require("express");
const { login } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimitMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/login", authLimiter, asyncHandler(login));

module.exports = router;
