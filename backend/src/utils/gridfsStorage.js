const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const mongoose = require("mongoose");

const GRIDFS_PREFIX = "gridfs:";

const BUCKET_NAMES = {
  "blog-covers": "blogCovers",
  "news-covers": "newsCovers",
  "testimonial-photos": "testimonialPhotos",
  "team-photos": "teamPhotos",
  "partner-logos": "partnerLogos",
  "hero-slide-images": "heroSlideImages",
  "hero-slide-icons": "heroSlideIcons",
  "content-images": "contentImages",
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

  if (coverImage.startsWith("/")) {
    return null;
  }

  return "Cover image must be a valid URL or uploaded file";
};

const parseJsonArrayField = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getUploadFilesFromRequest = (req) => {
  const files = [];

  if (req.file) {
    files.push(req.file);
  }

  if (req.files) {
    if (Array.isArray(req.files)) {
      files.push(...req.files);
    } else {
      if (req.files.coverImageFile) files.push(...req.files.coverImageFile);
      if (req.files.galleryImages) files.push(...req.files.galleryImages);
    }
  }

  return files;
};

const uploadGalleryFiles = async (bucketKey, files) => {
  const refs = [];
  for (const file of files) {
    const fileId = await uploadCoverToGridFS(bucketKey, file);
    refs.push(`${GRIDFS_PREFIX}${fileId}`);
  }
  return refs;
};

const getExistingImagesFromDoc = (doc) => {
  if (doc?.images?.length) return [...doc.images];
  if (doc?.coverImage) return [doc.coverImage];
  return [];
};

const resolveGalleryFromRequest = async (req, bucketKey, diskDir, existingDoc) => {
  const existingImages = getExistingImagesFromDoc(existingDoc);
  const uploadFiles = getUploadFilesFromRequest(req);
  const keepImages = parseJsonArrayField(req.body.keepImages);
  const removeImages = parseJsonArrayField(req.body.removeImages);
  const imageUrls = parseJsonArrayField(req.body.imageUrls);
  const removeAllImages =
    req.body.removeAllImages === true || req.body.removeAllImages === "true";
  const legacyCoverUrl =
    req.body.coverImage !== undefined ? String(req.body.coverImage).trim() : undefined;
  const hasGalleryMutation =
    uploadFiles.length > 0 ||
    keepImages.length > 0 ||
    removeImages.length > 0 ||
    imageUrls.length > 0 ||
    removeAllImages ||
    legacyCoverUrl !== undefined;

  if (!hasGalleryMutation) {
    return { changed: false, images: existingImages, coverImage: existingImages[0] || "", removedAssets: [] };
  }

  let gallery =
    keepImages.length > 0 || removeImages.length > 0 || removeAllImages
      ? [...keepImages]
      : [...existingImages];

  const removedAssets = [];

  if (removeAllImages) {
    for (const image of existingImages) {
      if (!removedAssets.includes(image)) removedAssets.push(image);
    }
    gallery = [];
  } else {
    for (const removed of removeImages) {
      if (gallery.includes(removed)) {
        gallery = gallery.filter((img) => img !== removed);
      }
      if (existingImages.includes(removed) && !removedAssets.includes(removed)) {
        removedAssets.push(removed);
      }
    }
  }

  if (uploadFiles.length > 0) {
    const uploaded = await uploadGalleryFiles(bucketKey, uploadFiles);
    gallery = [...gallery, ...uploaded];
  }

  for (const url of imageUrls) {
    const trimmed = String(url).trim();
    if (trimmed) gallery.push(trimmed);
  }

  if (legacyCoverUrl !== undefined && legacyCoverUrl && !gallery.includes(legacyCoverUrl)) {
    gallery.push(legacyCoverUrl);
  }

  gallery = gallery.filter(Boolean);

  return {
    changed: true,
    images: gallery,
    coverImage: gallery[0] || "",
    removedAssets,
  };
};

const validateGalleryImages = (images) => {
  if (!images?.length) return null;

  for (const image of images) {
    const error = validateCoverImageValue(image);
    if (error) return error;
  }

  return null;
};

const validateVideoUrl = (videoUrl) => {
  if (!videoUrl) return null;

  const trimmed = String(videoUrl).trim();
  if (!trimmed) return null;

  if (!/^https?:\/\/.+/i.test(trimmed)) {
    return "Video URL must be a valid https URL";
  }

  return null;
};

const validateVideoUrls = (videoUrls) => {
  if (!videoUrls?.length) return null;

  for (const url of videoUrls) {
    const error = validateVideoUrl(url);
    if (error) return error;
  }

  return null;
};

const parseVideoUrlsFromBody = (body) => {
  if (body.videoUrls !== undefined) {
    const parsed = parseJsonArrayField(body.videoUrls);
    return parsed.map((url) => String(url).trim()).filter(Boolean);
  }

  if (body.videoUrl !== undefined) {
    const single = String(body.videoUrl).trim();
    return single ? [single] : [];
  }

  return undefined;
};

const normalizeVideoUrlsFromDoc = (doc) => {
  if (doc?.videoUrls?.length) return [...doc.videoUrls];
  if (doc?.videoUrl) return [doc.videoUrl];
  return [];
};

const sanitizeVideoUrlsPayload = (videoUrls) => {
  const cleaned = (videoUrls || []).map((url) => String(url).trim()).filter(Boolean);
  return {
    videoUrls: cleaned,
    videoUrl: cleaned[0] || "",
  };
};

const removeGalleryAssets = async (images, bucketKey, diskDir) => {
  const unique = [...new Set((images || []).filter(Boolean))];
  for (const image of unique) {
    await removeCoverAsset(image, bucketKey, diskDir);
  }
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
  parseJsonArrayField,
  getUploadFilesFromRequest,
  getExistingImagesFromDoc,
  resolveGalleryFromRequest,
  validateGalleryImages,
  validateVideoUrl,
  validateVideoUrls,
  parseVideoUrlsFromBody,
  normalizeVideoUrlsFromDoc,
  sanitizeVideoUrlsPayload,
  removeGalleryAssets,
};
