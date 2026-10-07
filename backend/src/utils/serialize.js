const PERM_FIELDS = [
  ["permBlogs", "blogs"],
  ["permNews", "news"],
  ["permJobs", "jobs"],
  ["permTestimonials", "testimonials"],
  ["permTeam", "team"],
  ["permPartners", "partners"],
  ["permHeroSlides", "heroSlides"],
  ["permContacts", "contacts"],
  ["permApplications", "applications"],
];

function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function permissionsFromRow(row) {
  const permissions = {};
  for (const [col, key] of PERM_FIELDS) {
    permissions[key] = Boolean(row?.[col]);
  }
  return permissions;
}

function permissionsToRow(permissions = {}) {
  const row = {};
  for (const [col, key] of PERM_FIELDS) {
    row[col] = Boolean(permissions[key]);
  }
  return row;
}

/** Prisma row → API document shape (Mongo-style `_id`, ISO dates). */
function toMongoShape(row, options = {}) {
  if (!row) return null;

  const { id, authorId, jobId, ...rest } = row;
  const doc = { ...rest };

  doc._id = id;
  if (authorId !== undefined) doc.author = authorId || undefined;
  if (jobId !== undefined) doc.job = jobId || undefined;

  if (rest.images !== undefined) {
    doc.images = parseJsonArray(rest.images);
  }
  if (rest.videoUrls !== undefined) {
    doc.videoUrls = parseJsonArray(rest.videoUrls);
  }

  if (options.permissions) {
    doc.permissions = permissionsFromRow(row);
    for (const [col] of PERM_FIELDS) {
      delete doc[col];
    }
  }

  for (const key of Object.keys(doc)) {
    if (doc[key] instanceof Date) {
      doc[key] = doc[key].toISOString();
    }
  }

  return doc;
}

function toMongoShapes(rows, options) {
  return (rows || []).map((row) => toMongoShape(row, options));
}

module.exports = {
  parseJsonArray,
  permissionsFromRow,
  permissionsToRow,
  toMongoShape,
  toMongoShapes,
};
