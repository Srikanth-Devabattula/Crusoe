const express = require("express");
const mongoose = require("mongoose");
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
const { getCorsOptions } = require("./config/cors");
const { apiLimiter } = require("./middleware/rateLimitMiddleware");
const { errorMiddleware, notFound } = require("./middleware/errorMiddleware");

const app = express();

// Required behind Render/Railway reverse proxy
app.set("trust proxy", 1);

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cors(getCorsOptions()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/applications", applicationRoutes);

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
