const express = require('express');
const router = express.Router();
const {
  getMenu, createMenuItem, updateMenuItem, toggleAvailability, toggleFeatured, deleteMenuItem,
} = require('../controllers/menu.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, menuItemCreateRules, menuItemUpdateRules } = require('../middleware/validators');

router.get('/', getMenu);

router.post('/', protect, authorize('owner'), menuItemCreateRules, validate, createMenuItem);
router.put('/:id', protect, authorize('owner'), menuItemUpdateRules, validate, updateMenuItem);
router.patch('/:id/availability', protect, authorize('owner'), toggleAvailability);
router.patch('/:id/featured', protect, authorize('owner'), toggleFeatured);
router.delete('/:id', protect, authorize('owner'), deleteMenuItem);

module.exports = router;