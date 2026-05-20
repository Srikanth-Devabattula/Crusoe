const fs = require("fs");
const path = require("path");

const News = require("../models/News");
const NewsCategory = require("../models/NewsCategory");
const { newsCoverDir } = require("../middleware/uploadMiddleware");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { slugify, uniqueSlug } = require("../utils/slugify");

const isExternalCover = (cover) => /^https?:\/\//i.test(cover || "");
const isLocalCover = (cover) => Boolean(cover) && !isExternalCover(cover);

const removeLocalCoverFile = (cover) => {
  if (!isLocalCover(cover)) return;
  const filePath = path.join(newsCoverDir, path.basename(cover));
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

const parseNewsRequestBody = (body) => ({
  title: body.title,
  slug: body.slug,
  excerpt: body.excerpt,
  content: body.content,
  category: body.category,
  coverImage: body.coverImage,
  featured: body.featured === true || body.featured === "true",
  published: body.published === true || body.published === "true",
  removeCoverImage: body.removeCoverImage === true || body.removeCoverImage === "true",
});

const resolveCoverImage = (req, existingCover) => {
  if (req.file) return { value: req.file.filename, previous: existingCover };
  if (req.body.removeCoverImage === true || req.body.removeCoverImage === "true") {
    return { value: "", previous: existingCover };
  }
  const url =
    req.body.coverImage !== undefined ? String(req.body.coverImage).trim() : undefined;
  if (url !== undefined) return { value: url, previous: existingCover };
  return { value: undefined, previous: existingCover };
};

const getNews = async (req, res) => {
  const items = await News.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "News retrieved", items);
};

const getPublishedNews = async (req, res) => {
  const filter = { published: true };

  if (req.query.category && req.query.category !== "all") {
    const category = await NewsCategory.findOne({ slug: req.query.category });
    if (!category) return sendError(res, 400, "Invalid category");
    filter.category = req.query.category;
  }

  const items = await News.find(filter).sort({ featured: -1, createdAt: -1 });
  return sendSuccess(res, 200, "Published news retrieved", items);
};

const getNewsBySlug = async (req, res) => {
  const item = await News.findOne({ slug: req.params.slug, published: true });
  if (!item) return sendError(res, 404, "News article not found");
  return sendSuccess(res, 200, "News retrieved", item);
};

const validateNewsBody = (body, isUpdate = false) => {
  const { title, slug, excerpt, content, category, coverImage } = body;

  if (!isUpdate || title !== undefined) {
    if (!title || !String(title).trim()) return "Title is required";
  }
  if (!isUpdate || excerpt !== undefined) {
    if (!excerpt || !String(excerpt).trim()) return "Excerpt is required";
  }
  if (!isUpdate || content !== undefined) {
    if (!content || !String(content).trim()) return "Content is required";
  }
  if (!isUpdate || category !== undefined) {
    if (!category || !String(category).trim()) return "Category is required";
  }
  if (slug !== undefined && slug !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only";
  }
  if (
    coverImage !== undefined &&
    coverImage &&
    !/^https?:\/\/.+/i.test(coverImage) &&
    !/^[a-zA-Z0-9._-]+$/.test(coverImage)
  ) {
    return "Cover image must be a valid URL or uploaded file";
  }
  return null;
};

const sanitizeNewsBody = (body) => {
  const payload = {};
  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.slug !== undefined) payload.slug = String(body.slug).trim().toLowerCase();
  if (body.excerpt !== undefined) payload.excerpt = String(body.excerpt).trim();
  if (body.content !== undefined) payload.content = String(body.content).trim();
  if (body.category !== undefined) payload.category = body.category;
  if (body.coverImage !== undefined) payload.coverImage = String(body.coverImage).trim();
  if (body.featured !== undefined) payload.featured = Boolean(body.featured);
  if (body.published !== undefined) payload.published = Boolean(body.published);
  return payload;
};

const clearOtherFeatured = async (newsId) => {
  await News.updateMany({ _id: { $ne: newsId }, featured: true }, { featured: false });
};

const assertCategoryExists = async (slug) =>
  NewsCategory.findOne({ slug: String(slug).toLowerCase().trim() });

const createNews = async (req, res) => {
  const body = parseNewsRequestBody(req.body);
  const cover = resolveCoverImage(req);
  if (cover.value !== undefined) body.coverImage = cover.value;

  const error = validateNewsBody(body);
  if (error) return sendError(res, 400, error);

  const category = await assertCategoryExists(body.category);
  if (!category) return sendError(res, 400, "Invalid category");
  body.category = category.slug;

  const payload = sanitizeNewsBody(body);
  payload.slug = await uniqueSlug(News, payload.slug || slugify(payload.title));
  payload.author = req.user?._id;

  const item = await News.create(payload);
  if (item.featured) await clearOtherFeatured(item._id);

  return sendSuccess(res, 201, "News created", item);
};

const updateNews = async (req, res) => {
  const existing = await News.findById(req.params.id);
  if (!existing) return sendError(res, 404, "News not found");

  const body = parseNewsRequestBody(req.body);
  const cover = resolveCoverImage(req, existing.coverImage);
  if (cover.value !== undefined) body.coverImage = cover.value;

  const error = validateNewsBody(body, true);
  if (error) return sendError(res, 400, error);

  if (body.category) {
    const category = await assertCategoryExists(body.category);
    if (!category) return sendError(res, 400, "Invalid category");
    body.category = category.slug;
  }

  const payload = sanitizeNewsBody(body);

  if (
    cover.value !== undefined &&
    isLocalCover(cover.previous) &&
    cover.previous !== cover.value
  ) {
    removeLocalCoverFile(cover.previous);
  }

  if (payload.slug) {
    payload.slug = await uniqueSlug(News, payload.slug, req.params.id);
  } else if (payload.title) {
    payload.slug = await uniqueSlug(News, slugify(payload.title), req.params.id);
  }

  const item = await News.findByIdAndUpdate(existing._id, payload, {
    new: true,
    runValidators: true,
  });

  if (item.featured) await clearOtherFeatured(item._id);

  return sendSuccess(res, 200, "News updated", item);
};

const deleteNews = async (req, res) => {
  const item = await News.findByIdAndDelete(req.params.id);
  if (!item) return sendError(res, 404, "News not found");
  removeLocalCoverFile(item.coverImage);
  return sendSuccess(res, 200, "News deleted");
};

module.exports = {
  getNews,
  getPublishedNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews,
};
