const Blog = require("../models/Blog");
const BlogCategory = require("../models/BlogCategory");
const { blogCoverDir } = require("../middleware/uploadMiddleware");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { slugify, uniqueSlug } = require("../utils/slugify");
const { applyPublishedAt } = require("../utils/publishDate");
const {
  removeCoverAsset,
  resolveGalleryFromRequest,
  validateCoverImageValue,
  validateGalleryImages,
  validateVideoUrls,
  removeGalleryAssets,
  getExistingImagesFromDoc,
  parseVideoUrlsFromBody,
  sanitizeVideoUrlsPayload,
} = require("../utils/gridfsStorage");

const BLOG_COVER_BUCKET = "blog-covers";

const parseBlogRequestBody = (body) => ({
  title: body.title,
  slug: body.slug,
  excerpt: body.excerpt,
  content: body.content,
  category: body.category,
  coverImage: body.coverImage,
  images: body.images,
  videoUrl: body.videoUrl,
  videoUrls: body.videoUrls,
  featured: body.featured === true || body.featured === "true",
  published: body.published === true || body.published === "true",
  publishedAt: body.publishedAt,
  removeCoverImage: body.removeCoverImage === true || body.removeCoverImage === "true",
});

const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Blogs retrieved", blogs);
};

const getPublishedBlogs = async (req, res) => {
  const filter = { published: true };

  if (req.query.category && req.query.category !== "all") {
    const category = await BlogCategory.findOne({ slug: req.query.category });
    if (!category) {
      return sendError(res, 400, "Invalid category");
    }
    filter.category = req.query.category;
  }

  const blogs = await Blog.find(filter).sort({ featured: -1, publishedAt: -1, createdAt: -1 });
  return sendSuccess(res, 200, "Published blogs retrieved", blogs);
};

const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true });

  if (!blog) {
    return sendError(res, 404, "Blog post not found");
  }

  return sendSuccess(res, 200, "Blog retrieved", blog);
};

const validateBlogBody = (body, isUpdate = false) => {
  const { title, slug, excerpt, content, category, coverImage, images, videoUrls } = body;

  if (!isUpdate || title !== undefined) {
    if (!title || !String(title).trim()) {
      return "Title is required";
    }
  }

  if (!isUpdate || excerpt !== undefined) {
    if (!excerpt || !String(excerpt).trim()) {
      return "Excerpt is required";
    }
  }

  if (!isUpdate || content !== undefined) {
    if (!content || !String(content).trim()) {
      return "Content is required";
    }
  }

  if (category !== undefined) {
    if (!category || !String(category).trim()) {
      return "Category is required";
    }
  }

  if (slug !== undefined && slug !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only";
  }

  if (coverImage !== undefined && coverImage) {
    const coverError = validateCoverImageValue(coverImage);
    if (coverError) return coverError;
  }

  if (images !== undefined) {
    const galleryError = validateGalleryImages(images);
    if (galleryError) return galleryError;
  }

  if (videoUrls !== undefined) {
    const videoError = validateVideoUrls(videoUrls);
    if (videoError) return videoError;
  }

  return null;
};

const sanitizeBlogBody = (body) => {
  const payload = {};

  if (body.title !== undefined) payload.title = String(body.title).trim();
  if (body.slug !== undefined) payload.slug = String(body.slug).trim().toLowerCase();
  if (body.excerpt !== undefined) payload.excerpt = String(body.excerpt).trim();
  if (body.content !== undefined) payload.content = String(body.content).trim();
  if (body.category !== undefined) payload.category = body.category;
  if (body.coverImage !== undefined) payload.coverImage = String(body.coverImage).trim();
  if (body.images !== undefined) payload.images = body.images;
  if (body.videoUrls !== undefined) {
    const videoPayload = sanitizeVideoUrlsPayload(body.videoUrls);
    payload.videoUrls = videoPayload.videoUrls;
    payload.videoUrl = videoPayload.videoUrl;
  }
  if (body.featured !== undefined) payload.featured = Boolean(body.featured);
  if (body.published !== undefined) payload.published = Boolean(body.published);

  return payload;
};

