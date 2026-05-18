const express = require("express");
const { login } = require("../controllers/authController");
const { authLimiter } = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/login", authLimiter, login);

module.exports = router;
