/**
 * routes/outfitRoutes.js
 * Outfit suggestion endpoints.
 */
const express = require('express');
const { suggestOutfits, suggestByOccasion } = require('../controllers/outfitController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/suggest',           suggestOutfits);
router.get('/suggest/:occasion', suggestByOccasion);

module.exports = router;
