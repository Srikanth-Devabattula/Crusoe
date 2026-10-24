const { isValidObjectId } = require("./objectId");

/** Map JWT user id to a valid Prisma authorId (null for env-admin). */
function resolveAuthorId(userId) {
  const id = userId ? String(userId).trim() : "";
  return isValidObjectId(id) ? id : null;
}

module.exports = { resolveAuthorId };
