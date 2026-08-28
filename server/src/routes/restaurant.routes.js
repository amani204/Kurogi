const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/restaurant.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, restaurantSettingsRules } = require('../middleware/validators');

router.get('/', getSettings);
router.put('/', protect, authorize('owner'), restaurantSettingsRules, validate, updateSettings);

module.exports = router;