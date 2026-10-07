/**
 * Read-only: compare Mongo _id sets vs MySQL id sets per table.
 * Usage: node scripts/audit-id-overlap.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const { prisma } = require("../src/lib/prisma");

const PAIRS = [
  { mongo: "users", prisma: "user" },
  { mongo: "blogcategories", prisma: "blogCategory" },
  { mongo: "blogs", prisma: "blog" },
  { mongo: "newscategories", prisma: "newsCategory" },
  { mongo: "news", prisma: "news" },
  { mongo: "jobs", prisma: "job" },
  { mongo: "applications", prisma: "application" },
  { mongo: "contacts", prisma: "contact" },
  { mongo: "testimonials", prisma: "testimonial" },
  { mongo: "teammembers", prisma: "teamMember" },
  { mongo: "partners", prisma: "partner" },
  { mongo: "heroslides", prisma: "heroSlide" },
];

async function mongoIds(db, col) {
  const docs = await db.collection(col).find({}, { projection: { _id: 1 } }).toArray();
  return new Set(docs.map((d) => String(d._id)));
}

async function mysqlIds(model) {
  const rows = await model.findMany({ select: { id: true } });
  return new Set(rows.map((r) => r.id));
}

async function slugSet(db, col) {
  const docs = await db.collection(col).find({}, { projection: { slug: 1 } }).toArray();
  return new Set(docs.map((d) => d.slug).filter(Boolean));
}

async function mysqlSlugs(model) {
  const rows = await model.findMany({ select: { id: true, slug: true } });
  return rows;
}

(async () => {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    console.error("MONGODB_URI required");
    process.exit(1);
  }
  await mongoose.connect(uri);
  await prisma.$connect();
  const db = mongoose.connection.db;

  console.log("\n=== ID overlap (Mongo _id vs MySQL id) ===\n");
  for (const { mongo, prisma: key } of PAIRS) {
    const m = await mongoIds(db, mongo);
    const s = await mysqlIds(prisma[key]);
    let overlap = 0;
    for (const id of m) if (s.has(id)) overlap += 1;
    const mysqlOnly = [...s].filter((id) => !m.has(id));
    const mongoMissingInMysql = m.size - overlap;
    console.log(`${mongo}:`);
    console.log(`  Mongo docs: ${m.size}, MySQL rows: ${s.size}, same _id: ${overlap}`);
    console.log(`  MySQL-only ids (likely seed/local): ${mysqlOnly.length}`);
    console.log(`  Mongo not in MySQL yet: ${mongoMissingInMysql}`);
  }

  for (const { mongo, prisma: key, label } of [
    { mongo: "blogcategories", prisma: "blogCategory", label: "blog category slugs" },
    { mongo: "newscategories", prisma: "newsCategory", label: "news category slugs" },
    { mongo: "blogs", prisma: "blog", label: "blog slugs" },
    { mongo: "news", prisma: "news", label: "news slugs" },
  ]) {
    const mSlugs = await slugSet(db, mongo);
    const mysqlRows = await mysqlSlugs(prisma[key]);
    const conflicts = mysqlRows.filter((r) => mSlugs.has(r.slug) && !mSlugs.has(r.id));
    const slugConflicts = [];
    for (const row of mysqlRows) {
      if (mSlugs.has(row.slug)) {
        const mongoHasId = (await db.collection(mongo).findOne({ slug: row.slug }))?._id;
        if (mongoHasId && String(mongoHasId) !== row.id) {
          slugConflicts.push(row.slug);
        }
      }
    }
    if (slugConflicts.length) {
      console.log(`\n${label} — slug conflict (MySQL seed id ≠ Mongo id, import would skip):`);
      console.log(`  ${slugConflicts.join(", ")}`);
    }
  }

  console.log("\n=== gridfs: refs in Mongo documents (sample counts) ===");
  const gridfsPattern = /^gridfs:/;
  async function countGridfsRefs(col, fields) {
    let n = 0;
    const docs = await db.collection(col).find().toArray();
    for (const doc of docs) {
      for (const f of fields) {
        const v = doc[f];
        if (typeof v === "string" && gridfsPattern.test(v)) n += 1;
        if (Array.isArray(v)) n += v.filter((x) => gridfsPattern.test(x)).length;
      }
    }
    return { docs: docs.length, gridfsRefs: n };
  }
  const checks = [
    ["blogs", ["coverImage", "images"]],
    ["news", ["coverImage", "images"]],
    ["testimonials", ["photo"]],
    ["teammembers", ["photo"]],
    ["partners", ["logo"]],
    ["heroslides", ["image", "icon"]],
  ];
  for (const [col, fields] of checks) {
    const r = await countGridfsRefs(col, fields);
    console.log(`  ${col}: ${r.docs} docs, ${r.gridfsRefs} gridfs: field refs`);
  }

  await mongoose.disconnect();
  await prisma.$disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
