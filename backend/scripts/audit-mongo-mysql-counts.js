/**
 * Read-only audit: MongoDB collection counts vs MySQL row counts.
 * Requires MONGODB_URI and DATABASE_URL in backend/.env
 *
 * Usage: node scripts/audit-mongo-mysql-counts.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });

const mongoose = require("mongoose");
const { prisma } = require("../src/lib/prisma");

const MONGO_TO_MYSQL = [
  { mongo: "users", mysql: "user", prismaKey: "user" },
  { mongo: "otps", mysql: "otps", prismaKey: "oTP" },
  { mongo: "blogcategories", mysql: "blog_categories", prismaKey: "blogCategory" },
  { mongo: "blogs", mysql: "blogs", prismaKey: "blog" },
  { mongo: "newscategories", mysql: "news_categories", prismaKey: "newsCategory" },
  { mongo: "news", mysql: "news", prismaKey: "news" },
  { mongo: "jobs", mysql: "jobs", prismaKey: "job" },
  { mongo: "applications", mysql: "applications", prismaKey: "application" },
  { mongo: "contacts", mysql: "contacts", prismaKey: "contact" },
  { mongo: "testimonials", mysql: "testimonials", prismaKey: "testimonial" },
  { mongo: "teammembers", mysql: "team_members", prismaKey: "teamMember" },
  { mongo: "partners", mysql: "partners", prismaKey: "partner" },
  { mongo: "heroslides", mysql: "hero_slides", prismaKey: "heroSlide" },
];

const GRIDFS_BUCKETS = [
  "blogCovers",
  "newsCovers",
  "testimonialPhotos",
  "teamPhotos",
  "partnerLogos",
  "heroSlideImages",
  "heroSlideIcons",
  "contentImages",
];

async function countMongoCollection(db, name) {
  try {
    return await db.collection(name).countDocuments();
  } catch {
    return null;
  }
}

async function countGridFsFiles(db, bucketName) {
  try {
    return await db.collection(`${bucketName}.files`).countDocuments();
  } catch {
    return null;
  }
}

async function main() {
  const mongoUri = process.env.MONGODB_URI?.trim();
  if (!mongoUri) {
    console.error("Set MONGODB_URI in backend/.env to audit MongoDB counts.");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);
  await prisma.$connect();
  const db = mongoose.connection.db;

  const allCollections = (await db.listCollections().toArray())
    .map((c) => c.name)
    .sort();

  console.log("\n=== MongoDB collections (all) ===");
  console.log(allCollections.join(", ") || "(none)");

  console.log("\n=== Document counts: MongoDB vs MySQL ===");
  console.log(
    "MongoDB collection".padEnd(22),
    "Mongo".padStart(8),
    "MySQL table".padEnd(22),
    "MySQL".padStart(8),
    "Delta".padStart(8)
  );
  console.log("-".repeat(72));

  for (const row of MONGO_TO_MYSQL) {
    const mongoCount = await countMongoCollection(db, row.mongo);
    const mysqlCount = await prisma[row.prismaKey].count();
    const delta =
      mongoCount === null ? "?" : mysqlCount - mongoCount;
    console.log(
      row.mongo.padEnd(22),
      String(mongoCount ?? "?").padStart(8),
      row.mysql.padEnd(22),
      String(mysqlCount).padStart(8),
      String(delta).padStart(8)
    );
  }

  const storedFiles = await prisma.storedFile.count();
  console.log(
    "(GridFS all buckets)".padEnd(22),
    "".padStart(8),
    "stored_files".padEnd(22),
    String(storedFiles).padStart(8),
    "".padStart(8)
  );

  console.log("\n=== GridFS file counts (MongoDB *.files) ===");
  let gridfsTotal = 0;
  for (const bucket of GRIDFS_BUCKETS) {
    const n = await countGridFsFiles(db, bucket);
    if (n && n > 0) {
      console.log(`  ${bucket}: ${n}`);
      gridfsTotal += n;
    }
  }
  if (gridfsTotal === 0) {
    console.log("  (no files in known buckets, or buckets use different names)");
  } else {
    console.log(`  Total GridFS files (known buckets): ${gridfsTotal}`);
    console.log(`  MySQL stored_files: ${storedFiles}`);
  }

  const mapped = new Set([
    ...MONGO_TO_MYSQL.map((r) => r.mongo),
    ...GRIDFS_BUCKETS.flatMap((b) => [`${b}.files`, `${b}.chunks`]),
    "fs.files",
    "fs.chunks",
  ]);

  const unmapped = allCollections.filter((c) => {
    if (mapped.has(c)) return false;
    if (c.endsWith(".files") || c.endsWith(".chunks")) return false;
    return !MONGO_TO_MYSQL.some((r) => r.mongo === c);
  });

  if (unmapped.length) {
    console.log("\n=== MongoDB collections without direct Prisma model ===");
    for (const name of unmapped) {
      const n = await countMongoCollection(db, name);
      console.log(`  ${name}: ${n ?? "?"}`);
    }
  }

  console.log("\n(Audit complete — read-only, no writes.)\n");
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
