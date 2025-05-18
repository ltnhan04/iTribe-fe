class CookieHelper {
  static setCookie = (res, name, value) => {
    res.cookie(name, value, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });
  };
}

module.exports = CookieHelper;
