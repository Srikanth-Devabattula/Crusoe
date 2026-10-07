const bcrypt = require("bcryptjs");
const { prisma } = require("../lib/prisma");
const { newObjectId } = require("../utils/objectId");
const { toMongoShape } = require("../utils/serialize");
const { mapIdFilter } = require("../db/adapterHelpers");

function attachMethods(doc, row) {
  if (!doc) return null;
  return {
    ...doc,
    verifyOTP: (enteredOTP) => bcrypt.compare(String(enteredOTP), row.hashedOTP),
    isValid: () => !row.isUsed && row.attempts < 3 && new Date() < new Date(row.expiresAt),
    incrementAttempts: async function incrementAttempts() {
      const updated = await prisma.oTP.update({
        where: { id: row.id },
        data: { attempts: row.attempts + 1 },
      });
      Object.assign(row, updated);
      this.attempts = updated.attempts;
      return this;
    },
    markAsUsed: async function markAsUsed() {
      const updated = await prisma.oTP.update({
        where: { id: row.id },
        data: { isUsed: true },
      });
      Object.assign(row, updated);
      this.isUsed = true;
      return this;
    },
  };
}

function mapRow(row) {
  if (!row) return null;
  const doc = toMongoShape(row);
  return attachMethods(doc, row);
}

const OTP = {
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  async createOTP(email, ipAddress = null, userAgent = null) {
    await prisma.oTP.updateMany({
      where: { email: email.toLowerCase(), isUsed: false },
      data: { isUsed: true },
    });

    const plainOTP = OTP.generateOTP();
    const hashedOTP = await bcrypt.hash(plainOTP, 12);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const row = await prisma.oTP.create({
      data: {
        id: newObjectId(),
        email: email.toLowerCase(),
        hashedOTP,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    return { otpDoc: mapRow(row), plainOTP };
  },

  findValidOTP(email) {
    return prisma.oTP
      .findFirst({
        where: {
          email: email.toLowerCase(),
          isUsed: false,
          attempts: { lt: 3 },
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: "desc" },
      })
      .then(mapRow);
  },

  async cleanupExpired() {
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await prisma.oTP.deleteMany({
      where: {
        OR: [{ expiresAt: { lt: new Date() } }, { isUsed: true, createdAt: { lt: dayAgo } }],
      },
    });
    return result.count;
  },

  async updateMany(filter, update) {
    const where = mapIdFilter(filter);
    const result = await prisma.oTP.updateMany({ where, data: update });
    return { modifiedCount: result.count };
  },

  create(data) {
    return prisma.oTP
      .create({
        data: {
          id: newObjectId(),
          ...data,
          email: data.email.toLowerCase(),
        },
      })
      .then(mapRow);
  },
};

module.exports = OTP;
