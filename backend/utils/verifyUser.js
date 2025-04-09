const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  console.log("sdfsd");
  const token = req.cookies.access_token;
  console.log(token);
  if (!token) {
    return next(new Error("Token is missing"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err);
      return next(new Error("Invalid or expired token"));
    }
    req.user = user.user || user.validUser || user.newUser;
    next();
  });
};

module.exports = verifyUser;
