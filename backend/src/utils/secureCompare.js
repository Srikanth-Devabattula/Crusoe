const crypto = require("crypto");

/**
 * Constant-time string compare (mitigates timing attacks on login)
 */
function secureCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

module.exports = { secureCompare };
