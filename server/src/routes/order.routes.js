const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createOrder, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');
const { validate, orderRules } = require('../middleware/validators');

const publicLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

router.post('/', publicLimiter, orderRules, validate, createOrder);
router.patch('/cancel/:token', cancelOrder);
router.get('/', protect, authorize('owner', 'staff'), getAllOrders);
router.patch('/:id/status', protect, authorize('owner', 'staff'), updateOrderStatus);

module.exports = router;