const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma");
const { DEFAULT_PERMISSIONS } = require("../constants/permissions");
const { newObjectId } = require("../utils/objectId");
const {
  toMongoShape,
  permissionsToRow,
} = require("../utils/serialize");
const { mapIdFilter, mongooseSortToOrderBy, createChainable } = require("../db/adapterHelpers");

function attachUserSave(doc, row) {
  if (!doc || !row) return doc;
  return {
    ...doc,
    async save() {
      const payload = mapIn({ ...this, _id: this._id }, { partial: true });
      if (payload.password && !String(payload.password).startsWith("$2")) {
        payload.password = await bcrypt.hash(payload.password, 12);
      }
      const updated = await prisma.user.update({
        where: { id: row.id },
        data: payload,
      });
      const next = mapOut(updated, {
        includePasswordPlain: Boolean(this.passwordPlain),
        includePassword: Boolean(this.password),
      });
      Object.assign(this, next);
      return this;
    },
    async deleteOne() {
      await prisma.user.delete({ where: { id: row.id } });
    },
  };
}

function mapOut(row, { includePassword = false, includePasswordPlain = false } = {}) {
  if (!row) return null;
  const doc = toMongoShape(row, { permissions: true });
  if (!includePassword) delete doc.password;
  if (!includePasswordPlain) delete doc.passwordPlain;
  doc.matchPassword = async (enteredPassword) => bcrypt.compare(enteredPassword, row.password);
  return doc;
}

function mapIn(data, { partial } = {}) {
  const payload = { ...data };
  if (payload._id) {
    payload.id = payload._id;
    delete payload._id;
  }
  if (payload.permissions) {
    Object.assign(payload, permissionsToRow(payload.permissions));
    delete payload.permissions;
  }
  if (!partial && !payload.id) payload.id = newObjectId();
  if (!partial && !payload.permissions) {
    Object.assign(payload, permissionsToRow({ ...DEFAULT_PERMISSIONS }));
  }
  return payload;
}

function parseSelect(select) {
  const includePassword = String(select || "").includes("+password");
  const includePasswordPlain = String(select || "").includes("+passwordPlain");
  return { includePassword, includePasswordPlain };
}

const User = {
  find(filter = {}) {
    return createChainable(async (state) => {
      const where = mapIdFilter(filter);
      const orderBy = state.sort
        ? mongooseSortToOrderBy(state.sort)
        : { createdAt: "desc" };
      const { includePasswordPlain } = parseSelect(state.select);
      const rows = await prisma.user.findMany({ where, orderBy });
      return rows.map((row) => mapOut(row, { includePasswordPlain }));
    });
  },
  findOne(filter = {}) {
    return createChainable(async (state) => {
      const { includePassword, includePasswordPlain } = parseSelect(state.select);
      const where = mapIdFilter(filter);
      const row = await prisma.user.findFirst({ where });
      const doc = mapOut(row, { includePassword, includePasswordPlain });
      return attachUserSave(doc, row);
    });
  },
  findById(id) {
    return createChainable(async (state) => {
      const { includePassword, includePasswordPlain } = parseSelect(state.select);
      const row = await prisma.user.findUnique({ where: { id: String(id) } });
      const doc = mapOut(row, { includePassword, includePasswordPlain });
      return attachUserSave(doc, row);
    });
  },
  async create(data) {
    const payload = mapIn(data);
    if (payload.email) {
      payload.email = String(payload.email).trim().toLowerCase();
    }
    if (payload.password && !payload.password.startsWith("$2")) {
      payload.password = await bcrypt.hash(payload.password, 12);
    }
    const row = await prisma.user.create({ data: payload });
    return mapOut(row, { includePasswordPlain: Boolean(data.passwordPlain) });
  },
  async findByIdAndUpdate(id, data, _options) {
    const payload = mapIn(data, { partial: true });
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 12);
    }
    try {
      const row = await prisma.user.update({
        where: { id: String(id) },
        data: payload,
      });
      return mapOut(row, { includePasswordPlain: true });
    } catch {
      return null;
    }
  },
  async findByIdAndDelete(id) {
    try {
      const row = await prisma.user.delete({ where: { id: String(id) } });
      return mapOut(row);
    } catch {
      return null;
    }
  },
  countDocuments(filter = {}) {
    const where = mapIdFilter(filter);
    return prisma.user.count({ where });
  },
};

module.exports = User;
