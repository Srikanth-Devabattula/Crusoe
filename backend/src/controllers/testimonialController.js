const Testimonial = require("../models/Testimonial");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const {
  removeCoverAsset,
  resolveCoverFromRequest,
  validateCoverImageValue,
} = require("../utils/gridfsStorage");

const TESTIMONIAL_PHOTO_BUCKET = "testimonial-photos";

const parseTestimonialBody = (body) => ({
  name: body.name,
  title: body.title,
  company: body.company,
  quote: body.quote,
  photo: body.photo,
  rating: body.rating !== undefined ? Number(body.rating) : undefined,
  type: body.type,
  videoUrl: body.videoUrl,
  published: body.published === true || body.published === "true",
  sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
  removePhoto: body.removePhoto === true || body.removePhoto === "true",
});

const validateTestimonialBody = (body, isUpdate = false) => {
  const { name, title, quote, type, videoUrl, photo, rating } = body;

  if (!isUpdate || name !== undefined) {
    if (!name || !String(name).trim()) return "Name is required";
  }

  if (!isUpdate || title !== undefined) {
    if (!title || !String(title).trim()) return "Title is required";
  }

  if (type !== undefined && !["text", "video"].includes(type)) {
    return "Type must be text or video";
  }

  const effectiveType = type || "text";

  if (!isUpdate || quote !== undefined) {
    if (effectiveType === "text" && !isUpdate && (!quote || !String(quote).trim())) {
      return "Quote is required for text testimonials";
    }
  }

  if (videoUrl !== undefined && videoUrl && !/^https?:\/\/.+/i.test(String(videoUrl))) {
    return "Video URL must be a valid https URL";
  }

  if (rating !== undefined) {
    const num = Number(rating);
    if (!Number.isFinite(num) || num < 1 || num > 5) {
      return "Rating must be between 1 and 5";
    }
  }

  if (photo !== undefined && photo) {
    const photoError = validateCoverImageValue(photo);
    if (photoError) return photoError;
  }

  return null;
};

const sanitizeTestimonialBody = (body) => {
  const payload = {};

  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.company !== undefined) payload.company = String(body.company).trim();
  if (body.quote !== undefined) payload.quote = String(body.quote).trim();
  if (body.photo !== undefined) payload.photo = String(body.photo).trim();
  if (body.rating !== undefined) payload.rating = Math.min(5, Math.max(1, Number(body.rating)));
  if (body.type !== undefined) payload.type = body.type;
  if (body.videoUrl !== undefined) payload.videoUrl = String(body.videoUrl).trim();
  if (body.published !== undefined) payload.published = Boolean(body.published);
  if (body.sortOrder !== undefined) payload.sortOrder = Number(body.sortOrder) || 0;

  return payload;
};

const getTestimonials = async (req, res) => {
  const items = await Testimonial.find().sort({ sortOrder: 1, createdAt: -1 });
  return sendSuccess(res, 200, "Testimonials retrieved", items);
};

const getPublishedTestimonials = async (req, res) => {
  const filter = { published: true };
  if (req.query.type && ["text", "video"].includes(req.query.type)) {
    filter.type = req.query.type;
  }
  const items = await Testimonial.find(filter).sort({ sortOrder: 1, createdAt: -1 });
  return sendSuccess(res, 200, "Published testimonials retrieved", items);
};

const createTestimonial = async (req, res) => {
  const body = parseTestimonialBody(req.body);
  req.body.coverImage = req.body.photo;
  req.body.removeCoverImage = req.body.removePhoto;
  const photo = await resolveCoverFromRequest(
    req,
    TESTIMONIAL_PHOTO_BUCKET,
    null,
    null
  );
  if (photo.value !== undefined) body.photo = photo.value;

  const error = validateTestimonialBody(body);
  if (error) return sendError(res, 400, error);

  const item = await Testimonial.create(sanitizeTestimonialBody(body));
  return sendSuccess(res, 201, "Testimonial created", item);
};

const updateTestimonial = async (req, res) => {
  const existing = await Testimonial.findById(req.params.id);
  if (!existing) return sendError(res, 404, "Testimonial not found");

  const body = parseTestimonialBody(req.body);
  req.body.coverImage = req.body.photo;
  req.body.removeCoverImage = req.body.removePhoto;
  const photo = await resolveCoverFromRequest(
    req,
    TESTIMONIAL_PHOTO_BUCKET,
    null,
    existing.photo
  );
  if (photo.value !== undefined) body.photo = photo.value;
  if (body.removePhoto) body.photo = "";

  const error = validateTestimonialBody(body, true);
  if (error) return sendError(res, 400, error);

  const payload = sanitizeTestimonialBody(body);

  if (photo.value !== undefined && photo.previous && photo.previous !== photo.value) {
    await removeCoverAsset(photo.previous, TESTIMONIAL_PHOTO_BUCKET, null);
  }
  if (body.removePhoto && existing.photo) {
    await removeCoverAsset(existing.photo, TESTIMONIAL_PHOTO_BUCKET, null);
  }

  const item = await Testimonial.findByIdAndUpdate(existing._id, payload, {
    new: true,
    runValidators: true,
  });

  return sendSuccess(res, 200, "Testimonial updated", item);
};

const deleteTestimonial = async (req, res) => {
  const item = await Testimonial.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 404, "Testimonial not found");

  if (item.photo) {
    await removeCoverAsset(item.photo, TESTIMONIAL_PHOTO_BUCKET, null);
  }

  return sendSuccess(res, 200, "Testimonial deleted");
};

module.exports = {
  getTestimonials,
  getPublishedTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
