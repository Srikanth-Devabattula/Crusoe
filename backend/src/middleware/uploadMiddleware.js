const multer = require("multer");
const path = require("path");
const fs = require("fs");

const resumeDir = path.join(__dirname, "../uploads/resumes");
const blogCoverDir = path.join(__dirname, "../uploads/blog-covers");

for (const dir of [resumeDir, blogCoverDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const createStorage = (destination) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, destination);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });

const resumeFilter = (req, file, cb) => {
  const allowed = [".pdf", ".doc", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and Word documents are allowed"), false);
  }
};

const imageFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WebP, and GIF images are allowed"), false);
  }
};

const uploadResume = multer({
  storage: createStorage(resumeDir),
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadBlogCover = multer({
  storage: createStorage(blogCoverDir),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { uploadResume, uploadBlogCover, blogCoverDir };
