// Temporarily comment out jsonwebtoken until it's installed
// const jwt = require('jsonwebtoken');
const httpError = require('http-errors');

// Temporarily commented out since we're not using JWT
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw httpError.Unauthorized('No token provided');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw httpError.Unauthorized('No token provided');
    }
    
    // Temporarily decode token without jwt
    // const decoded = jwt.verify(token, JWT_SECRET);
    
    // Simple base64 decoding
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Add user data to request
      req.user = decoded;
    } catch (decodeError) {
      return next(httpError.Unauthorized('Invalid token format'));
    }
    
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(httpError.Unauthorized('Invalid or expired token'));
    }
    next(err);
  }
};

// Admin role check middleware
const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      throw httpError.Forbidden('Admin access required');
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authMiddleware;
module.exports.adminMiddleware = adminMiddleware;
