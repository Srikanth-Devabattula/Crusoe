const { newObjectId } = require("../utils/objectId");
const { toMongoShape } = require("../utils/serialize");
const { createSimpleAdapter } = require("../db/adapterHelpers");

const mapOut = (row) => toMongoShape({ ...row, authorId: row.authorId });

const mapIn = (data, { partial } = {}) => {
  const payload = { ...data };
  if (payload._id) {
    payload.id = payload._id;
    delete payload._id;
  }
  if (payload.author !== undefined) {
    payload.authorId = payload.author || null;
    delete payload.author;
  }
  if (!partial && !payload.id) {
    payload.id = newObjectId();
  }
  return payload;
};

module.exports = createSimpleAdapter("news", { mapOut, mapIn });
