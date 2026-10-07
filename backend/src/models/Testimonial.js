const { newObjectId } = require("../utils/objectId");
const { toMongoShape } = require("../utils/serialize");
const { createSimpleAdapter } = require("../db/adapterHelpers");

const mapOut = (row) => toMongoShape(row);
const mapIn = (data, { partial } = {}) => {
  const payload = { ...data };
  if (payload._id) {
    payload.id = payload._id;
    delete payload._id;
  }
  if (!partial && !payload.id) payload.id = newObjectId();
  return payload;
};

module.exports = createSimpleAdapter("testimonial", {
  mapOut,
  mapIn,
  defaultOrderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
});
