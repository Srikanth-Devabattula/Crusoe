const User = require("../models/User");
const {
  getConfiguredAdminEmail,
  isEnvAdminConfigured,
} = require("../constants/envAdmin");

/**
 * When ADMIN_BOOTSTRAP_PASSWORD is set (GoDaddy secret), ensure admin user exists.
 * Remove the secret after first successful login.
 */
const ensureAdminFromBootstrap = async () => {
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();
  if (!password || !isEnvAdminConfigured()) return;

  const email = getConfiguredAdminEmail();
  let user = await User.findOne({ email, role: "admin" });

  if (!user) {
    await User.create({
      name: process.env.ADMIN_NAME || "Administrator",
      email,
      password,
      passwordPlain: password,
      role: "admin",
    });
    console.log("Admin account created from ADMIN_BOOTSTRAP_PASSWORD");
    return;
  }

  const forceReset =
    process.env.ADMIN_BOOTSTRAP_FORCE === "1" ||
    process.env.ADMIN_BOOTSTRAP_FORCE === "true";
  if (!forceReset) {
    return;
  }

  await User.findByIdAndUpdate(user._id, {
    password,
    passwordPlain: password,
  });
  console.log("Admin password reset from ADMIN_BOOTSTRAP_FORCE + ADMIN_BOOTSTRAP_PASSWORD");
};

module.exports = { ensureAdminFromBootstrap };
