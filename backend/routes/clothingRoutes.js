/**
 * routes/clothingRoutes.js
 * CRUD routes for clothing items.
 * All routes protected by JWT auth middleware.
 */
const express  = require('express');
const { body } = require('express-validator');
const {
  addClothingItem, getClothingItems, getClothingItem,
  updateClothingItem, deleteClothingItem,
} = require('../controllers/clothingController');
const { protect } = require('../middleware/auth');
const { upload }  = require('../config/cloudinary');
const validate    = require('../middleware/validate');

const router = express.Router();
router.use(protect); // All clothing routes require auth

const clothingRules = [
  body('type').notEmpty().withMessage('Type is required'),
  body('category')
    .isIn(['top','bottom','footwear','accessory','full-body'])
    .withMessage('Invalid category'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('formalityLevel')
    .isIn(['casual','semi-formal','formal'])
    .withMessage('Invalid formality level'),
  body('season')
    .isIn(['summer','winter','spring','autumn','all-season'])
    .withMessage('Invalid season'),
];

router.route('/')
  .get(getClothingItems)
  .post(upload.single('image'), clothingRules, validate, addClothingItem);

router.route('/:id')
  .get(getClothingItem)
  .put(updateClothingItem)
  .delete(deleteClothingItem);

module.exports = router;
