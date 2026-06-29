const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    logo: {
      type: String,
      required: [true, "Logo is required"],
      trim: true,
    },
    websiteUrl: {
      type: String,
      default: "",
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

module.exports = mongoose.model("Partner", partnerSchema);
