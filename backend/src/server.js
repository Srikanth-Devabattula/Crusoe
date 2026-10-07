// Load and validate env before any other app modules
const { validateEnv } = require("./config/env");
validateEnv();

const app = require("./app");
const { connectDB, disconnectDB } = require("./config/db");
const {
  runStartupCleanup,
  startCleanupScheduler,
} = require("./services/otpCleanupService");
const { seedContentIfEmpty } = require("./services/contentSeedService");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await runStartupCleanup();
    startCleanupScheduler();
    await seedContentIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing server...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
