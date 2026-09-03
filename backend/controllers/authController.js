/**
 * controllers/authController.js
 * Handles email/password, phone OTP, and profile retrieval.
 */
const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// ── Register with Email / Password ───────────────────────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });

  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered',
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
};

// ── Login with Email / Password ──────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.password || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
};

// ── Login / Register with Phone ──────────────────────────────────────────────
// Temporary OTP: 123456
const phoneLogin = async (req, res) => {
  const { phone } = req.body;

  let user = await User.findOne({ phone });

  // New phone number → create a new account
  if (!user) {
    user = await User.create({
      name: 'OOPU User',
      phone,
    });
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    },
  });
};

// ── Get Current User ─────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  phoneLogin,
  getMe,
};