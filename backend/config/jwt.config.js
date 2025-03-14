const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-for-development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN }
  );
};

// Verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
