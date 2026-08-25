/**
 * services/recommendationService.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Rule-based outfit recommendation engine.
 *
 * Design principles:
 *  • Stateless — accepts items as arguments; does NOT query the DB.
 *    The controller is responsible for fetching items before calling this service.
 *  • Pure — same inputs always produce the same outputs.
 *  • Replaceable — the exported functions can be swapped for ML-based versions
 *    without changing routes or controllers.
 * ──────────────────────────────────────────────────────────────────────────────
 */

const { scoreOutfit } = require('../utils/outfitScoring');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Groups a flat array of clothing items by category.
 */
const groupByCategory = (items) => ({
  tops:        items.filter(i => i.category === 'top'),
  bottoms:     items.filter(i => i.category === 'bottom'),
  footwear:    items.filter(i => i.category === 'footwear'),
  accessories: items.filter(i => i.category === 'accessory'),
  fullBody:    items.filter(i => i.category === 'full-body'),
});

/**
 * Generates all possible top+bottom+footwear combinations, scores each,
 * sorts by score and returns the top N.
 *
 * @param {Array}   items    - User's clothing items
 * @param {string}  occasion - Optional target formality
 * @param {number}  topN     - Max results (default 3)
 * @returns {Array}
 */
const buildCombinations = (items, occasion = null, topN = 3) => {
  const { tops, bottoms, footwear, fullBody } = groupByCategory(items);

  const combos = [];

  // ── Standard: top + bottom + footwear ─────────────────────────────────────
  for (const top of tops) {
    for (const bottom of bottoms) {
      const shoes = footwear.length ? footwear : [null];
      for (const shoe of shoes) {
        combos.push({
          top, bottom, footwear: shoe,
          score: scoreOutfit(top, bottom, shoe, occasion),
        });
      }
    }
  }

  // ── Full-body items (dresses, jumpsuits) + footwear ───────────────────────
  for (const item of fullBody) {
    const shoes = footwear.length ? footwear : [null];
    for (const shoe of shoes) {
      combos.push({
        top: item, bottom: null, footwear: shoe,
        score: scoreOutfit(item, null, shoe, occasion),
      });
    }
  }

  if (!combos.length) return [];

  return combos
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(({ top, bottom, footwear: shoe, score }) => ({
      score,
      items: {
        top:      top      || null,
        bottom:   bottom   || null,
        footwear: shoe     || null,
      },
    }));
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * getGeneralSuggestions
 * Returns top 3 outfits with no occasion filter.
 */
const getGeneralSuggestions = (items) => buildCombinations(items, null, 3);

/**
 * getOccasionSuggestions
 * Pre-filters items by formality compatibility then builds combinations.
 *
 * Formality tolerance:
 *   formal       → accepts formal, semi-formal
 *   semi-formal  → accepts all levels (most versatile)
 *   casual       → accepts casual, semi-formal
 */
const getOccasionSuggestions = (items, occasion) => {
  const toleranceMap = {
    formal:       ['formal', 'semi-formal'],
    'semi-formal':['formal', 'semi-formal', 'casual'],
    casual:       ['casual', 'semi-formal'],
  };

  const allowed  = toleranceMap[occasion] || [occasion];
  const filtered = items.filter(i => allowed.includes(i.formalityLevel));

  return buildCombinations(filtered, occasion, 3);
};

module.exports = { getGeneralSuggestions, getOccasionSuggestions };
