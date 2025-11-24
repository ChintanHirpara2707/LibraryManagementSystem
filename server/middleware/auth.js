const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token. User not found.' 
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({ 
        message: 'Account is not active. Please contact administrator.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.' 
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error during authentication.' 
    });
  }
};

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error during admin authentication.' 
    });
  }
};

// Middleware to check if user is regular user
const userAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'user') {
      return res.status(403).json({ 
        message: 'Access denied. User privileges required.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('User auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error during user authentication.' 
    });
  }
};

// Optional authentication middleware (for public routes that can work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (user && user.status === 'active') {
      req.user = user;
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // If token is invalid, just continue without user
    req.user = null;
    next();
  }
};

// Middleware to check if user owns the resource or is admin
const resourceOwnerAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    const resourceUserId = req.params.userId || req.params.id || req.body.userId;
    
    if (!resourceUserId) {
      return res.status(400).json({ 
        message: 'User ID is required.' 
      });
    }
    
    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }
    
    // User can only access their own resources
    if (req.user._id.toString() !== resourceUserId) {
      return res.status(403).json({ 
        message: 'Access denied. You can only access your own resources.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Resource owner auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error during resource ownership check.' 
    });
  }
};

// Rate limiting middleware (basic implementation)
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Clean old requests
    if (requests.has(ip)) {
      requests.set(ip, requests.get(ip).filter(timestamp => timestamp > windowStart));
    }
    
    const currentRequests = requests.get(ip) || [];
    
    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }
    
    currentRequests.push(now);
    requests.set(ip, currentRequests);
    
    next();
  };
};

module.exports = {
  auth,
  adminAuth,
  userAuth,
  optionalAuth,
  resourceOwnerAuth,
  rateLimit
};
