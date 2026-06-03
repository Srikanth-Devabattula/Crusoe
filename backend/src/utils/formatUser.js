const { adminHasAllPermissions } = require("../constants/permissions");

const formatUser = (user) => {
  const doc = user?.toObject ? user.toObject() : user;
  const role = doc.role === "user" ? "staff" : doc.role;
  const isAdmin = role === "admin";

  return {
    _id: doc._id,
    name: doc.name,
    email: doc.email,
    role,
    permissions: isAdmin ? adminHasAllPermissions() : doc.permissions || {},
  };
};

module.exports = { formatUser };
