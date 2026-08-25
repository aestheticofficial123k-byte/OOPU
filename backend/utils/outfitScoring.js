/**
 * utils/outfitScoring.js
 * ──────────────────────────────────────────────────────────────────────────────
 * Pure-function scoring utilities for the outfit recommendation engine.
 * Deliberately kept separate from the service layer so scoring rules can be
 * unit-tested, tuned, or replaced (e.g. with an ML model) independently.
 * ──────────────────────────────────────────────────────────────────────────────
 */

// ─── Color compatibility map ──────────────────────────────────────────────────
// Each key lists colors it pairs well with.
// 'any' = works with everything (neutrals like white, black, grey, navy, beige).
const COLOR_COMPAT = {
  white:  ['black','navy','grey','blue','red','green','brown','beige','pink','any'],
  black:  ['white','grey','red','yellow','blue','green','beige','any'],
  navy:   ['white','grey','beige','light-blue','yellow','any'],
  grey:   ['white','black','navy','blue','pink','any'],
  beige:  ['white','navy','brown','olive','camel','any'],
  brown:  ['beige','white','olive','cream','camel','any'],
  blue:   ['white','grey','navy','black','any'],
  red:    ['white','black','grey','navy','any'],
  green:  ['white','beige','brown','khaki','any'],
  olive:  ['white','beige','brown','camel','any'],
  yellow: ['white','black','navy','grey','any'],
  pink:   ['white','grey','navy','beige','any'],
  purple: ['white','grey','black','beige','any'],
  orange: ['white','navy','black','brown','any'],
  camel:  ['white','black','brown','olive','any'],
  cream:  ['brown','navy','black','olive','any'],
};

/**
 * areColorsCompatible
 * Returns true if color1 and color2 are a good pairing.
 */
const areColorsCompatible = (color1, color2) => {
  if (!color1 || !color2) return true; // missing data → neutral score
  const c1 = color1.toLowerCase().trim();
  const c2 = color2.toLowerCase().trim();
  if (c1 === c2) return true;           // monochromatic always works
  const compat = COLOR_COMPAT[c1] || [];
  return compat.includes(c2) || compat.includes('any');
};

/**
 * doPatternsClash
 * Returns true when two non-plain patterned items are combined (usually bad).
 */
const doPatternsClash = (p1, p2) =>
  p1 !== 'plain' && p2 !== 'plain';

/**
 * scoreOutfit
 * ──────────────────────────────────────────────────────────────────────────────
 * Produces a numeric score for a top + bottom + footwear combination.
 *
 * Scoring breakdown:
 *   +1 per present item (completeness)
 *   +1 complete set bonus (all three present)
 *   +2 same formality across all items
 *   +1 per item matching the target occasion
 *   +1 season consistency
 *   +2 top ↔ bottom color compat
 *   +1 top ↔ footwear color compat
 *   +1 bottom ↔ footwear color compat
 *   +1 no pattern clash top/bottom
 *   +2 blazer bonus (formal occasion)
 *   +2 formal-shoes bonus (formal occasion)
 *   +1 neutral top color bonus (formal occasion)
 *
 * @param {Object}  top       ClothingItem document (or null)
 * @param {Object}  bottom    ClothingItem document (or null)
 * @param {Object}  footwear  ClothingItem document (or null)
 * @param {string}  occasion  Target formality: 'casual' | 'semi-formal' | 'formal' | null
 * @returns {number}
 */
const scoreOutfit = (top, bottom, footwear, occasion = null) => {
  const items = [top, bottom, footwear].filter(Boolean);
  if (items.length === 0) return 0;

  let score = 0;

  // Completeness
  score += items.length;
  if (top && (bottom || top?.category === 'full-body') && footwear) score += 1;

  // Formality consistency
  const fLevels = [...new Set(items.map(i => i.formalityLevel))];
  if (fLevels.length === 1) score += 2;
  else if (fLevels.length === 2) score += 1;

  // Occasion match
  if (occasion) {
    items.forEach(i => { if (i.formalityLevel === occasion) score += 1; });
  }

  // Season consistency (all-season items contribute neutrally)
  const seasons = [...new Set(items.filter(i => i.season !== 'all-season').map(i => i.season))];
  if (seasons.length <= 1) score += 1;

  // Color compatibility
  if (top && bottom   && areColorsCompatible(top.color,    bottom.color))   score += 2;
  if (top && footwear && areColorsCompatible(top.color,    footwear.color)) score += 1;
  if (bottom && footwear && areColorsCompatible(bottom.color, footwear.color)) score += 1;

  // Pattern clash
  if (top && bottom && !doPatternsClash(top.pattern, bottom.pattern)) score += 1;

  // Formal occasion bonuses
  if (occasion === 'formal') {
    if (top?.type === 'blazer')         score += 2;
    if (footwear?.type === 'formal-shoes') score += 2;
    const neutrals = ['white','black','grey','navy','beige','cream','camel'];
    if (top && neutrals.includes(top.color?.toLowerCase())) score += 1;
  }

  return score;
};

module.exports = { scoreOutfit, areColorsCompatible, doPatternsClash };
