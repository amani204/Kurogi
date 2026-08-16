const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const { buildWhatsAppLink } = require('../utils/whatsapp');

const createBooking = async (req, res) => {
  const { customerName, phone, email, partySize, date, timeSlot, specialRequests } = req.body;

  const restaurant = await Restaurant.findOne();
  if (!restaurant) return res.status(500).json({ message: 'Restaurant not configured yet' });

  // sum party sizes already booked for this exact date+slot (ignore cancelled ones)
  const existing = await Booking.aggregate([
    {
      $match: {
        date: new Date(date),
        timeSlot,
        status: { $in: ['pending', 'confirmed'] },
      },
    },
    { $group: { _id: null, total: { $sum: '$partySize' } } },
  ]);

  const alreadyBooked = existing[0]?.total || 0;

  if (alreadyBooked + partySize > restaurant.capacityPerSlot) {
    return res.status(409).json({
      message: 'This time slot is fully booked. Please choose another time.',
      remainingCapacity: Math.max(restaurant.capacityPerSlot - alreadyBooked, 0),
    });
  }

  const booking = await Booking.create({
    customerName, phone, email, partySize, date, timeSlot, specialRequests,
  });

  const message = `Hi! Booking confirmed for ${customerName}, party of ${partySize}, on ${date} at ${timeSlot}. Manage/cancel: ${process.env.CLIENT_URL}/cancel/${booking.cancelToken}`;
  const whatsappLink = buildWhatsAppLink(restaurant.contact.whatsapp, message);

  res.status(201).json({ booking, whatsappLink });
};

// public — customer cancels via the token link, no login needed
const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ cancelToken: req.params.token });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

  booking.status = 'cancelled';
  await booking.save();
  res.json({ message: 'Booking cancelled' });
};

// admin — protected route
const getAllBookings = async (req, res) => {
  const { date, status } = req.query;
  const filter = {};
  if (date) filter.date = new Date(date);
  if (status) filter.status = status;

  const bookings = await Booking.find(filter).sort({ date: 1, timeSlot: 1 });
  res.json(bookings);
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  res.json(booking);
};

module.exports = { createBooking, cancelBooking, getAllBookings, updateBookingStatus };