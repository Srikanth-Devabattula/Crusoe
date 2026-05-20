const News = require("../models/News");
const NewsCategory = require("../models/NewsCategory");
const { DEFAULT_CATEGORIES } = require("../models/NewsCategory");
const { sendSuccess, sendError } = require("../utils/responseHandler");
const { slugify, uniqueSlug } = require("../utils/slugify");

const ensureDefaultCategories = async () => {
  const count = await NewsCategory.countDocuments();
  if (count > 0) return;

  await NewsCategory.insertMany(DEFAULT_CATEGORIES);
};

const getCategories = async (req, res) => {
  await ensureDefaultCategories();

  const categories = await NewsCategory.find().sort({ name: 1 });
  return sendSuccess(res, 200, "Categories retrieved", categories);
};

const createCategory = async (req, res) => {
  const { name, slug: slugInput } = req.body;

  if (!name || !String(name).trim()) {
    return sendError(res, 400, "Category name is required");
  }

  const baseSlug = slugInput?.trim() ? slugify(slugInput) : slugify(name);

  if (!baseSlug) {
    return sendError(res, 400, "Could not generate a valid slug");
  }

  const slug = await uniqueSlug(NewsCategory, baseSlug);

  const category = await NewsCategory.create({
    name: String(name).trim(),
    slug,
  });

  return sendSuccess(res, 201, "Category created", category);
};

const deleteCategory = async (req, res) => {
  const category = await NewsCategory.findById(req.params.id);

  if (!category) {
    return sendError(res, 404, "Category not found");
  }

  const postsUsing = await News.countDocuments({ category: category.slug });

  if (postsUsing > 0) {
    return sendError(
      res,
      400,
      `Cannot delete — ${postsUsing} news article(s) use this category`
    );
  }

  await category.deleteOne();

  return sendSuccess(res, 200, "Category deleted");
};

module.exports = { getCategories, createCategory, deleteCategory };
