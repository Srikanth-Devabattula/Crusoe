const OTP = require("../models/OTP");

// Optional: Only load node-cron if available (install with: npm install node-cron)
let cron;
try {
  cron = require("node-cron");
} catch (error) {
  console.log(
    "⚠️  node-cron not installed. Run 'npm install node-cron' to enable scheduled cleanup.",
  );
}

/**
 * Manual cleanup function
 */
const cleanupExpiredOTPs = async () => {
  try {
    // Reduce log noise in production
    if (process.env.NODE_ENV !== "production") {
      console.log("🧹 Starting OTP cleanup...");
    }

    const deletedCount = await OTP.cleanupExpired();

    // Log cleanup results - less verbose in production
    if (process.env.NODE_ENV !== "production") {
      console.log(
        `✅ OTP cleanup completed. Deleted ${deletedCount} expired/used OTPs.`,
      );
    } else if (deletedCount > 0) {
      console.log(`OTP cleanup completed: ${deletedCount} records removed`);
    }

    return {
      success: true,
      deletedCount,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("❌ OTP cleanup failed:", error);

    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Get OTP statistics for monitoring
 */
const getOTPStats = async () => {
  try {
    const stats = await OTP.aggregate([
      {
        $group: {
          _id: null,
          totalOTPs: { $sum: 1 },
          activeOTPs: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isUsed", false] },
                    { $gt: ["$expiresAt", new Date()] },
                    { $lt: ["$attempts", 3] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          expiredOTPs: {
            $sum: {
              $cond: [{ $lt: ["$expiresAt", new Date()] }, 1, 0],
            },
          },
          usedOTPs: {
            $sum: {
              $cond: [{ $eq: ["$isUsed", true] }, 1, 0],
            },
          },
          maxAttemptsOTPs: {
            $sum: {
              $cond: [{ $gte: ["$attempts", 3] }, 1, 0],
            },
          },
        },
      },
    ]);

    return (
      stats[0] || {
        totalOTPs: 0,
        activeOTPs: 0,
        expiredOTPs: 0,
        usedOTPs: 0,
        maxAttemptsOTPs: 0,
      }
    );
  } catch (error) {
    console.error("Failed to get OTP stats:", error);
    return null;
  }
};

/**
 * Initialize scheduled cleanup job
 */
const startCleanupScheduler = () => {
  if (!cron) {
    console.log(
      "⚠️  Scheduled cleanup disabled. Install node-cron to enable: npm install node-cron",
    );
    return null;
  }

  // Run cleanup every hour
  const cleanupJob = cron.schedule(
    "0 * * * *",
    async () => {
      await cleanupExpiredOTPs();
    },
    {
      scheduled: false, // Don't start immediately
      timezone: "UTC",
    },
  );

  // Run cleanup every 6 hours for statistics
  const statsJob = cron.schedule(
    "0 */6 * * *",
    async () => {
      const stats = await getOTPStats();
      if (stats) {
        // Log statistics - only in development or when significant
        if (process.env.NODE_ENV !== "production") {
          console.log("📊 OTP Statistics:", {
            total: stats.totalOTPs,
            active: stats.activeOTPs,
            expired: stats.expiredOTPs,
            used: stats.usedOTPs,
            maxAttempts: stats.maxAttemptsOTPs,
          });
        } else if (stats.totalOTPs > 100) {
          // Only log in production if there are many OTPs (potential issue)
          console.log(
            `OTP Stats: ${stats.activeOTPs} active, ${stats.totalOTPs} total`,
          );
        }
      }
    },
    {
      scheduled: false,
      timezone: "UTC",
    },
  );

  // Start the jobs
  cleanupJob.start();
  statsJob.start();

  // Log scheduler startup - less verbose in production
  if (process.env.NODE_ENV !== "production") {
    console.log("🕐 OTP cleanup scheduler started (runs every hour)");
    console.log("📊 OTP statistics scheduler started (runs every 6 hours)");
  } else {
    console.log("OTP cleanup scheduler initialized");
  }

  return { cleanupJob, statsJob };
};

/**
 * Stop scheduled cleanup job
 */
const stopCleanupScheduler = (jobs) => {
  if (jobs && jobs.cleanupJob) {
    jobs.cleanupJob.stop();
  }
  if (jobs && jobs.statsJob) {
    jobs.statsJob.stop();
  }
  // Log scheduler stop - less verbose in production
  if (process.env.NODE_ENV !== "production") {
    console.log("OTP cleanup scheduler stopped");
  }
};

/**
 * Force cleanup on startup (optional)
 */
const runStartupCleanup = async () => {
  // Log startup cleanup - less verbose in production
  if (process.env.NODE_ENV !== "production") {
    console.log("Running startup OTP cleanup...");
  }

  await cleanupExpiredOTPs();

  const stats = await getOTPStats();
  if (stats) {
    if (process.env.NODE_ENV !== "production") {
      console.log("Current OTP Statistics:", stats);
    } else if (stats.totalOTPs > 50) {
      console.log(`Startup cleanup: ${stats.totalOTPs} OTPs in database`);
    }
  }
};

module.exports = {
  cleanupExpiredOTPs,
  getOTPStats,
  startCleanupScheduler,
  stopCleanupScheduler,
  runStartupCleanup,
};
