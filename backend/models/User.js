/**
 * models/User.js
 * User schema supporting email/password, phone, Google, and Facebook auth.
 */
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    // Email/password authentication
    email: {
      type:      String,
      unique:    true,
      sparse:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type:      String,
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false,
    },

    // Phone authentication
    phone: {
      type:   String,
      unique: true,
      sparse: true,
      trim:   true,
    },

    // Social authentication
    googleId: {
      type:   String,
      unique: true,
      sparse: true,
    },

    facebookId: {
      type:   String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password with hashed password
userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);