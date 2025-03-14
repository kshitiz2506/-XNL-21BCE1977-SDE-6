const { verifyToken } = require('../config/jwt.config');

const authenticate = (req, res, next) => {
  // Get token from header or cookie
  const token = req.cookies.token || 
                (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
};

// Role-based authorization
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };
