const Blog = require("../models/Blog");
const { BLOG_CATEGORIES } = require("../models/Blog");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { slugify, uniqueSlug } = require("../utils/slugify");

const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  return sendSuccess(res, 200, "Blogs retrieved", blogs);
};

const getPublishedBlogs = async (req, res) => {
  const filter = { published: true };

  if (req.query.category && req.query.category !== "all") {
    if (!BLOG_CATEGORIES.includes(req.query.category)) {
      return sendError(res, 400, "Invalid category");
    }
    filter.category = req.query.category;
  }

  const blogs = await Blog.find(filter).sort({ featured: -1, createdAt: -1 });
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
  const { title, slug, excerpt, content, category, coverImage, featured, published } =
    body;

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

  if (category !== undefined && !BLOG_CATEGORIES.includes(category)) {
    return "Invalid category";
  }

  if (slug !== undefined && slug !== "" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return "Slug must be lowercase letters, numbers, and hyphens only";
  }

  if (coverImage !== undefined && coverImage && !/^https?:\/\/.+/i.test(coverImage)) {
    return "Cover image must be a valid http(s) URL";
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
  if (body.featured !== undefined) payload.featured = Boolean(body.featured);
  if (body.published !== undefined) payload.published = Boolean(body.published);

  return payload;
};

const clearOtherFeatured = async (blogId) => {
  await Blog.updateMany({ _id: { $ne: blogId }, featured: true }, { featured: false });
};

const createBlog = async (req, res) => {
  const error = validateBlogBody(req.body);
  if (error) return sendError(res, 400, error);

  const payload = sanitizeBlogBody(req.body);
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
  const error = validateBlogBody(req.body, true);
  if (error) return sendError(res, 400, error);

  const payload = sanitizeBlogBody(req.body);

  if (payload.slug) {
    payload.slug = await uniqueSlug(Blog, payload.slug, req.params.id);
  } else if (payload.title) {
    const baseSlug = slugify(payload.title);
    payload.slug = await uniqueSlug(Blog, baseSlug, req.params.id);
  }

  const blog = await Blog.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!blog) {
    return sendError(res, 404, "Blog not found");
  }

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
