const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true, // Index for fast lookups
    },
    hashedOTP: {
      type: String,
      required: [true, "OTP is required"],
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiry time is required"],
      index: true, // Index for cleanup queries
    },
    attempts: {
      type: Number,
      default: 0,
      max: [3, "Maximum attempts exceeded"],
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: String,
      required: false, // Track IP for additional security
    },
    userAgent: {
      type: String,
      required: false, // Track user agent for security
    }
  },
  { 
    timestamps: true,
    // Auto-delete expired documents
    expireAt: { type: Date, default: Date.now, expires: 600 } // 10 minutes fallback cleanup
  }
);

// Compound index for efficient queries
otpSchema.index({ email: 1, expiresAt: 1 });
otpSchema.index({ email: 1, isUsed: 1 });

// Hash OTP before saving
otpSchema.pre("save", async function (next) {
  if (!this.isModified("hashedOTP")) return next();
  
  // If hashedOTP is being set for the first time, it contains plain OTP
  if (!this.hashedOTP.startsWith("$2a$")) {
    this.hashedOTP = await bcrypt.hash(this.hashedOTP, 12);
  }
  next();
});

// Method to verify OTP
otpSchema.methods.verifyOTP = async function (enteredOTP) {
  return bcrypt.compare(enteredOTP.toString(), this.hashedOTP);
};

// Method to check if OTP is valid
otpSchema.methods.isValid = function () {
  return (
    !this.isUsed &&
    this.attempts < 3 &&
    new Date() < this.expiresAt
  );
};

// Method to increment attempts
otpSchema.methods.incrementAttempts = async function () {
  this.attempts += 1;
  return this.save();
};

// Method to mark as used
otpSchema.methods.markAsUsed = async function () {
  this.isUsed = true;
  return this.save();
};

// Static method to generate OTP
otpSchema.statics.generateOTP = function () {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Static method to create new OTP
otpSchema.statics.createOTP = async function (email, ipAddress = null, userAgent = null) {
  // Invalidate any existing OTPs for this email
  await this.updateMany(
    { email: email.toLowerCase(), isUsed: false },
    { isUsed: true }
  );

  const otp = this.generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const otpDoc = await this.create({
    email: email.toLowerCase(),
    hashedOTP: otp, // Will be hashed by pre-save hook
    expiresAt,
    ipAddress,
    userAgent
  });

  return { otpDoc, plainOTP: otp };
};

// Static method to find valid OTP
otpSchema.statics.findValidOTP = async function (email) {
  return this.findOne({
    email: email.toLowerCase(),
    isUsed: false,
    attempts: { $lt: 3 },
    expiresAt: { $gt: new Date() }
  });
};

// Static method to cleanup expired OTPs
otpSchema.statics.cleanupExpired = async function () {
  const result = await this.deleteMany({
    $or: [
      { expiresAt: { $lt: new Date() } },
      { isUsed: true, createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } // Delete used OTPs older than 24 hours
    ]
  });
  return result.deletedCount;
};

module.exports = mongoose.model("OTP", otpSchema);