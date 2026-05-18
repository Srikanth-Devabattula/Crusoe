const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const jobRoutes = require("./routes/jobRoutes");
const contactRoutes = require("./routes/contactRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const { errorMiddleware, notFound } = require("./middleware/errorMiddleware");

const app = express();

// Security & logging middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use("/api", apiLimiter);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);

// Root — API info (frontend runs on CLIENT_URL, not this server)
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Crusoe Tech API",
    docs: "Use /api/* endpoints. Frontend: http://localhost:3000",
    health: "/api/health",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Static uploads (resumes)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 404 & error handlers
app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
