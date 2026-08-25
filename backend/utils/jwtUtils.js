/**
 * utils/jwtUtils.js
 * Token generation helper — keeps JWT logic in one place.
 */
const jwt = require('jsonwebtoken');

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

module.exports = { generateToken };
