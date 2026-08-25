/**
 * models/PlannedOutfit.js
 * Calendar outfit planner schema.
 * One plan per user per date (enforced by unique compound index).
 */
const mongoose = require('mongoose');

const plannedOutfitSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      index:    true,
    },
    date: { type: Date, required: [true, 'Date is required'] },

    // ── Outfit items (refs to ClothingItem) ────────────────────────
    topId:       { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', default: null },
    bottomId:    { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', default: null },
    footwearId:  { type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem', default: null },
    accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClothingItem' }],

    // ── Meta ───────────────────────────────────────────────────────
    occasion: { type: String, trim: true, default: '' },
    notes:    { type: String, trim: true, default: '' },

    // ── Worn status ────────────────────────────────────────────────
    worn:   { type: Boolean, default: false },
    wornAt: { type: Date,    default: null  },
  },
  { timestamps: true }
);

// One outfit plan per user per date
plannedOutfitSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('PlannedOutfit', plannedOutfitSchema);
