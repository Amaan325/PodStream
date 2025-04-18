const User = require("../models/userModel"); // Adjust path as necessary

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    // Assuming the user's ID is stored in req.user.id after authentication (like through JWT)
    const user = await User.findById(req.user.id);

    // If no user found or the user is not an admin
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // If the user is an admin, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = isAdmin;
