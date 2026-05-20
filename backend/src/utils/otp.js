const crypto = require("crypto");

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 5;

const generateOtpCode = () => String(crypto.randomInt(100000, 1000000));

const hashOtp = (code) => {
  const secret = process.env.JWT_SECRET || "otp-fallback-secret";
  return crypto.createHmac("sha256", secret).update(String(code)).digest("hex");
};

const verifyOtpHash = (code, hash) => hashOtp(code) === hash;

module.exports = {
  OTP_LENGTH,
  OTP_EXPIRY_MINUTES,
  generateOtpCode,
  hashOtp,
  verifyOtpHash,
};
