const validator = require("validator");

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  return validator.isEmail(String(email));
};

/**
 * Sanitize string input
 */
const sanitizeString = (str) => {
  return validator.escape(String(str).trim());
};

module.exports = { isValidEmail, sanitizeString };
