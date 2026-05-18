const DEFAULT_ORIGINS = ["http://localhost:3000"];

/**
 * Allowed origins from CLIENT_URL (comma-separated).
 * Example: http://localhost:3000,https://your-app.vercel.app
 */
function getAllowedOrigins() {
  const fromEnv = process.env.CLIENT_URL;

  if (!fromEnv?.trim()) {
    return DEFAULT_ORIGINS;
  }

  return fromEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      // Allow server-to-server, Postman, mobile apps (no Origin header)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  };
}

module.exports = { getCorsOptions, getAllowedOrigins };
