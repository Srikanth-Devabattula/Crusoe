const mongoose = require("mongoose");

const BLOG_CATEGORIES = [
  "technology",
  "engineering",
  "company-news",
  "insights",
  "product",
];

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: BLOG_CATEGORIES,
      default: "insights",
    },
    coverImage: {
      type: String,
      default: "",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
module.exports.BLOG_CATEGORIES = BLOG_CATEGORIES;
