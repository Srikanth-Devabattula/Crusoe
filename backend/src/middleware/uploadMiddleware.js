const multer = require("multer");
const path = require("path");
const fs = require("fs");

const resumeDir = path.join(__dirname, "../uploads/resumes");
const blogCoverDir = path.join(__dirname, "../uploads/blog-covers");
const newsCoverDir = path.join(__dirname, "../uploads/news-covers");

for (const dir of [resumeDir, blogCoverDir, newsCoverDir]) {
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

const memoryStorage = multer.memoryStorage();

const galleryLimits = {
  fileSize: 5 * 1024 * 1024,
  files: 11,
};

/** Blog/news covers stored in MySQL (stored_files) via memory buffer — not disk */
const uploadBlogCover = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: galleryLimits,
}).fields([
  { name: "coverImageFile", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

const uploadNewsCover = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: galleryLimits,
}).fields([
  { name: "coverImageFile", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

const uploadTestimonialPhoto = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("photoFile");

const uploadTeamPhoto = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("photoFile");

const uploadPartnerLogo = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("logoFile");

const imageMimeFilter = (req, file, cb) => {
  const mime = (file.mimetype || "").toLowerCase();
  if (mime.startsWith("image/")) {
    cb(null, true);
    return;
  }
  imageFilter(req, file, cb);
};

/** Inline images for blog/news rich text (GridFS) */
const uploadContentImage = multer({
  storage: memoryStorage,
  fileFilter: imageMimeFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");

const uploadHeroSlideImages = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 2 },
}).fields([
  { name: "imageFile", maxCount: 1 },
  { name: "iconFile", maxCount: 1 },
]);

module.exports = {
  uploadResume,
  uploadBlogCover,
  uploadNewsCover,
  uploadTestimonialPhoto,
  uploadTeamPhoto,
  uploadPartnerLogo,
  uploadHeroSlideImages,
  uploadContentImage,
  blogCoverDir,
  newsCoverDir,
};
