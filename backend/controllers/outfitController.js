/**
 * controllers/outfitController.js
 * Handles outfit suggestions and community outfits.
 */

const ClothingItem = require('../models/ClothingItem');
const Outfit = require('../models/Outfit');

const {
  getGeneralSuggestions,
  getOccasionSuggestions,
} = require('../services/recommendationService');


// ── Get General Outfit Suggestions ──────────────────────────────────────────
// GET /api/outfits/suggest
const suggestOutfits = async (req, res) => {
  const items = await ClothingItem.find({
    userId: req.user._id,
  });

  if (items.length < 3) {
    return res.status(400).json({
      success: false,
      message: 'Add at least 3 clothing items to receive outfit suggestions',
    });
  }

  const suggestions = getGeneralSuggestions(items);

  res.json({
    success: true,
    count: suggestions.length,
    data: suggestions,
  });
};


// ── Get Occasion-Based Suggestions ──────────────────────────────────────────
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

  const items = await ClothingItem.find({
    userId: req.user._id,
  });

  const suggestions = getOccasionSuggestions(items, occasion);

  if (!suggestions.length) {
    return res.status(404).json({
      success: false,
      message: `No outfit combinations found for "${occasion}". Try adding more ${occasion} items.`,
    });
  }

  res.json({
    success: true,
    count: suggestions.length,
    data: suggestions,
  });
};


// ── Create Outfit ────────────────────────────────────────────────────────────
// POST /api/outfits
const createOutfit = async (req, res) => {
  const {
    title,
    items,
    imageUrl,
    tags,
    isPublic,
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one clothing item is required',
    });
  }

  const outfit = await Outfit.create({
    user: req.user._id,
    title: title || '',
    items,
    imageUrl: imageUrl || '',
    tags: tags || [],
    isPublic: isPublic || false,
  });

  const populatedOutfit = await outfit.populate([
    {
      path: 'user',
      select: 'name username avatarColor',
    },
    {
      path: 'items',
    },
  ]);

  res.status(201).json({
    success: true,
    data: populatedOutfit,
  });
};


// ── Get My Outfits ───────────────────────────────────────────────────────────
// GET /api/outfits/mine
const getMyOutfits = async (req, res) => {
  const outfits = await Outfit.find({
    user: req.user._id,
  })
    .populate('user', 'name username avatarColor')
    .populate('items')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: outfits.length,
    data: outfits,
  });
};


// ── Get Community Outfits ────────────────────────────────────────────────────
// GET /api/outfits/community
const getCommunityOutfits = async (req, res) => {
  const outfits = await Outfit.find({
    isPublic: true,
  })
    .populate('user', 'name username avatarColor')
    .populate('items')
    .sort({ createdAt: -1 })
    .limit(30);

  res.json({
    success: true,
    count: outfits.length,
    data: outfits,
  });
};


// ── Update Outfit ────────────────────────────────────────────────────────────
// PUT /api/outfits/:id
const updateOutfit = async (req, res) => {
  const outfit = await Outfit.findById(req.params.id);

  if (!outfit) {
    return res.status(404).json({
      success: false,
      message: 'Outfit not found',
    });
  }

  // Only the owner can edit the outfit
  if (outfit.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to edit this outfit',
    });
  }

  const {
    title,
    items,
    imageUrl,
    tags,
    isPublic,
  } = req.body;

  if (items !== undefined) {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one clothing item is required',
      });
    }

    outfit.items = items;
  }

  if (title !== undefined) {
    outfit.title = title;
  }

  if (imageUrl !== undefined) {
    outfit.imageUrl = imageUrl;
  }

  if (tags !== undefined) {
    outfit.tags = tags;
  }

  if (isPublic !== undefined) {
    outfit.isPublic = isPublic;
  }

  await outfit.save();

  const populatedOutfit = await outfit.populate([
    {
      path: 'user',
      select: 'name username avatarColor',
    },
    {
      path: 'items',
    },
  ]);

  res.json({
    success: true,
    message: 'Outfit updated successfully',
    data: populatedOutfit,
  });
};


// ── Delete Outfit ────────────────────────────────────────────────────────────
// DELETE /api/outfits/:id
const deleteOutfit = async (req, res) => {
  const outfit = await Outfit.findById(req.params.id);

  if (!outfit) {
    return res.status(404).json({
      success: false,
      message: 'Outfit not found',
    });
  }

  // Only the owner can delete the outfit
  if (outfit.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to delete this outfit',
    });
  }

  await Outfit.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Outfit deleted successfully',
  });
};


// ── Like / Unlike Outfit ────────────────────────────────────────────────────
// PUT /api/outfits/:id/like
const toggleLike = async (req, res) => {
  const outfit = await Outfit.findById(req.params.id);

  if (!outfit) {
    return res.status(404).json({
      success: false,
      message: 'Outfit not found',
    });
  }

  const userId = req.user._id.toString();

  const alreadyLiked = outfit.likes.some(
    id => id.toString() === userId
  );

  if (alreadyLiked) {
    outfit.likes = outfit.likes.filter(
      id => id.toString() !== userId
    );
  } else {
    outfit.likes.push(req.user._id);
  }

  await outfit.save();

  res.json({
    success: true,
    liked: !alreadyLiked,
    likes: outfit.likes.length,
  });
};


// ── Save / Unsave Outfit ─────────────────────────────────────────────────────
// PUT /api/outfits/:id/save
const toggleSave = async (req, res) => {
  const outfit = await Outfit.findById(req.params.id);

  if (!outfit) {
    return res.status(404).json({
      success: false,
      message: 'Outfit not found',
    });
  }

  const userId = req.user._id.toString();

  const alreadySaved = outfit.saves.some(
    id => id.toString() === userId
  );

  if (alreadySaved) {
    outfit.saves = outfit.saves.filter(
      id => id.toString() !== userId
    );
  } else {
    outfit.saves.push(req.user._id);
  }

  await outfit.save();

  res.json({
    success: true,
    saved: !alreadySaved,
    saves: outfit.saves.length,
  });
};


module.exports = {
  suggestOutfits,
  suggestByOccasion,
  createOutfit,
  getMyOutfits,
  getCommunityOutfits,
  updateOutfit,
  deleteOutfit,
  toggleLike,
  toggleSave,
};