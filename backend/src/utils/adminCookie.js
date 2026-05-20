const ADMIN_TOKEN_COOKIE = "adminToken";

const setAdminTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

const clearAdminTokenCookie = (res) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie(ADMIN_TOKEN_COOKIE, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
};

module.exports = {
  ADMIN_TOKEN_COOKIE,
  setAdminTokenCookie,
  clearAdminTokenCookie,
};
