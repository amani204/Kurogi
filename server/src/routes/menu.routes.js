const express = require('express');
const router = express.Router();
const {
  getMenu, createMenuItem, updateMenuItem, toggleAvailability, deleteMenuItem,
} = require('../controllers/menu.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, menuItemRules } = require('../middleware/validators');

router.get('/', getMenu); // public

router.post('/', protect, authorize('owner'), menuItemRules, validate, createMenuItem);
router.put('/:id', protect, authorize('owner'), menuItemRules, validate, updateMenuItem);
router.patch('/:id/availability', protect, authorize('owner'), toggleAvailability);
router.delete('/:id', protect, authorize('owner'), deleteMenuItem);

module.exports = router;