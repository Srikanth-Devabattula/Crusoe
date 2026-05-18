const mongoose = require("mongoose");

/**
 * Connect to MongoDB (local or Atlas via MONGODB_URI)
 * URI must include database name, e.g. ...mongodb.net/crusoetech?retryWrites=true&w=majority
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.error(
      "MongoDB connection error: MONGODB_URI is not set. Check backend/.env or host env vars."
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Fail fast if Atlas cluster is unreachable (network/IP whitelist/DNS)
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

module.exports = connectDB;
