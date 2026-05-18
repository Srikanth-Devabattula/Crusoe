const Blog = require("../models/Blog");
const { sendSuccess, sendError } = require("../utils/responseHandler");

/**
 * @route   GET /api/blogs
 * @desc    Get all blogs
 * @access  Public
 */
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Blogs retrieved", blogs);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   POST /api/blogs
 * @desc    Create blog
 * @access  Private/Admin
 */
const createBlog = async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, author: req.user?._id });
    return sendSuccess(res, 201, "Blog created", blog);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   PUT /api/blogs/:id
 * @desc    Update blog
 * @access  Private/Admin
 */
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return sendError(res, 404, "Blog not found");
    }

    return sendSuccess(res, 200, "Blog updated", blog);
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

/**
 * @route   DELETE /api/blogs/:id
 * @desc    Delete blog
 * @access  Private/Admin
 */
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return sendError(res, 404, "Blog not found");
    }

    return sendSuccess(res, 200, "Blog deleted");
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

module.exports = { getBlogs, createBlog, updateBlog, deleteBlog };
