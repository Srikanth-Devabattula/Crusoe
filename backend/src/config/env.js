const path = require("path");
const dotenv = require("dotenv");

// Load .env from backend root (local dev). On GoDaddy, set DATABASE_URL via Secrets — do not bundle .env in deploy zip.
dotenv.config({ path: path.join(__dirname, "../../.env") });

const REQUIRED_VARS = ["DATABASE_URL", "JWT_SECRET", "ADMIN_EMAIL"];

/**
 * Build DATABASE_URL from GoDaddy hosted DB_* when present.
 * Hosted DB_* wins over DATABASE_URL so a stale cPanel URL in secrets cannot break production.
 */
function ensureDatabaseUrl() {
  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const password = process.env.DB_PASSWORD;
  const database = process.env.DB_NAME?.trim();
  const port = process.env.DB_PORT?.trim() || "3306";

  if (host && user && password != null && password !== "" && database) {
    const encodedUser = encodeURIComponent(user);
    const encodedPassword = encodeURIComponent(password);
    process.env.DATABASE_URL = `mysql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;
    return;
  }

  if (process.env.DATABASE_URL?.trim()) {
    return;
  }
}

/**
 * Validate required environment variables before starting the server
 */
function validateEnv() {
  ensureDatabaseUrl();

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

module.exports = { validateEnv, ensureDatabaseUrl };
