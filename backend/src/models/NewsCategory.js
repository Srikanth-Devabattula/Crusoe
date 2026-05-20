const mongoose = require("mongoose");

const DEFAULT_CATEGORIES = [
  { name: "Announcements", slug: "announcements" },
  { name: "Press Release", slug: "press-release" },
  { name: "Company Update", slug: "company-update" },
  { name: "Events", slug: "events" },
  { name: "Industry", slug: "industry" },
];

const newsCategorySchema = new mongoose.Schema(
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

const NewsCategory = mongoose.model("NewsCategory", newsCategorySchema);

module.exports = NewsCategory;
module.exports.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
