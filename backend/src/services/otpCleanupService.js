const OTP = require("../models/OTP");
const { prisma } = require("../lib/prisma");

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
    if (process.env.NODE_ENV !== "production") {
      console.log("🧹 Starting OTP cleanup...");
    }

    const deletedCount = await OTP.cleanupExpired();

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
 * Get OTP statistics for monitoring (replaces MongoDB aggregation)
 */
const getOTPStats = async () => {
  try {
    const now = new Date();
    const [totalOTPs, activeOTPs, expiredOTPs, usedOTPs, maxAttemptsOTPs] =
      await Promise.all([
        prisma.oTP.count(),
        prisma.oTP.count({
          where: {
            isUsed: false,
            attempts: { lt: 3 },
            expiresAt: { gt: now },
          },
        }),
        prisma.oTP.count({ where: { expiresAt: { lt: now } } }),
        prisma.oTP.count({ where: { isUsed: true } }),
        prisma.oTP.count({ where: { attempts: { gte: 3 } } }),
      ]);

    return {
      totalOTPs,
      activeOTPs,
      expiredOTPs,
      usedOTPs,
      maxAttemptsOTPs,
    };
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

  const cleanupJob = cron.schedule(
    "0 * * * *",
    async () => {
      await cleanupExpiredOTPs();
    },
    {
      scheduled: false,
      timezone: "UTC",
    },
  );

  const statsJob = cron.schedule(
    "0 */6 * * *",
    async () => {
      const stats = await getOTPStats();
      if (stats) {
        if (process.env.NODE_ENV !== "production") {
          console.log("📊 OTP Statistics:", {
            total: stats.totalOTPs,
            active: stats.activeOTPs,
            expired: stats.expiredOTPs,
            used: stats.usedOTPs,
            maxAttempts: stats.maxAttemptsOTPs,
          });
        } else if (stats.totalOTPs > 100) {
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

  cleanupJob.start();
  statsJob.start();

  if (process.env.NODE_ENV !== "production") {
    console.log("🕐 OTP cleanup scheduler started (runs every hour)");
    console.log("📊 OTP statistics scheduler started (runs every 6 hours)");
  } else {
    console.log("OTP cleanup scheduler initialized");
  }

  return { cleanupJob, statsJob };
};

const stopCleanupScheduler = (jobs) => {
  if (jobs && jobs.cleanupJob) {
    jobs.cleanupJob.stop();
  }
  if (jobs && jobs.statsJob) {
    jobs.statsJob.stop();
  }
  if (process.env.NODE_ENV !== "production") {
    console.log("OTP cleanup scheduler stopped");
  }
};

const runStartupCleanup = async () => {
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
