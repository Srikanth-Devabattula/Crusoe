const { permissionsToRow } = require("../../src/utils/serialize");

const GRIDFS_BUCKET_TO_ROUTE = {
  blogCovers: "blog-covers",
  newsCovers: "news-covers",
  testimonialPhotos: "testimonial-photos",
  teamPhotos: "team-photos",
  partnerLogos: "partner-logos",
  heroSlideImages: "hero-slide-images",
  heroSlideIcons: "hero-slide-icons",
  contentImages: "content-images",
};

const GRIDFS_BUCKET_NAMES = Object.keys(GRIDFS_BUCKET_TO_ROUTE);

function mongoId(value) {
  if (value == null || value === "") return null;
  return String(value);
}

function mongoDate(value, fallback = new Date()) {
  if (!value) return fallback;
  return value instanceof Date ? value : new Date(value);
}

function asStringArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [];
}

function logSection(title) {
  console.log(`\n--- ${title} ---`);
}

async function upsertById(model, id, createData, updateData) {
  await model.upsert({
    where: { id },
    create: { id, ...createData },
    update: updateData,
  });
}

/**
 * Upsert by Mongo _id. On unique slug/email conflict with a different row (e.g. seed data),
 * log a warning and skip — does not delete MySQL rows.
 */
async function upsertByIdSafe(model, id, data, uniqueHint) {
  try {
    await model.upsert({
      where: { id },
      create: { id, ...data },
      update: { ...data },
    });
    return "upserted";
  } catch (error) {
    if (error.code === "P2002" && uniqueHint) {
      const field = uniqueHint.field;
      const value = data[field];
      if (value != null) {
        const existing = await model.findFirst({
          where: { [field]: value, id: { not: id } },
        });
        if (existing) {
          console.warn(
            `[skip] ${uniqueHint.label} id=${id}: ${field}="${value}" already used by MySQL id=${existing.id} (likely seed data — remove seed row manually if you want this Mongo document)`
          );
          return "skipped-conflict";
        }
      }
    }
    throw error;
  }
}

/** Map Mongo author ObjectId → MySQL user id (handles preserved local admin with same email). */
async function resolveAuthorId(db, prisma, authorRef) {
  const mongoAuthorId = mongoId(authorRef);
  if (!mongoAuthorId) return null;

  const byId = await prisma.user.findUnique({ where: { id: mongoAuthorId } });
  if (byId) return byId.id;

  let objectId = authorRef;
  if (typeof authorRef === "string") {
    const { ObjectId } = require("mongodb");
    try {
      objectId = new ObjectId(authorRef);
    } catch {
      return null;
    }
  }

  const mongoUser = await db.collection("users").findOne({ _id: objectId });
  if (!mongoUser?.email) return null;

  const email = String(mongoUser.email).trim().toLowerCase();
  const byEmail = await prisma.user.findUnique({ where: { email } });
  return byEmail?.id ?? null;
}

async function resolveJobId(prisma, jobRef) {
  const jobId = mongoId(jobRef);
  if (!jobId) return null;
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  return job?.id ?? null;
}

module.exports = {
  GRIDFS_BUCKET_TO_ROUTE,
  GRIDFS_BUCKET_NAMES,
  permissionsToRow,
  mongoId,
  mongoDate,
  asStringArray,
  logSection,
  upsertById,
  upsertByIdSafe,
  resolveAuthorId,
  resolveJobId,
};
