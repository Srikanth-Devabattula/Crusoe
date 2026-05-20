const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const mongoose = require("mongoose");

const GRIDFS_PREFIX = "gridfs:";

const BUCKET_NAMES = {
  "blog-covers": "blogCovers",
  "news-covers": "newsCovers",
};

const isExternalCover = (cover) => /^https?:\/\//i.test(cover || "");

const isGridFsCover = (cover) =>
  typeof cover === "string" && cover.startsWith(GRIDFS_PREFIX);

const isLegacyDiskCover = (cover) =>
  Boolean(cover) && !isExternalCover(cover) && !isGridFsCover(cover);

const getGridFsId = (cover) => cover.slice(GRIDFS_PREFIX.length);

const getBucket = (bucketKey) => {
  const bucketName = BUCKET_NAMES[bucketKey];
  if (!bucketName) {
    throw new Error(`Unknown file bucket: ${bucketKey}`);
  }

  if (mongoose.connection.readyState !== 1) {
    throw new Error("Database not connected");
  }

  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName });
};

const uploadCoverToGridFS = async (bucketKey, file) => {
  const bucket = getBucket(bucketKey);
  const uploadStream = bucket.openUploadStream(file.originalname || "cover", {
    contentType: file.mimetype || "application/octet-stream",
  });

  return new Promise((resolve, reject) => {
    Readable.from(file.buffer)
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve(uploadStream.id.toString()));
  });
};

const deleteGridFsFile = async (bucketKey, fileId) => {
  if (!mongoose.Types.ObjectId.isValid(fileId)) return;

  try {
    const bucket = getBucket(bucketKey);
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
  } catch {
    // File may already be deleted
  }
};

const removeLegacyDiskFile = (cover, diskDir) => {
  if (!isLegacyDiskCover(cover) || !diskDir) return;

  const filePath = path.join(diskDir, path.basename(cover));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const removeCoverAsset = async (cover, bucketKey, diskDir) => {
  if (!cover) return;

  if (isGridFsCover(cover)) {
    await deleteGridFsFile(bucketKey, getGridFsId(cover));
    return;
  }

  removeLegacyDiskFile(cover, diskDir);
};

const resolveCoverFromRequest = async (req, bucketKey, diskDir, existingCover) => {
  if (req.file) {
    const fileId = await uploadCoverToGridFS(bucketKey, req.file);
    return { value: `${GRIDFS_PREFIX}${fileId}`, previous: existingCover };
  }

  if (req.body.removeCoverImage === true || req.body.removeCoverImage === "true") {
    return { value: "", previous: existingCover };
  }

  const url =
    req.body.coverImage !== undefined ? String(req.body.coverImage).trim() : undefined;

  if (url !== undefined) {
    return { value: url, previous: existingCover };
  }

  return { value: undefined, previous: existingCover };
};

const validateCoverImageValue = (coverImage) => {
  if (!coverImage) return null;

  if (isExternalCover(coverImage)) return null;

  if (isGridFsCover(coverImage)) {
    const id = getGridFsId(coverImage);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return "Invalid stored cover image reference";
    }
    return null;
  }

  if (/^[a-zA-Z0-9._-]+$/.test(coverImage)) {
    return null;
  }

  return "Cover image must be a valid URL or uploaded file";
};

module.exports = {
  GRIDFS_PREFIX,
  BUCKET_NAMES,
  isExternalCover,
  isGridFsCover,
  isLegacyDiskCover,
  getGridFsId,
  getBucket,
  uploadCoverToGridFS,
  deleteGridFsFile,
  removeCoverAsset,
  resolveCoverFromRequest,
  validateCoverImageValue,
};
