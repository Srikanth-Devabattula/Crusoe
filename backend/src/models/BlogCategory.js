const mongoose = require("mongoose");

const DEFAULT_CATEGORIES = [
  { name: "Technology", slug: "technology" },
  { name: "Engineering", slug: "engineering" },
  { name: "Company News", slug: "company-news" },
  { name: "Insights", slug: "insights" },
  { name: "Product", slug: "product" },
];

const blogCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

module.exports = BlogCategory;
module.exports.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
