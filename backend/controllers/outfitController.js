/**
 * controllers/outfitController.js
 * Delegates suggestion logic to the recommendation service.
 */
const ClothingItem = require('../models/ClothingItem');
const {
  getGeneralSuggestions,
  getOccasionSuggestions,
} = require('../services/recommendationService');

// GET /api/outfits/suggest
const suggestOutfits = async (req, res) => {
  const items = await ClothingItem.find({ userId: req.user._id });

  if (items.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Add at least 3 clothing items to receive outfit suggestions',
    });
  }

  const suggestions = getGeneralSuggestions(items);
  res.json({ success: true, count: suggestions.length, data: suggestions });
};

// GET /api/outfits/suggest/:occasion
const suggestByOccasion = async (req, res) => {
  const { occasion } = req.params;
  const valid = ['casual', 'semi-formal', 'formal'];

  if (!valid.includes(occasion)) {
    return res.status(400).json({
      success: false,
      message: `Occasion must be one of: ${valid.join(', ')}`,
    });
  }

  const items       = await ClothingItem.find({ userId: req.user._id });
  const suggestions = getOccasionSuggestions(items, occasion);

  if (!suggestions.length) {
    return res.status(404).json({
      success: false,
      message: `No outfit combinations found for "${occasion}". Try adding more ${occasion} items.`,
    });
  }

  res.json({ success: true, count: suggestions.length, data: suggestions });
};

module.exports = { suggestOutfits, suggestByOccasion };
