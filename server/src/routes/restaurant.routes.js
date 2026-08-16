const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', protect, authorize('owner'), updateSettings);

module.exports = router;