const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  getAvailability, createBooking, cancelBooking, getAllBookings, updateBookingStatus,
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth');
const { validate, bookingRules } = require('../middleware/validators');

const publicLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

router.get('/availability', getAvailability); // public

router.post('/', publicLimiter, bookingRules, validate, createBooking);
router.patch('/cancel/:token', cancelBooking);

router.get('/', protect, getAllBookings);
router.patch('/:id/status', protect, updateBookingStatus);

module.exports = router;