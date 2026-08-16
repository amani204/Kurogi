const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { createBooking, cancelBooking, getAllBookings, updateBookingStatus } = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth');
const { validate, bookingRules } = require('../middleware/validators');

// public creation is rate-limited to stop spam/DoS on a no-auth endpoint
const publicLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 20 });

router.post('/', publicLimiter, bookingRules, validate, createBooking);
router.patch('/cancel/:token', cancelBooking); // no auth — token itself is the credential

router.get('/', protect, getAllBookings);              // owner + staff can view
router.patch('/:id/status', protect, updateBookingStatus); // owner + staff can manage

module.exports = router;