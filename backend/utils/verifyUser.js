const jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  console.log("Verifying user...");
  // console.log(req.cookies)
  // Check for admin token in Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || process.env.SECRET_KEY
      );
      req.user = decoded; // Store the entire decoded payload
      return next();
    } catch (err) {
      console.error("Admin token verification error:", err.message);
      // Continue to check cookie token if admin token is invalid
    }
  }

  // Check for regular user token in cookies
  const cookieToken = req.cookies.access_token;
  if (!cookieToken) {
    return res.status(401).json({ error: "Authentication token is missing" });
  }

  try {
    const decoded = jwt.verify(cookieToken, process.env.SECRET_KEY);
    req.user = decoded;
    console.log("In verify User");
    next();
  } catch (err) {
    console.error("User token verification error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = verifyUser;
