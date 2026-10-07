const { prisma } = require("../lib/prisma");

/**
 * Connect to MySQL via Prisma (DATABASE_URL)
 */
const connectDB = async () => {
  const url = process.env.DATABASE_URL?.trim();

  if (!url) {
    console.error(
      "Database connection error: DATABASE_URL is not set. Check backend/.env or host env vars."
    );
    process.exit(1);
  }

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("MySQL connected (Prisma)");
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

const isDbConnected = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
};

module.exports = { connectDB, disconnectDB, isDbConnected };
