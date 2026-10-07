-- CreateTable
CREATE TABLE `stored_files` (
    `id` CHAR(24) NOT NULL,
    `bucket` VARCHAR(64) NOT NULL,
    `filename` VARCHAR(512) NOT NULL,
    `contentType` VARCHAR(128) NOT NULL DEFAULT 'application/octet-stream',
    `data` LONGBLOB NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `stored_files_bucket_idx`(`bucket`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `passwordPlain` TEXT NULL,
    `role` VARCHAR(32) NOT NULL DEFAULT 'staff',
    `permBlogs` BOOLEAN NOT NULL DEFAULT false,
    `permNews` BOOLEAN NOT NULL DEFAULT false,
    `permJobs` BOOLEAN NOT NULL DEFAULT false,
    `permTestimonials` BOOLEAN NOT NULL DEFAULT false,
    `permTeam` BOOLEAN NOT NULL DEFAULT false,
    `permPartners` BOOLEAN NOT NULL DEFAULT false,
    `permHeroSlides` BOOLEAN NOT NULL DEFAULT false,
    `permContacts` BOOLEAN NOT NULL DEFAULT false,
    `permApplications` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` CHAR(24) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `hashedOTP` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `attempts` INTEGER NOT NULL DEFAULT 0,
    `isUsed` BOOLEAN NOT NULL DEFAULT false,
    `ipAddress` VARCHAR(64) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `otps_email_idx`(`email`),
    INDEX `otps_email_expiresAt_idx`(`email`, `expiresAt`),
    INDEX `otps_email_isUsed_idx`(`email`, `isUsed`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_categories` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blogs` (
    `id` CHAR(24) NOT NULL,
    `title` VARCHAR(512) NOT NULL,
    `slug` VARCHAR(512) NOT NULL,
    `excerpt` TEXT NOT NULL DEFAULT '',
    `content` LONGTEXT NOT NULL DEFAULT '',
    `category` VARCHAR(128) NOT NULL DEFAULT 'insights',
    `coverImage` TEXT NOT NULL DEFAULT '',
    `images` JSON NOT NULL,
    `videoUrl` TEXT NOT NULL DEFAULT '',
    `videoUrls` JSON NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `authorId` CHAR(24) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blogs_slug_key`(`slug`),
    INDEX `blogs_category_idx`(`category`),
    INDEX `blogs_published_idx`(`published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_categories` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_categories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` CHAR(24) NOT NULL,
    `title` VARCHAR(512) NOT NULL,
    `slug` VARCHAR(512) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `content` LONGTEXT NOT NULL,
    `category` VARCHAR(128) NOT NULL,
    `coverImage` TEXT NOT NULL DEFAULT '',
    `images` JSON NOT NULL,
    `videoUrl` TEXT NOT NULL DEFAULT '',
    `videoUrls` JSON NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `authorId` CHAR(24) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_slug_key`(`slug`),
    INDEX `news_category_idx`(`category`),
    INDEX `news_published_idx`(`published`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jobs` (
    `id` CHAR(24) NOT NULL,
    `title` VARCHAR(512) NOT NULL,
    `shortDescription` VARCHAR(500) NOT NULL,
    `longDescription` LONGTEXT NOT NULL,
    `experience` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `department` VARCHAR(255) NOT NULL DEFAULT '',
    `type` VARCHAR(32) NOT NULL DEFAULT 'full-time',
    `published` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `applications` (
    `id` CHAR(24) NOT NULL,
    `jobId` CHAR(24) NULL,
    `applicationType` VARCHAR(32) NOT NULL DEFAULT 'job',
    `message` TEXT NOT NULL DEFAULT '',
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(64) NOT NULL DEFAULT '',
    `resume` TEXT NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `applications_jobId_idx`(`jobId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contacts` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(64) NOT NULL DEFAULT '',
    `company` VARCHAR(255) NOT NULL DEFAULT '',
    `service` VARCHAR(255) NOT NULL DEFAULT '',
    `subject` VARCHAR(512) NOT NULL,
    `message` LONGTEXT NOT NULL,
    `status` VARCHAR(32) NOT NULL DEFAULT 'new',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `testimonials` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `company` VARCHAR(255) NOT NULL DEFAULT '',
    `quote` TEXT NOT NULL DEFAULT '',
    `photo` TEXT NOT NULL DEFAULT '',
    `rating` INTEGER NOT NULL DEFAULT 5,
    `type` VARCHAR(32) NOT NULL DEFAULT 'text',
    `videoUrl` TEXT NOT NULL DEFAULT '',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `role` VARCHAR(255) NOT NULL,
    `bio` TEXT NOT NULL DEFAULT '',
    `photo` TEXT NOT NULL DEFAULT '',
    `linkedIn` TEXT NOT NULL DEFAULT '',
    `twitter` TEXT NOT NULL DEFAULT '',
    `email` VARCHAR(255) NOT NULL DEFAULT '',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partners` (
    `id` CHAR(24) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `logo` TEXT NOT NULL,
    `websiteUrl` TEXT NOT NULL DEFAULT '',
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hero_slides` (
    `id` CHAR(24) NOT NULL,
    `title` VARCHAR(512) NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `icon` TEXT NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `ctaLink` TEXT NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news` ADD CONSTRAINT `news_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `applications` ADD CONSTRAINT `applications_jobId_fkey` FOREIGN KEY (`jobId`) REFERENCES `jobs`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

