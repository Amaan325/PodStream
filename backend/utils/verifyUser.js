const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(401, "Token is missing");
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user.user || user.validUser;
    console.log("dine")
    next();
  });
};

module.exports = verifyUser;
