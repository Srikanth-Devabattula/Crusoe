const mongoose = require("mongoose");

const heroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Image is required"],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      trim: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HeroSlide", heroSlideSchema);
