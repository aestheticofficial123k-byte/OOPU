/**
 * routes/outfitRoutes.js
 * Outfit suggestions and community outfit endpoints.
 */

const express = require('express');

const {
  suggestOutfits,
  suggestByOccasion,
  createOutfit,
  getMyOutfits,
  getCommunityOutfits,
  toggleLike,
  toggleSave,
  updateOutfit,
  deleteOutfit,
} = require('../controllers/outfitController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);


// ── Outfit Suggestions ──────────────────────────────────────────────────────

router.get(
  '/suggest',
  suggestOutfits
);

router.get(
  '/suggest/:occasion',
  suggestByOccasion
);


// ── My Outfits ───────────────────────────────────────────────────────────────

router.post(
  '/',
  createOutfit
);

router.get(
  '/mine',
  getMyOutfits
);


// ── Edit / Delete Outfit ─────────────────────────────────────────────────────

router.put(
  '/:id',
  updateOutfit
);

router.delete(
  '/:id',
  deleteOutfit
);


// ── Community ────────────────────────────────────────────────────────────────

router.get(
  '/community',
  getCommunityOutfits
);

router.put(
  '/:id/like',
  toggleLike
);

router.put(
  '/:id/save',
  toggleSave
);


module.exports = router;