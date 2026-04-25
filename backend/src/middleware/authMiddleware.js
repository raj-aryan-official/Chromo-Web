const User = require('../models/User');

/**
 * Middleware to verify Firebase UID and attach user data to request
 * This middleware checks if the user exists in the database and attaches their data
 * Expected header: Authorization: Bearer {firebaseUid}
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // Extract Firebase UID from "Bearer {uid}" format
    const firebaseUid = authHeader.replace('Bearer ', '').trim();

    if (!firebaseUid) {
      return res.status(401).json({ message: 'Firebase UID missing in Authorization header' });
    }

    // Find user in database
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(401).json({ message: 'User not found in database' });
    }

    // Attach user to request object for use in controllers
    req.user = {
      firebaseUid: user.firebaseUid,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Authentication error', error: error.message });
  }
};

module.exports = authMiddleware;
