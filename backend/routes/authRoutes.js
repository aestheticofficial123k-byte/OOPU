/**
 * routes/authRoutes.js
 * Auth endpoints: email/password, phone OTP, Google, profile, me
 */
const express = require('express');
const { body } = require('express-validator');

const {
  register,
  login,
  phoneLogin,
  googleLogin,
  updateProfile,
  getMe,
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ── Email / Password Register ────────────────────────────────────────────────
// Email signup does NOT require a phone number.
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required'),

    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  register
);

// ── Email / Password Login ───────────────────────────────────────────────────
// Email login does NOT require a phone number.
router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],
  validate,
  login
);

// ── Phone / OTP Login ────────────────────────────────────────────────────────
// Temporary OTP: 8934
// Phone login does NOT require an email.
router.post(
  '/phone',
  [
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required'),

    body('otp')
      .trim()
      .notEmpty()
      .withMessage('OTP is required'),

    body('otp')
      .equals('8934')
      .withMessage('Invalid OTP'),
  ],
  validate,
  phoneLogin
);

// ── Google Authentication ────────────────────────────────────────────────────
router.post(
  '/google',
  [
    body('idToken')
      .notEmpty()
      .withMessage('Google ID token is required'),
  ],
  validate,
  googleLogin
);

// ── Update Profile ───────────────────────────────────────────────────────────
// Allows authenticated users to update:
// name, username, and avatar background color.
router.put(
  '/profile',
  protect,
  updateProfile
);

// ── Get Current User ─────────────────────────────────────────────────────────
router.get('/me', protect, getMe);

module.exports = router;