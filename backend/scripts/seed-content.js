/**
 * Run default content seed against DATABASE_URL or DB_* (same as server startup).
 * Usage: node scripts/seed-content.js
 */
require("../src/config/env").validateEnv();
const { connectDB, disconnectDB } = require("../src/config/db");
const { seedContentIfEmpty } = require("../services/contentSeedService");

(async () => {
  const ok = await connectDB();
  if (!ok) {
    console.error("Database not connected.");
    process.exit(1);
  }
  await seedContentIfEmpty();
  await disconnectDB();
  console.log("Done.");
})();
