/**
 * models/ClothingItem.js
 * Core clothing item schema.
 * Structured to support future AI detection (aiDetected, aiConfidence fields).
 */
const mongoose = require('mongoose');

const clothingItemSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    // ── Image ──────────────────────────────────────────────────────
    imageUrl:           { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' }, // for deletion from Cloudinary

    // ── Classification ─────────────────────────────────────────────
    name: { type: String, trim: true, default: '' },
    type: {
      type:     String,
      required: [true, 'Clothing type is required'],
      enum: [
        'shirt','t-shirt','blouse','jeans','trousers','shorts','skirt',
        'dress','blazer','jacket','coat','sweater','hoodie',
        'sneakers','formal-shoes','boots','sandals',
        'belt','hat','scarf','bag','watch','other',
      ],
    },
    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum:     ['top','bottom','footwear','accessory','full-body'],
    },
    color:   { type: String, required: [true, 'Color is required'], trim: true },
    pattern: {
      type:    String,
      enum:    ['plain','striped','checked','floral','geometric','abstract','animal-print','other'],
      default: 'plain',
    },
    formalityLevel: {
      type:     String,
      enum:     ['casual','semi-formal','formal'],
      required: [true, 'Formality level is required'],
    },
    season: {
      type:     String,
      enum:     ['summer','winter','spring','autumn','all-season'],
      required: [true, 'Season is required'],
    },

    // ── Optional metadata ──────────────────────────────────────────
    brand: { type: String, trim: true, default: '' },
    notes: { type: String, trim: true, default: '' },

    // ── Usage tracking ─────────────────────────────────────────────
    wearCount:    { type: Number, default: 0 },
    lastWornDate: { type: Date,   default: null },

    // ── Future: AI detection fields ────────────────────────────────
    aiDetected:  { type: Boolean, default: false },
    aiConfidence:{ type: Number,  default: null  },
  },
  { timestamps: true }
);

// Compound indexes for fast wardrobe filtering
clothingItemSchema.index({ userId: 1, category:      1 });
clothingItemSchema.index({ userId: 1, formalityLevel:1 });
clothingItemSchema.index({ userId: 1, season:        1 });

module.exports = mongoose.model('ClothingItem', clothingItemSchema);
