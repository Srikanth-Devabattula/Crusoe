const { prisma } = require("../lib/prisma");
const { newObjectId } = require("../utils/objectId");
const { toMongoShape } = require("../utils/serialize");
const { mapIdFilter, mongooseSortToOrderBy } = require("../db/adapterHelpers");
const Job = require("./Job");

const mapOut = (row) => toMongoShape({ ...row, jobId: row.jobId });

const mapIn = (data, { partial } = {}) => {
  const payload = { ...data };
  if (payload._id) {
    payload.id = payload._id;
    delete payload._id;
  }
  if (payload.job !== undefined) {
    const jobRef =
      payload.job && typeof payload.job === "object" ? payload.job._id : payload.job;
    payload.jobId = jobRef || null;
    delete payload.job;
  }
  if (!partial && !payload.id) payload.id = newObjectId();
  return payload;
};

function attachSave(doc) {
  if (!doc) return doc;
  return {
    ...doc,
    async save() {
      const row = await prisma.application.update({
        where: { id: doc._id },
        data: mapIn(
          {
            job: doc.job,
            applicationType: doc.applicationType,
            message: doc.message,
            name: doc.name,
            email: doc.email,
            phone: doc.phone,
            resume: doc.resume,
            status: doc.status,
          },
          { partial: true }
        ),
      });
      const next = mapOut(row);
      Object.assign(this, next);
      return this;
    },
    async deleteOne() {
      await prisma.application.delete({ where: { id: doc._id } });
    },
  };
}

async function populateJob(doc) {
  if (!doc?.job) return doc;
  const job = await Job.findById(doc.job);
  if (!job) return doc;
  return {
    ...doc,
    job: {
      _id: job._id,
      title: job.title,
      location: job.location,
      experience: job.experience,
    },
  };
}

const Application = {
  async find(filter = {}, sort) {
    const where = mapIdFilter(filter);
    const orderBy = sort ? mongooseSortToOrderBy(sort) : { createdAt: "desc" };
    const rows = await prisma.application.findMany({ where, orderBy });
    return rows.map((row) => attachSave(mapOut(row)));
  },
  findOne(filter = {}) {
    const where = mapIdFilter(filter);
    return prisma.application.findFirst({ where }).then((row) => attachSave(mapOut(row)));
  },
  findById(id) {
    return prisma.application
      .findUnique({ where: { id: String(id) } })
      .then((row) => attachSave(mapOut(row)));
  },
  create(data) {
    return prisma.application.create({ data: mapIn(data) }).then((row) => attachSave(mapOut(row)));
  },
  async findByIdAndDelete(id) {
    try {
      const row = await prisma.application.delete({ where: { id: String(id) } });
      return mapOut(row);
    } catch {
      return null;
    }
  },
  populateJob,
};

module.exports = Application;
