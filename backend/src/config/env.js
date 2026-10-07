const path = require("path");
const dotenv = require("dotenv");

// Load .env from backend root (works regardless of cwd on Render/Railway/VPS)
dotenv.config({ path: path.join(__dirname, "../../.env") });

const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET", "ADMIN_EMAIL"];

/**
 * Validate required environment variables before starting the server
 */
function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]?.trim());

  if (missing.length > 0) {
    console.error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  if (process.env.JWT_SECRET.length < 32) {
    console.warn(
      "Warning: JWT_SECRET should be at least 32 characters for production."
    );
  }
}

module.exports = { validateEnv };
