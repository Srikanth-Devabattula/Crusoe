/**
 * One-way import: MongoDB → MySQL (Prisma).
 * Does NOT delete or modify MongoDB data.
 * Idempotent: safe to run multiple times (upserts by Mongo _id).
 *
 * Requires in backend/.env:
 *   MONGODB_URI
 *   DATABASE_URL
 *
 * Usage:
 *   npm run db:migrate-data
 *   node scripts/migrate-mongo-to-mysql.js
 *
 * Before migrating, run:
 *   npm run db:audit-counts
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const { prisma } = require("../src/lib/prisma");
const {
  GRIDFS_BUCKET_TO_ROUTE,
  GRIDFS_BUCKET_NAMES,
  permissionsToRow,
  mongoId,
  mongoDate,
  asStringArray,
  logSection,
  upsertByIdSafe,
  resolveAuthorId,
  resolveJobId,
} = require("./lib/mongoMigrateHelpers");

const stats = {};
const failures = [];

function bump(key, result) {
  stats[key] = stats[key] || { upserted: 0, skipped: 0 };
  if (result === "skipped-conflict") stats[key].skipped += 1;
  else stats[key].upserted += 1;
}

async function migrateUsers(db) {
  logSection("users → users");
  const docs = await db.collection("users").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      email: String(doc.email).trim().toLowerCase(),
      password: doc.password,
      passwordPlain: doc.passwordPlain ?? null,
      role: doc.role ?? "staff",
      ...permissionsToRow(doc.permissions ?? {}),
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    const result = await upsertByIdSafe(prisma.user, id, data, {
      field: "email",
      label: "User",
    });
    bump("users", result);
  }
  console.log(`users: ${docs.length} in MongoDB`);
}

async function migrateBlogCategories(db) {
  logSection("blogcategories → blog_categories");
  const docs = await db.collection("blogcategories").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      slug: doc.slug,
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("blog_categories", await upsertByIdSafe(prisma.blogCategory, id, data, {
      field: "slug",
      label: "BlogCategory",
    }));
  }
  console.log(`blogcategories: ${docs.length}`);
}

async function migrateNewsCategories(db) {
  logSection("newscategories → news_categories");
  const docs = await db.collection("newscategories").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      slug: doc.slug,
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("news_categories", await upsertByIdSafe(prisma.newsCategory, id, data, {
      field: "slug",
      label: "NewsCategory",
    }));
  }
  console.log(`newscategories: ${docs.length}`);
}

async function migrateJobs(db) {
  logSection("jobs → jobs");
  const docs = await db.collection("jobs").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      title: doc.title,
      shortDescription: doc.shortDescription,
      longDescription: doc.longDescription,
      experience: doc.experience,
      location: doc.location,
      department: doc.department ?? "",
      type: doc.type ?? "full-time",
      published: Boolean(doc.published),
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("jobs", await upsertByIdSafe(prisma.job, id, data, null));
  }
  console.log(`jobs: ${docs.length}`);
}

async function migrateBlogs(db) {
  logSection("blogs → blogs");
  const docs = await db.collection("blogs").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    try {
      const data = {
        title: doc.title,
        slug: doc.slug,
        excerpt: doc.excerpt ?? "",
        content: doc.content ?? "",
        category: doc.category ?? "insights",
        coverImage: doc.coverImage ?? "",
        images: asStringArray(doc.images),
        videoUrl: doc.videoUrl ?? "",
        videoUrls: asStringArray(doc.videoUrls),
        featured: Boolean(doc.featured),
        published: Boolean(doc.published),
        publishedAt: doc.publishedAt ? mongoDate(doc.publishedAt) : null,
        authorId: await resolveAuthorId(db, prisma, doc.author),
        createdAt: mongoDate(doc.createdAt),
        updatedAt: mongoDate(doc.updatedAt),
      };
      bump("blogs", await upsertByIdSafe(prisma.blog, id, data, { field: "slug", label: "Blog" }));
    } catch (error) {
      failures.push({ collection: "blogs", id, error: error.message });
      console.error(`[fail] blogs id=${id}: ${error.message}`);
    }
  }
  console.log(`blogs: ${docs.length}`);
}

async function migrateNews(db) {
  logSection("news → news");
  const docs = await db.collection("news").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt ?? "",
      content: doc.content ?? "",
      category: doc.category,
      coverImage: doc.coverImage ?? "",
      images: asStringArray(doc.images),
      videoUrl: doc.videoUrl ?? "",
      videoUrls: asStringArray(doc.videoUrls),
      featured: Boolean(doc.featured),
      published: Boolean(doc.published),
      publishedAt: doc.publishedAt ? mongoDate(doc.publishedAt) : null,
      authorId: await resolveAuthorId(db, prisma, doc.author),
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("news", await upsertByIdSafe(prisma.news, id, data, { field: "slug", label: "News" }));
  }
  console.log(`news: ${docs.length}`);
}

async function migrateApplications(db) {
  logSection("applications → applications");
  const docs = await db.collection("applications").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      jobId: await resolveJobId(prisma, doc.job),
      applicationType: doc.applicationType ?? "job",
      message: doc.message ?? "",
      name: doc.name,
      email: doc.email,
      phone: doc.phone ?? "",
      resume: doc.resume ?? "",
      status: doc.status ?? "pending",
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("applications", await upsertByIdSafe(prisma.application, id, data, null));
  }
  console.log(`applications: ${docs.length}`);
}

async function migrateContacts(db) {
  logSection("contacts → contacts");
  const docs = await db.collection("contacts").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      email: doc.email,
      phone: doc.phone ?? "",
      company: doc.company ?? "",
      service: doc.service ?? "",
      subject: doc.subject,
      message: doc.message,
      status: doc.status ?? "new",
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("contacts", await upsertByIdSafe(prisma.contact, id, data, null));
  }
  console.log(`contacts: ${docs.length}`);
}

async function migrateTestimonials(db) {
  logSection("testimonials → testimonials");
  const docs = await db.collection("testimonials").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      title: doc.title,
      company: doc.company ?? "",
      quote: doc.quote ?? "",
      photo: doc.photo ?? "",
      rating: doc.rating ?? 5,
      type: doc.type ?? "text",
      videoUrl: doc.videoUrl ?? "",
      published: doc.published !== false,
      sortOrder: doc.sortOrder ?? 0,
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("testimonials", await upsertByIdSafe(prisma.testimonial, id, data, null));
  }
  console.log(`testimonials: ${docs.length}`);
}

async function migrateTeam(db) {
  logSection("teammembers → team_members");
  const docs = await db.collection("teammembers").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      role: doc.role,
      bio: doc.bio ?? "",
      photo: doc.photo ?? "",
      linkedIn: doc.linkedIn ?? "",
      twitter: doc.twitter ?? "",
      email: doc.email ?? "",
      published: doc.published !== false,
      sortOrder: doc.sortOrder ?? 0,
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("team_members", await upsertByIdSafe(prisma.teamMember, id, data, null));
  }
  console.log(`teammembers: ${docs.length}`);
}

async function migratePartners(db) {
  logSection("partners → partners");
  const docs = await db.collection("partners").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      name: doc.name,
      logo: doc.logo,
      websiteUrl: doc.websiteUrl ?? "",
      published: doc.published !== false,
      sortOrder: doc.sortOrder ?? 0,
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("partners", await upsertByIdSafe(prisma.partner, id, data, null));
  }
  console.log(`partners: ${docs.length}`);
}

async function migrateHeroSlides(db) {
  logSection("heroslides → hero_slides");
  const docs = await db.collection("heroslides").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      title: doc.title,
      description: doc.description,
      image: doc.image,
      icon: doc.icon,
      published: doc.published !== false,
      sortOrder: doc.sortOrder ?? 0,
      ctaLink: doc.ctaLink ?? "",
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("hero_slides", await upsertByIdSafe(prisma.heroSlide, id, data, null));
  }
  console.log(`heroslides: ${docs.length}`);
}

async function migrateOtps(db) {
  logSection("otps → otps (optional historical OTP rows)");
  const docs = await db.collection("otps").find().toArray();
  for (const doc of docs) {
    const id = mongoId(doc._id);
    const data = {
      email: String(doc.email).trim().toLowerCase(),
      hashedOTP: doc.hashedOTP,
      expiresAt: mongoDate(doc.expiresAt),
      attempts: doc.attempts ?? 0,
      isUsed: Boolean(doc.isUsed),
      ipAddress: doc.ipAddress ?? null,
      userAgent: doc.userAgent ?? null,
      createdAt: mongoDate(doc.createdAt),
      updatedAt: mongoDate(doc.updatedAt),
    };
    bump("otps", await upsertByIdSafe(prisma.oTP, id, data, null));
  }
  console.log(`otps: ${docs.length}`);
}

async function downloadGridFsFile(db, bucketName, fileId) {
  const bucket = new GridFSBucket(db, { bucketName });
  const chunks = [];
  await new Promise((resolve, reject) => {
    bucket
      .openDownloadStream(fileId)
      .on("data", (chunk) => chunks.push(chunk))
      .on("error", reject)
      .on("end", resolve);
  });
  return Buffer.concat(chunks);
}

async function migrateGridFsBucket(db, mongoBucketName) {
  const routeBucket = GRIDFS_BUCKET_TO_ROUTE[mongoBucketName];
  if (!routeBucket) return;

  const filesCol = `${mongoBucketName}.files`;
  const count = await db.collection(filesCol).countDocuments();
  if (count === 0) return;

  logSection(`GridFS ${mongoBucketName} → stored_files (bucket=${routeBucket})`);
  const files = await db.collection(filesCol).find().toArray();

  for (const file of files) {
    const id = mongoId(file._id);
    const filename = file.filename || "file";
    const contentType =
      file.contentType ||
      file.metadata?.contentType ||
      "application/octet-stream";
    const createdAt = mongoDate(file.uploadDate || file.metadata?.createdAt);

    let data;
    try {
      data = await downloadGridFsFile(db, mongoBucketName, file._id);
    } catch (error) {
      console.warn(`[skip] GridFS file ${mongoBucketName}/${id}: ${error.message}`);
      stats.stored_files = stats.stored_files || { upserted: 0, skipped: 0 };
      stats.stored_files.skipped += 1;
      continue;
    }

    await prisma.storedFile.upsert({
      where: { id },
      create: {
        id,
        bucket: routeBucket,
        filename,
        contentType,
        data,
        createdAt,
      },
      update: {
        bucket: routeBucket,
        filename,
        contentType,
        data,
      },
    });
    stats.stored_files = stats.stored_files || { upserted: 0, skipped: 0 };
    stats.stored_files.upserted += 1;
  }

  console.log(`${mongoBucketName}: ${files.length} files`);
}

async function migrateAllGridFs(db) {
  logSection("GridFS → stored_files");
  for (const bucketName of GRIDFS_BUCKET_NAMES) {
    await migrateGridFsBucket(db, bucketName);
  }

  const legacyFs = await db.collection("fs.files").countDocuments().catch(() => 0);
  if (legacyFs > 0) {
    console.warn(
      `Found ${legacyFs} files in default fs bucket — not auto-migrated (app uses named buckets).`
    );
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    console.error("Set MONGODB_URI in backend/.env to run this script.");
    process.exit(1);
  }

  console.log("MongoDB → MySQL import (read Mongo, upsert MySQL — no Mongo writes, no MySQL deletes)");

  await mongoose.connect(mongoUri);
  await prisma.$connect();
  const db = mongoose.connection.db;

  await migrateUsers(db);
  await migrateBlogCategories(db);
  await migrateNewsCategories(db);
  await migrateJobs(db);
  await migrateBlogs(db);
  await migrateNews(db);
  await migrateApplications(db);
  await migrateContacts(db);
  await migrateTestimonials(db);
  await migrateTeam(db);
  await migratePartners(db);
  await migrateHeroSlides(db);
  await migrateOtps(db);
  await migrateAllGridFs(db);

  console.log("\n=== Summary ===");
  for (const [table, s] of Object.entries(stats)) {
    console.log(`${table}: upserted=${s.upserted}, skipped=${s.skipped}`);
  }
  if (failures.length) {
    console.log("\n=== Failures ===");
    for (const f of failures) {
      console.log(`${f.collection} id=${f.id}: ${f.error}`);
    }
  }
  console.log("\nDone. Re-run npm run db:audit-counts to compare counts.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => {});
    await prisma.$disconnect();
  });
