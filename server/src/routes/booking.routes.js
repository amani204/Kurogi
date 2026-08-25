const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const {
  getAvailability,
  createBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/booking.controller');

const { protect } = require('../middleware/auth');
const { validate, bookingRules } = require('../middleware/validators');

// Public endpoint limiters
const publicLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
});

const availabilityLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
});

const cancelLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
});

// Public routes
router.get('/availability', availabilityLimiter, getAvailability);

router.post(
  '/',
  publicLimiter,
  bookingRules,
  validate,
  createBooking
);

router.patch(
  '/cancel/:token',
  cancelLimiter,
  cancelBooking
);

// Protected admin routes
router.get('/', protect, getAllBookings);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;