import { verifyToken, extractToken } from '../utils/jwt.js';

/**
 * Middleware to authenticate JWT tokens
 * Supports both Authorization header and query parameter (for file downloads/views)
 */
export const authenticateToken = async (req, res, next) => {
  try {
    // Try Authorization header first
    const authHeader = req.headers.authorization;
    let token = extractToken(authHeader);

    // If no token in header, try query parameter (for file downloads/views)
    if (!token && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

/**
 * Middleware to check if user has required role
 * @param {...string} roles - Allowed roles
 */
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userRole = req.user.role || req.user.role_name;
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole('admin');

