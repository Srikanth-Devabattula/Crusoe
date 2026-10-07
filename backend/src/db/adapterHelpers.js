const { prisma } = require("../lib/prisma");

function mapIdFilter(filter = {}) {
  const where = { ...filter };
  if (where._id !== undefined) {
    if (typeof where._id === "object" && where._id.$ne !== undefined) {
      where.id = { not: String(where._id.$ne) };
    } else {
      where.id = String(where._id);
    }
    delete where._id;
  } else if (where.id && typeof where.id === "object" && where.id.$ne !== undefined) {
    where.id = { not: String(where.id.$ne) };
  }
  return where;
}

function mongooseSortToOrderBy(sort) {
  if (!sort || typeof sort !== "object") {
    return { createdAt: "desc" };
  }
  const orderBy = [];
  for (const [key, dir] of Object.entries(sort)) {
    const field = key === "_id" ? "id" : key;
    orderBy.push({ [field]: dir === -1 || dir === "desc" ? "desc" : "asc" });
  }
  return orderBy.length === 1 ? orderBy[0] : orderBy;
}

function createChainable(executor) {
  const state = { sort: null, select: null };
  const api = {
    sort(sortSpec) {
      state.sort = sortSpec;
      return api;
    },
    select(selectSpec) {
      state.select = selectSpec;
      return api;
    },
    then(onFulfilled, onRejected) {
      return executor(state).then(onFulfilled, onRejected);
    },
  };
  return api;
}

function attachSave(doc, delegate, mapIn, mapOut, row) {
  if (!doc || !row) return doc;
  return {
    ...doc,
    async save() {
      const payload = mapIn(
        {
          ...this,
          _id: this._id,
        },
        { partial: true }
      );
      const updated = await delegate.update({
        where: { id: row.id },
        data: payload,
      });
      const next = mapOut(updated);
      Object.assign(this, next);
      return this;
    },
    async deleteOne() {
      await delegate.delete({ where: { id: row.id } });
    },
  };
}

function createSimpleAdapter(modelName, { mapOut, mapIn, defaultOrderBy } = {}) {
  const delegate = prisma[modelName];

  const adaptOut = (row) => (mapOut ? mapOut(row) : row);
  const adaptIn = (data, options) => (mapIn ? mapIn(data, options) : data);

  return {
    find(filter = {}, sort) {
      if (sort !== undefined) {
        const where = mapIdFilter(filter);
        const orderBy = mongooseSortToOrderBy(sort);
        return delegate
          .findMany({ where, orderBy })
          .then((rows) =>
            rows.map((row) => attachSave(adaptOut(row), delegate, adaptIn, adaptOut, row))
          );
      }

      return createChainable(async (state) => {
        const where = mapIdFilter(filter);
        const orderBy = state.sort
          ? mongooseSortToOrderBy(state.sort)
          : defaultOrderBy || { createdAt: "desc" };
        const rows = await delegate.findMany({ where, orderBy });
        return rows.map((row) =>
          attachSave(adaptOut(row), delegate, adaptIn, adaptOut, row)
        );
      });
    },
    findOne(filter = {}) {
      return createChainable(async () => {
        const where = mapIdFilter(filter);
        const row = await delegate.findFirst({ where });
        return adaptOut(row);
      });
    },
    findById(id) {
      return createChainable(async () => {
        const row = await delegate.findUnique({ where: { id: String(id) } });
        return attachSave(adaptOut(row), delegate, adaptIn, adaptOut, row);
      });
    },
    async countDocuments(filter = {}) {
      const where = mapIdFilter(filter);
      return delegate.count({ where });
    },
    create(data) {
      return delegate.create({ data: adaptIn(data) }).then(adaptOut);
    },
    async insertMany(items) {
      const created = [];
      for (const item of items) {
        const row = await delegate.create({ data: adaptIn(item) });
        created.push(adaptOut(row));
      }
      return created;
    },
    async findByIdAndUpdate(id, payload, _options) {
      try {
        const row = await delegate.update({
          where: { id: String(id) },
          data: adaptIn(payload, { partial: true }),
        });
        return adaptOut(row);
      } catch {
        return null;
      }
    },
    async findByIdAndDelete(id) {
      try {
        const row = await delegate.delete({ where: { id: String(id) } });
        return adaptOut(row);
      } catch {
        return null;
      }
    },
    async updateMany(filter, update) {
      const where = mapIdFilter(filter);
      const data = adaptIn(update, { partial: true });
      const result = await delegate.updateMany({ where, data });
      return { modifiedCount: result.count, matchedCount: result.count };
    },
    async deleteMany(filter) {
      const where = mapIdFilter(filter);
      const result = await delegate.deleteMany({ where });
      return { deletedCount: result.count };
    },
  };
}

module.exports = {
  mapIdFilter,
  mongooseSortToOrderBy,
  createSimpleAdapter,
  attachSave,
  createChainable,
  prisma,
};
