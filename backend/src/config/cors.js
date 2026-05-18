/** Origins always allowed (local dev calling production API) */
const DEV_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

/**
 * Allowed origins from CLIENT_URL (comma-separated) + dev defaults
 * Example: http://localhost:3000,https://your-app.vercel.app
 */
function getAllowedOrigins() {
  const fromEnv =
    process.env.CLIENT_URL?.split(",").map((o) => o.trim()).filter(Boolean) ||
    [];

  return [...new Set([...DEV_ORIGINS, ...fromEnv])];
}

function getCorsOptions() {
  const allowedOrigins = getAllowedOrigins();

  return {
    origin(origin, callback) {
      // Postman, server-to-server, same-origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Do not pass Error — that becomes 403 via error middleware
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `CORS: blocked origin "${origin}". Allowed: ${allowedOrigins.join(", ")}`
        );
      }
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  };
}

module.exports = { getCorsOptions, getAllowedOrigins };
