/**
 * controllers/authController.js
 * Handles user registration, login, and profile retrieval.
 */
const User             = require('../models/User');
const { generateToken }= require('../utils/jwtUtils');

// ── Register ──────────────────────────────────────────────────────────────────
// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  const user  = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
  });
};

// ── Login ─────────────────────────────────────────────────────────────────────
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  // Explicitly select password (schema has select:false)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
  });
};

// ── Get current user ──────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe };
