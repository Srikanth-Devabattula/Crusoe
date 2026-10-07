const crypto = require("crypto");

/** 24-char hex string compatible with MongoDB ObjectId format in API responses. */
function newObjectId() {
  return crypto.randomBytes(12).toString("hex");
}

function isValidObjectId(value) {
  return typeof value === "string" && /^[a-f0-9]{24}$/i.test(value);
}

module.exports = { newObjectId, isValidObjectId };
