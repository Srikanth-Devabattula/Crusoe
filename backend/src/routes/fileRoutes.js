const express = require("express");
const {
  streamGridFsFile,
  streamLegacyDiskFile,
} = require("../controllers/fileController");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.get("/:bucket/:fileId", asyncHandler(streamGridFsFile));
router.get("/legacy/:bucket/:filename", asyncHandler(streamLegacyDiskFile));

module.exports = router;
