const User = require('../models/userModel');

const isAdmin = async (req, res, next) => {
  try {
    // Debugging logs
    console.log("User from token:", req.user);
    
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized access - no user data' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admins only.',
        userRole: user.role // Helpful for debugging
      });
    }
    
    // Attach full user document to request for later use
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    return res.status(500).json({ 
      message: 'Server error during admin check',
      error: error.message 
    });
  }
};

module.exports = isAdmin;