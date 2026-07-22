/** JWT subject id for legacy env-configured administrator sessions */
const ENV_ADMIN_ID = "env-admin";

const getConfiguredAdminEmail = () =>
  process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";

const getEnvAdminUser = () => ({
  _id: ENV_ADMIN_ID,
  name: process.env.ADMIN_NAME || "Administrator",
  email: getConfiguredAdminEmail(),
  role: "admin",
});

const isEnvAdminConfigured = () => Boolean(getConfiguredAdminEmail());

const isConfiguredAdminEmail = (email) => {
  const configured = getConfiguredAdminEmail();
  if (!configured || !email) return false;
  return String(email).trim().toLowerCase() === configured;
};

module.exports = {
  ENV_ADMIN_ID,
  getEnvAdminUser,
  getConfiguredAdminEmail,
  isEnvAdminConfigured,
  isConfiguredAdminEmail,
};
