const express = require("express");
const {
  streamGridFsFile,
  streamLegacyDiskFile,
  uploadContentImage,
  uploadNewsGalleryImage,
} = require("../controllers/fileController");
const {
  protect,
  requireAnyPermission,
} = require("../middleware/authMiddleware");
const { uploadContentImage: uploadContentImageMiddleware } = require("../middleware/uploadMiddleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post(
  "/content-images/upload",
  protect,
  requireAnyPermission("blogs", "news"),
  uploadContentImageMiddleware,
  asyncHandler(uploadContentImage)
);

router.post(
  "/news-covers/upload",
  protect,
  requireAnyPermission("news"),
  uploadContentImageMiddleware,
  asyncHandler(uploadNewsGalleryImage)
);

router.get("/:bucket/:fileId", asyncHandler(streamGridFsFile));
router.get("/legacy/:bucket/:filename", asyncHandler(streamLegacyDiskFile));

module.exports = router;
