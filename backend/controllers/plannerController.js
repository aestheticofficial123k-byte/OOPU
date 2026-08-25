/**
 * controllers/plannerController.js
 * Calendar outfit planning — create, view, mark as worn.
 */
const PlannedOutfit = require('../models/PlannedOutfit');
const ClothingItem  = require('../models/ClothingItem');

// POST /api/planner
const createPlan = async (req, res) => {
  const { date, topId, bottomId, footwearId, accessories, occasion, notes } = req.body;

  // Upsert pattern: one plan per (userId, date)
  const plan = await PlannedOutfit.findOneAndUpdate(
    { userId: req.user._id, date: new Date(date) },
    {
      topId, bottomId, footwearId,
      accessories: accessories || [],
      occasion, notes,
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  ).populate('topId bottomId footwearId accessories');

  res.status(201).json({ success: true, data: plan });
};

// GET /api/planner/week?startDate=YYYY-MM-DD
const getWeekPlan = async (req, res) => {
  const { startDate } = req.query;
  const start = startDate ? new Date(startDate) : new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const plans = await PlannedOutfit.find({
    userId: req.user._id,
    date:   { $gte: start, $lt: end },
  })
    .populate('topId bottomId footwearId accessories')
    .sort({ date: 1 });

  res.json({ success: true, data: plans });
};

// PUT /api/planner/:id/worn  — mark outfit as worn, increment wearCount
const markAsWorn = async (req, res) => {
  const plan = await PlannedOutfit.findOne({ _id: req.params.id, userId: req.user._id });

  if (!plan)       return res.status(404).json({ success: false, message: 'Plan not found' });
  if (plan.worn)   return res.status(400).json({ success: false, message: 'Already marked as worn' });

  plan.worn   = true;
  plan.wornAt = new Date();
  await plan.save();

  // Collect all item IDs in this outfit
  const itemIds = [plan.topId, plan.bottomId, plan.footwearId, ...(plan.accessories || [])]
    .filter(Boolean);

  // Bulk update wear stats
  await ClothingItem.updateMany(
    { _id: { $in: itemIds } },
    { $inc: { wearCount: 1 }, $set: { lastWornDate: plan.wornAt } }
  );

  res.json({ success: true, message: 'Outfit marked as worn. Wear counts updated.', data: plan });
};

// PUT /api/planner/:id
const updatePlan = async (req, res) => {
  const plan = await PlannedOutfit.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  ).populate('topId bottomId footwearId accessories');

  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  res.json({ success: true, data: plan });
};

// DELETE /api/planner/:id
const deletePlan = async (req, res) => {
  const plan = await PlannedOutfit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
  res.json({ success: true, message: 'Plan deleted' });
};

module.exports = { createPlan, getWeekPlan, markAsWorn, updatePlan, deletePlan };
