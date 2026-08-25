/**
 * routes/plannerRoutes.js
 * Calendar outfit planner endpoints.
 */
const express = require('express');
const {
  createPlan, getWeekPlan, markAsWorn, updatePlan, deletePlan,
} = require('../controllers/plannerController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/',        createPlan);
router.get('/week',     getWeekPlan);
router.put('/:id/worn', markAsWorn);
router.route('/:id').put(updatePlan).delete(deletePlan);

module.exports = router;
