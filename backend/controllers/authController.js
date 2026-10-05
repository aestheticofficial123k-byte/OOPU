/**
 * controllers/authController.js
 * Handles email/password, phone OTP, Google auth, and profile management.
 */

const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');
const { getAuth } = require('../config/firebaseAdmin');

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
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      avatarColor: user.avatarColor,
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
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      avatarColor: user.avatarColor,
      createdAt: user.createdAt,
    },
  });
};

// ── Login / Register with Phone ──────────────────────────────────────────────
// Temporary OTP: 8934
const phoneLogin = async (req, res) => {
  const { phone } = req.body;

  let user = await User.findOne({ phone });

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
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      avatarColor: user.avatarColor,
      createdAt: user.createdAt,
    },
  });
};

// ── Login / Register with Google ─────────────────────────────────────────────
const googleLogin = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify Firebase Google ID token
    const decoded = await getAuth().verifyIdToken(idToken);

    const { uid, email, name, picture } = decoded;

    // Find existing Google account
    let user = await User.findOne({ googleId: uid });

    // If not found, check for existing email account
    if (!user && email) {
      user = await User.findOne({ email });
    }

    // Create new OOPU account
    if (!user) {
      user = await User.create({
        name: name || 'OOPU User',
        email: email || undefined,
        googleId: uid,
        avatar: picture || undefined,
      });
    }

    // Link Google to existing OOPU account
    else if (!user.googleId) {
      user.googleId = uid;

      if (picture && !user.avatar) {
        user.avatar = picture;
      }

      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Google authentication error:', error);

    res.status(401).json({
      success: false,
      message: 'Google authentication failed',
    });
  }
};

// ── Update Profile ────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const { name, username, avatarColor } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update name
  if (name !== undefined) {
    const cleanName = name.trim();

    if (!cleanName) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty',
      });
    }

    user.name = cleanName;
  }

  // Update username
  if (username !== undefined) {
    const cleanUsername = username.trim().toLowerCase();

    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      return res.status(400).json({
        success: false,
        message:
          'Username must be 3–20 characters and contain only letters, numbers, and underscores',
      });
    }

    const usernameTaken = await User.findOne({
      username: cleanUsername,
      _id: { $ne: user._id },
    });

    if (usernameTaken) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken',
      });
    }

    user.username = cleanUsername;
  }

  // Update avatar background color
  if (avatarColor !== undefined) {
    const allowedColors = [
      '#CDEDEA',
      '#FFE8E2',
      '#EEE7FF',
      '#FFF1C9',
      '#E8E3DC',
      '#DCE8FF',
    ];

    if (!allowedColors.includes(avatarColor)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid avatar color',
      });
    }

    user.avatarColor = avatarColor;
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      avatarColor: user.avatarColor,
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

// ── Exports ───────────────────────────────────────────────────────────────────
module.exports = {
  register,
  login,
  phoneLogin,
  googleLogin,
  updateProfile,
  getMe,
};