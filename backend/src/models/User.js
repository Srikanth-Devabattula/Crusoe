const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { DEFAULT_PERMISSIONS } = require("../constants/permissions");

const permissionsSchema = new mongoose.Schema(
  {
    blogs: { type: Boolean, default: false },
    news: { type: Boolean, default: false },
    jobs: { type: Boolean, default: false },
    testimonials: { type: Boolean, default: false },
    team: { type: Boolean, default: false },
    partners: { type: Boolean, default: false },
    contacts: { type: Boolean, default: false },
    applications: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    /** Last password set via admin panel (for admin reference only; not used for login). */
    passwordPlain: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "staff"],
      default: "staff",
    },
    permissions: {
      type: permissionsSchema,
      default: () => ({ ...DEFAULT_PERMISSIONS }),
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
