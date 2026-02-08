// Authentication Middleware
const jwt = require('jsonwebtoken');

// Verify JWT token
exports.authenticateToken = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
      
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Optional authentication (doesn't fail if no token)
exports.optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, decoded) => {
        if (!err) {
          req.userId = decoded.userId;
        }
      });
    }
    
    next();
  } catch (error) {
    next();
  }
};
