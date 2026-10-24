const { newObjectId, isValidObjectId } = require("../utils/objectId");
const { toMongoShape } = require("../utils/serialize");
const { createSimpleAdapter } = require("../db/adapterHelpers");

const mapOut = (row) => toMongoShape({ ...row, authorId: row.authorId });

const NEWS_WRITE_KEYS = [
  "id",
  "title",
  "slug",
  "excerpt",
  "content",
  "category",
  "coverImage",
  "images",
  "videoUrl",
  "videoUrls",
  "featured",
  "published",
  "publishedAt",
  "authorId",
];

const pickNewsWriteFields = (payload) => {
  const out = {};
  for (const key of NEWS_WRITE_KEYS) {
    if (payload[key] !== undefined) out[key] = payload[key];
  }
  return out;
};

const mapIn = (data, { partial } = {}) => {
  const payload = { ...data };
  if (payload._id) {
    payload.id = payload._id;
    delete payload._id;
  }
  if (payload.author !== undefined) {
    const author = payload.author ? String(payload.author) : "";
    payload.authorId = isValidObjectId(author) ? author : null;
    delete payload.author;
  }
  if (payload.images !== undefined && !Array.isArray(payload.images)) {
    payload.images = [];
  }
  if (payload.videoUrls !== undefined && !Array.isArray(payload.videoUrls)) {
    payload.videoUrls = [];
  }
  if (!partial && !payload.id) {
    payload.id = newObjectId();
  }
  return pickNewsWriteFields(payload);
};

module.exports = createSimpleAdapter("news", { mapOut, mapIn });
