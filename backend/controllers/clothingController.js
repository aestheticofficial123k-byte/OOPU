/**
 * controllers/clothingController.js
 * Full CRUD for ClothingItem with optional Cloudinary image upload.
 */
const ClothingItem     = require('../models/ClothingItem');
const { cloudinary }   = require('../config/cloudinary');

// ── Create ────────────────────────────────────────────────────────────────────
// POST /api/clothes
const addClothingItem = async (req, res) => {
  const {
    type, category, color, pattern,
    formalityLevel, season, name, brand, notes,
  } = req.body;

  const data = {
    userId: req.user._id,
    type, category, color, pattern,
    formalityLevel, season, name, brand, notes,
  };

  // If multer-cloudinary processed an uploaded file, req.file is populated
  if (req.file) {
    data.imageUrl           = req.file.path;     // Cloudinary secure URL
    data.cloudinaryPublicId = req.file.filename; // e.g. oopu-app/clothing/abc123
  }

  const item = await ClothingItem.create(data);
  res.status(201).json({ success: true, data: item });
};

// ── Read all (with optional filters) ─────────────────────────────────────────
// GET /api/clothes?category=top&season=summer&formalityLevel=casual
const getClothingItems = async (req, res) => {
  const { category, season, formalityLevel, type } = req.query;

  const filter = { userId: req.user._id };
  if (category)       filter.category       = category;
  if (season)         filter.season         = season;
  if (formalityLevel) filter.formalityLevel = formalityLevel;
  if (type)           filter.type           = type;

  const items = await ClothingItem.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: items.length, data: items });
};

// ── Read one ──────────────────────────────────────────────────────────────────
// GET /api/clothes/:id
const getClothingItem = async (req, res) => {
  const item = await ClothingItem.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: item });
};

// ── Update ────────────────────────────────────────────────────────────────────
// PUT /api/clothes/:id
const updateClothingItem = async (req, res) => {
  const item = await ClothingItem.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, data: item });
};

// ── Delete ────────────────────────────────────────────────────────────────────
// DELETE /api/clothes/:id
const deleteClothingItem = async (req, res) => {
  const item = await ClothingItem.findOne({ _id: req.params.id, userId: req.user._id });
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

  // Remove image from Cloudinary storage
  if (item.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(item.cloudinaryPublicId);
  }

  await item.deleteOne();
  res.json({ success: true, message: 'Clothing item deleted successfully' });
};

module.exports = {
  addClothingItem, getClothingItems, getClothingItem,
  updateClothingItem, deleteClothingItem,
};
