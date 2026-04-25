/**
 * Middleware to check if user has admin role
 * Must be used AFTER authMiddleware
 * Blocks non-admin users with 403 Forbidden status
 */
const isAdminMiddleware = (req, res, next) => {
  try {
    // Verify authMiddleware was called first
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required. Use authMiddleware first.' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    res.status(500).json({ message: 'Authorization error', error: error.message });
  }
};

module.exports = isAdminMiddleware;
