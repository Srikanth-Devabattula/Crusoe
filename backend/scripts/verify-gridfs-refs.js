/**
 * Read-only: verify gridfs: refs in Mongo docs exist in MySQL stored_files.
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { prisma } = require("../src/lib/prisma");

const GRIDFS_PREFIX = "gridfs:";

function collectRefs(doc, fields) {
  const refs = [];
  for (const f of fields) {
    const v = doc[f];
    if (typeof v === "string" && v.startsWith(GRIDFS_PREFIX)) {
      refs.push(v.slice(GRIDFS_PREFIX.length));
    }
    if (Array.isArray(v)) {
      for (const item of v) {
        if (typeof item === "string" && item.startsWith(GRIDFS_PREFIX)) {
          refs.push(item.slice(GRIDFS_PREFIX.length));
        }
      }
    }
  }
  return refs;
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI.trim());
  await prisma.$connect();
  const db = mongoose.connection.db;

  const checks = [
    ["blogs", ["coverImage", "images"]],
    ["news", ["coverImage", "images"]],
    ["testimonials", ["photo"]],
    ["teammembers", ["photo"]],
    ["partners", ["logo"]],
    ["heroslides", ["image", "icon"]],
  ];

  const allRefs = new Set();
  for (const [col, fields] of checks) {
    const docs = await db.collection(col).find().toArray();
    for (const doc of docs) {
      for (const id of collectRefs(doc, fields)) allRefs.add(id);
    }
  }

  let missing = [];
  for (const id of allRefs) {
    const row = await prisma.storedFile.findUnique({ where: { id } });
    if (!row) missing.push(id);
  }

  const byBucket = await prisma.storedFile.groupBy({
    by: ["bucket"],
    _count: { id: true },
  });

  console.log("\n=== stored_files by bucket (MySQL) ===");
  for (const row of byBucket.sort((a, b) => a.bucket.localeCompare(b.bucket))) {
    console.log(`  ${row.bucket}: ${row._count.id}`);
  }
  console.log(`Total stored_files: ${await prisma.storedFile.count()}`);
  console.log(`Unique gridfs: refs in Mongo content: ${allRefs.size}`);
  console.log(`Missing in stored_files: ${missing.length}`);
  if (missing.length) console.log(missing.join(", "));

  await mongoose.disconnect();
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
