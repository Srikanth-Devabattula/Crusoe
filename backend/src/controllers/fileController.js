const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const { blogCoverDir, newsCoverDir } = require("../middleware/uploadMiddleware");
const {
  getBucket,
  BUCKET_NAMES,
  uploadCoverToGridFS,
} = require("../utils/gridfsStorage");
const { sendError, sendSuccess } = require("../utils/responseHandler");

const CONTENT_IMAGE_BUCKET = "content-images";

const LEGACY_DIRS = {
  "blog-covers": blogCoverDir,
  "news-covers": newsCoverDir,
};

const streamGridFsFile = async (req, res) => {
  const { bucket, fileId } = req.params;
  const bucketName = BUCKET_NAMES[bucket];

  if (!bucketName) {
    return sendError(res, 404, "File bucket not found");
  }

  if (!mongoose.Types.ObjectId.isValid(fileId)) {
    return sendError(res, 400, "Invalid file id");
  }

  try {
    const gfsBucket = getBucket(bucket);
    const objectId = new mongoose.Types.ObjectId(fileId);

    const files = await gfsBucket.find({ _id: objectId }).toArray();
    if (!files.length) {
      return sendError(res, 404, "File not found");
    }

    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    res.set("Cache-Control", "public, max-age=31536000, immutable");

    gfsBucket.openDownloadStream(objectId).pipe(res);
  } catch {
    return sendError(res, 404, "File not found");
  }
};

/** Legacy disk uploads (before GridFS) */
const streamLegacyDiskFile = (req, res) => {
  const { bucket, filename } = req.params;
  const dir = LEGACY_DIRS[bucket];

  if (!dir) {
    return sendError(res, 404, "Not found");
  }

  const safeName = path.basename(filename);
  const filePath = path.join(dir, safeName);

  if (!fs.existsSync(filePath)) {
    return sendError(res, 404, "File not found");
  }

  return res.sendFile(filePath);
};

const uploadContentImage = async (req, res) => {
  if (!req.file) {
    return sendError(res, 400, "No image file provided");
  }

  try {
    const fileId = await uploadCoverToGridFS(CONTENT_IMAGE_BUCKET, req.file);
    const url = `/api/files/${CONTENT_IMAGE_BUCKET}/${fileId}`;
    return sendSuccess(res, 201, "Image uploaded", {
      ref: `gridfs:${fileId}`,
      url,
    });
  } catch {
    return sendError(res, 500, "Failed to upload image");
  }
};

module.exports = { streamGridFsFile, streamLegacyDiskFile, uploadContentImage };
