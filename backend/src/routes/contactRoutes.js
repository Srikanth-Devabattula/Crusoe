const express = require("express");
const { submitContact } = require("../controllers/contactController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/", asyncHandler(submitContact));

module.exports = router;
