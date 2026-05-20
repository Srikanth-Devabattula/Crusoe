const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const newsRoutes = require("./routes/newsRoutes");
const newsCategoryRoutes = require("./routes/newsCategoryRoutes");
const jobRoutes = require("./routes/jobRoutes");
const contactRoutes = require("./routes/contactRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const fileRoutes = require("./routes/fileRoutes");
const { getCorsOptions } = require("./config/cors");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const { errorMiddleware, notFound } = require("./middleware/errorMiddleware");

const app = express();

// Required behind Render/Railway reverse proxy
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const corsOptions = getCorsOptions();
app.use(cors(corsOptions));
// Explicit preflight for all API routes
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/blog-categories", blogCategoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/news-categories", newsCategoryRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Crusoe Tech API",
    data: {
      health: "/api/health",
      docs: "All routes are under /api",
    },
  });
});

app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected
      ? "Backend running successfully"
      : "Backend running but database not connected",
    data: {
      database: {
        connected: dbConnected,
        name: mongoose.connection.name || null,
      },
    },
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(notFound);
app.use(errorMiddleware);

module.exports = app;
