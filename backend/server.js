/**
 * server.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Application entry point.
 * Bootstraps Express, registers global middleware, mounts route modules,
 * attaches the centralised error handler, and starts the HTTP server.
 * ──────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
require('express-async-errors'); // patches async route errors → no try/catch needed

const express = require('express');
const cors    = require('cors');

const connectDB      = require('./config/db');
const errorHandler   = require('./middleware/errorHandler');

// ── Route modules ─────────────────────────────────────────────────────────────
const authRoutes     = require('./routes/authRoutes');
const clothingRoutes = require('./routes/clothingRoutes');
const outfitRoutes   = require('./routes/outfitRoutes');
const plannerRoutes  = require('./routes/plannerRoutes');

const app = express();

// ── Global middleware ─────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);
app.use('/api/clothes', clothingRoutes);
app.use('/api/outfits', outfitRoutes);
app.use('/api/planner', plannerRoutes);

// Health-check (useful for deployment ping / Docker health checks)
app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// 404 catch-all (must be after all routes)
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Centralised error handler (must be last middleware) ───────────────────────
app.use(errorHandler);

// ── Boot ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () =>
    console.log(`🚀  Server listening on http://localhost:${PORT}  [${process.env.NODE_ENV}]`)
  )
);
