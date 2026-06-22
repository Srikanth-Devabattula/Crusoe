const PERMISSION_KEYS = ["blogs", "news", "jobs"];

const DEFAULT_PERMISSIONS = Object.fromEntries(
  PERMISSION_KEYS.map((key) => [key, false]),
);

const normalizePermissions = (input) => {
  const out = { ...DEFAULT_PERMISSIONS };
  if (input && typeof input === "object") {
    PERMISSION_KEYS.forEach((key) => {
      if (typeof input[key] === "boolean") {
        out[key] = input[key];
      }
    });
  }
  return out;
};

const adminHasAllPermissions = () =>
  Object.fromEntries(PERMISSION_KEYS.map((key) => [key, true]));

module.exports = {
  PERMISSION_KEYS,
  DEFAULT_PERMISSIONS,
  normalizePermissions,
  adminHasAllPermissions,
};
