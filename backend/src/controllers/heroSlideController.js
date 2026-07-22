const HeroSlide = require("../models/HeroSlide");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const {
  removeCoverAsset,
  uploadCoverToGridFS,
  validateCoverImageValue,
} = require("../utils/gridfsStorage");

const HERO_IMAGE_BUCKET = "hero-slide-images";
const HERO_ICON_BUCKET = "hero-slide-icons";

const parseHeroSlideBody = (body) => ({
  title: body.title,
  description: body.description,
  image: body.image,
  icon: body.icon,
  published: body.published === true || body.published === "true",
  sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
  removeImage: body.removeImage === true || body.removeImage === "true",
  removeIcon: body.removeIcon === true || body.removeIcon === "true",
});

const resolveAssetFromRequest = async (req, fileField, bodyField, removeField, bucketKey, existing) => {
  const uploaded = req.files?.[fileField]?.[0];

  if (uploaded) {
    const fileId = await uploadCoverToGridFS(bucketKey, uploaded);
    return { value: `gridfs:${fileId}`, previous: existing };
  }

  if (req.body[removeField] === true || req.body[removeField] === "true") {
    return { value: "", previous: existing };
  }

  const url =
    req.body[bodyField] !== undefined ? String(req.body[bodyField]).trim() : undefined;

  if (url !== undefined) {
    return { value: url, previous: existing };
  }

  return { value: undefined, previous: existing };
};

const validateHeroSlideBody = (body, isUpdate = false, existing = null) => {
  const title = body.title !== undefined ? body.title : existing?.title;
  const description =
    body.description !== undefined ? body.description : existing?.description;
  const image = body.image !== undefined ? body.image : existing?.image;
  const icon = body.icon !== undefined ? body.icon : existing?.icon;

  if (!isUpdate || body.title !== undefined) {
    if (!title || !String(title).trim()) return "Title is required";
  }

  if (!isUpdate || body.description !== undefined) {
    if (!description || !String(description).trim()) return "Description is required";
  }

  if (!isUpdate || body.image !== undefined) {
    if (!image || !String(image).trim()) return "Image is required";
    const imageError = validateCoverImageValue(image);
    if (imageError) return imageError;
  }

  if (!isUpdate || body.icon !== undefined) {
    if (!icon || !String(icon).trim()) return "Icon is required";
    const iconError = validateCoverImageValue(icon);
    if (iconError) return iconError;
  }

  return null;
};

const sanitizeHeroSlideBody = (body) => {
  const payload = {};

  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.description !== undefined) {
    payload.description = String(body.description).trim();
  }
  if (body.image !== undefined) payload.image = String(body.image).trim();
  if (body.icon !== undefined) payload.icon = String(body.icon).trim();
  if (body.published !== undefined) payload.published = Boolean(body.published);
  if (body.sortOrder !== undefined) payload.sortOrder = Number(body.sortOrder) || 0;

  return payload;
};

const applyAssetUpdates = async (body, req, existing = null) => {
  const image = await resolveAssetFromRequest(
    req,
    "imageFile",
    "image",
    "removeImage",
    HERO_IMAGE_BUCKET,
    existing?.image ?? null
  );
  if (image.value !== undefined) body.image = image.value;

  const icon = await resolveAssetFromRequest(
    req,
    "iconFile",
    "icon",
    "removeIcon",
    HERO_ICON_BUCKET,
    existing?.icon ?? null
  );
  if (icon.value !== undefined) body.icon = icon.value;

  return { image, icon };
};

const getHeroSlides = async (req, res) => {
  const items = await HeroSlide.find().sort({ sortOrder: 1, createdAt: 1 });
  return sendSuccess(res, 200, "Hero slides retrieved", items);
};

const getPublishedHeroSlides = async (req, res) => {
  const items = await HeroSlide.find({ published: true }).sort({ sortOrder: 1, createdAt: 1 });
  return sendSuccess(res, 200, "Published hero slides retrieved", items);
};

const createHeroSlide = async (req, res) => {
  const body = parseHeroSlideBody(req.body);
  await applyAssetUpdates(body, req);

  const error = validateHeroSlideBody(body);
  if (error) return sendError(res, 400, error);

  const item = await HeroSlide.create(sanitizeHeroSlideBody(body));
  return sendSuccess(res, 201, "Hero slide created", item);
};

const updateHeroSlide = async (req, res) => {
  const existing = await HeroSlide.findById(req.params.id);
  if (!existing) return sendError(res, 404, "Hero slide not found");

  const body = parseHeroSlideBody(req.body);
  const assets = await applyAssetUpdates(body, req, existing);

  const error = validateHeroSlideBody(body, true, existing);
  if (error) return sendError(res, 400, error);

  const payload = sanitizeHeroSlideBody(body);

  if (assets.image.value !== undefined && assets.image.previous && assets.image.previous !== assets.image.value) {
    await removeCoverAsset(assets.image.previous, HERO_IMAGE_BUCKET, null);
  }
  if (assets.icon.value !== undefined && assets.icon.previous && assets.icon.previous !== assets.icon.value) {
    await removeCoverAsset(assets.icon.previous, HERO_ICON_BUCKET, null);
  }
  if (body.removeImage && existing.image) {
    await removeCoverAsset(existing.image, HERO_IMAGE_BUCKET, null);
  }
  if (body.removeIcon && existing.icon) {
    await removeCoverAsset(existing.icon, HERO_ICON_BUCKET, null);
  }

  const item = await HeroSlide.findByIdAndUpdate(existing._id, payload, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, "Hero slide updated", item);
};

const deleteHeroSlide = async (req, res) => {
  const item = await HeroSlide.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 404, "Hero slide not found");

  if (item.image) {
    await removeCoverAsset(item.image, HERO_IMAGE_BUCKET, null);
  }
  if (item.icon) {
    await removeCoverAsset(item.icon, HERO_ICON_BUCKET, null);
  }

  return sendSuccess(res, 200, "Hero slide deleted");
};

module.exports = {
  getHeroSlides,
  getPublishedHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
