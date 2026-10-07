const path = require("path");
const fs = require("fs");

const { blogCoverDir, newsCoverDir } = require("../middleware/uploadMiddleware");
const {
  BUCKET_NAMES,
  uploadCoverToGridFS,
} = require("../utils/gridfsStorage");
const { isValidObjectId } = require("../utils/objectId");
const { prisma } = require("../lib/prisma");
const { sendError, sendSuccess } = require("../utils/responseHandler");

const CONTENT_IMAGE_BUCKET = "content-images";
const NEWS_COVER_BUCKET = "news-covers";

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

  if (!isValidObjectId(fileId)) {
    return sendError(res, 400, "Invalid file id");
  }

  try {
    const file = await prisma.storedFile.findUnique({ where: { id: fileId } });
    if (!file || file.bucket !== bucket) {
      return sendError(res, 404, "File not found");
    }

    res.set("Content-Type", file.contentType || "application/octet-stream");
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(Buffer.from(file.data));
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

const uploadGridFsImage = async (req, res, bucketKey) => {
  if (!req.file) {
    return sendError(res, 400, "No image file provided");
  }

  try {
    const fileId = await uploadCoverToGridFS(bucketKey, req.file);
    const url = `/api/files/${bucketKey}/${fileId}`;
    return sendSuccess(res, 201, "Image uploaded", {
      ref: `gridfs:${fileId}`,
      url,
    });
  } catch {
    return sendError(res, 500, "Failed to upload image");
  }
};

const uploadContentImage = (req, res) => uploadGridFsImage(req, res, CONTENT_IMAGE_BUCKET);

const uploadNewsGalleryImage = (req, res) => uploadGridFsImage(req, res, NEWS_COVER_BUCKET);

module.exports = {
  streamGridFsFile,
  streamLegacyDiskFile,
  uploadContentImage,
  uploadNewsGalleryImage,
};
