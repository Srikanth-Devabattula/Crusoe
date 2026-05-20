const News = require("../models/News");
const NewsCategory = require("../models/NewsCategory");
const { newsCoverDir } = require("../middleware/uploadMiddleware");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { slugify, uniqueSlug } = require("../utils/slugify");
const {
  removeCoverAsset,
  resolveCoverFromRequest,
  validateCoverImageValue,
} = require("../utils/gridfsStorage");

const NEWS_COVER_BUCKET = "news-covers";

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
  if (coverImage !== undefined && coverImage) {
    const coverError = validateCoverImageValue(coverImage);
    if (coverError) return coverError;
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
  const cover = await resolveCoverFromRequest(req, NEWS_COVER_BUCKET, newsCoverDir, null);

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
  const cover = await resolveCoverFromRequest(
    req,
    NEWS_COVER_BUCKET,
    newsCoverDir,
    existing.coverImage
  );

  if (cover.value !== undefined) body.coverImage = cover.value;

  const error = validateNewsBody(body, true);
  if (error) return sendError(res, 400, error);

  if (body.category) {
    const category = await assertCategoryExists(body.category);
    if (!category) return sendError(res, 400, "Invalid category");
    body.category = category.slug;
  }

  const payload = sanitizeNewsBody(body);

  if (cover.value !== undefined && cover.previous && cover.previous !== cover.value) {
    await removeCoverAsset(cover.previous, NEWS_COVER_BUCKET, newsCoverDir);
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

  await removeCoverAsset(item.coverImage, NEWS_COVER_BUCKET, newsCoverDir);

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
