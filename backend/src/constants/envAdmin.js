/** JWT subject id for env-configured administrator */
const ENV_ADMIN_ID = "env-admin";

const getEnvAdminUser = () => ({
  _id: ENV_ADMIN_ID,
  name: process.env.ADMIN_NAME || "Administrator",
  email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
  role: "admin",
});

const isEnvAdminConfigured = () =>
  Boolean(process.env.ADMIN_EMAIL?.trim() && process.env.ADMIN_PASSWORD);

module.exports = { ENV_ADMIN_ID, getEnvAdminUser, isEnvAdminConfigured };