const clearOtherFeatured = async (blogId) => {
  await Blog.updateMany({ _id: { $ne: blogId }, featured: true }, { featured: false });
};

const assertCategoryExists = async (slug) => {
  const category = await BlogCategory.findOne({ slug: String(slug).toLowerCase().trim() });
  return category;
};

const createBlog = async (req, res) => {
  const body = parseBlogRequestBody(req.body);
  const parsedVideoUrls = parseVideoUrlsFromBody(req.body);
  if (parsedVideoUrls !== undefined) body.videoUrls = parsedVideoUrls;

  const gallery = await resolveGalleryFromRequest(req, BLOG_COVER_BUCKET, blogCoverDir, null);

  if (gallery.changed) {
    body.images = gallery.images;
    body.coverImage = gallery.coverImage;
  }

  const error = validateBlogBody(body);
  if (error) return sendError(res, 400, error);

  const category = await assertCategoryExists(body.category);
  if (!category) return sendError(res, 400, "Invalid category");
  body.category = category.slug;

  const payload = sanitizeBlogBody(body);
  const publishedAtError = applyPublishedAt(payload, body, null);
  if (publishedAtError) return sendError(res, 400, publishedAtError.error);
  const baseSlug = payload.slug || slugify(payload.title);
  payload.slug = await uniqueSlug(Blog, baseSlug);
  payload.author = req.user?._id;

  const blog = await Blog.create(payload);

  if (blog.featured) {
    await clearOtherFeatured(blog._id);
  }

  return sendSuccess(res, 201, "Blog created", blog);
};

const updateBlog = async (req, res) => {
  const existing = await Blog.findById(req.params.id);

  if (!existing) {
    return sendError(res, 404, "Blog not found");
  }

  const body = parseBlogRequestBody(req.body);
  const parsedVideoUrls = parseVideoUrlsFromBody(req.body);
  if (parsedVideoUrls !== undefined) body.videoUrls = parsedVideoUrls;

  const gallery = await resolveGalleryFromRequest(req, BLOG_COVER_BUCKET, blogCoverDir, existing);

  if (gallery.changed) {
    body.images = gallery.images;
    body.coverImage = gallery.coverImage;
  }

  const error = validateBlogBody(body, true);
  if (error) return sendError(res, 400, error);

  if (body.category) {
    const category = await assertCategoryExists(body.category);
    if (!category) return sendError(res, 400, "Invalid category");
    body.category = category.slug;
  }

  const payload = sanitizeBlogBody(body);
  const publishedAtError = applyPublishedAt(payload, body, existing);
  if (publishedAtError) return sendError(res, 400, publishedAtError.error);

  if (gallery.changed) {
    for (const removed of gallery.removedAssets) {
      await removeCoverAsset(removed, BLOG_COVER_BUCKET, blogCoverDir);
    }
  }

  if (payload.slug) {
    payload.slug = await uniqueSlug(Blog, payload.slug, req.params.id);
  } else if (payload.title) {
    const baseSlug = slugify(payload.title);
    payload.slug = await uniqueSlug(Blog, baseSlug, req.params.id);
  }

  const blog = await Blog.findByIdAndUpdate(existing._id, payload, {
    new: true,
    runValidators: true,
  });

  if (blog.featured) {
    await clearOtherFeatured(blog._id);
  }

  return sendSuccess(res, 200, "Blog updated", blog);
};

const deleteBlog = async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);

  if (!blog) {
    return sendError(res, 404, "Blog not found");
  }

  await removeGalleryAssets(getExistingImagesFromDoc(blog), BLOG_COVER_BUCKET, blogCoverDir);

  return sendSuccess(res, 200, "Blog deleted");
};

module.exports = {
  getBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
};
