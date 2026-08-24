const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const SlotCapacity = require('../models/SlotCapacity');
const { buildWhatsAppLink } = require('../utils/whatsapp');

const createBooking = async (req, res) => {
  const { customerName, phone, email, partySize, date, timeSlot, specialRequests } = req.body;

  const restaurant = await Restaurant.findOne();
  if (!restaurant) return res.status(500).json({ message: 'Restaurant not configured yet' });

  // ensure the slot doc exists first (idempotent, no capacity check yet)
  await SlotCapacity.updateOne(
    { date, timeSlot },
    { $setOnInsert: { date, timeSlot, bookedCount: 0 } },
    { upsert: true }
  );

  // atomically reserve capacity — the check and the increment are ONE operation,
  // so two concurrent requests can never both pass this check for the last spot
  const reserved = await SlotCapacity.findOneAndUpdate(
    { date, timeSlot, bookedCount: { $lte: restaurant.capacityPerSlot - partySize } },
    { $inc: { bookedCount: partySize } },
    { new: true }
  );

  if (!reserved) {
    return res.status(409).json({ message: 'This time slot is fully booked. Please choose another time.' });
  }

  let booking;
  try {
    booking = await Booking.create({ customerName, phone, email, partySize, date, timeSlot, specialRequests });
  } catch (err) {
    // roll back the reservation if the booking write somehow fails
    await SlotCapacity.updateOne({ date, timeSlot }, { $inc: { bookedCount: -partySize } });
    throw err;
  }

  const message = `Hi! Booking confirmed for ${customerName}, party of ${partySize}, on ${date} at ${timeSlot}. Manage/cancel: ${process.env.CLIENT_URL}/cancel/${booking.cancelToken}`;
  const whatsappLink = buildWhatsAppLink(restaurant.contact.whatsapp, message);

  res.status(201).json({ booking, whatsappLink });
};

// public — customer cancels via the token link, no login needed
const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ cancelToken: req.params.token });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (!['pending', 'confirmed'].includes(booking.status)) {
    return res.status(400).json({ message: 'This booking can no longer be cancelled' });
  }

  booking.status = 'cancelled';
  await booking.save();

  // free the capacity this booking had reserved
  await SlotCapacity.updateOne(
    { date: booking.date, timeSlot: booking.timeSlot },
    { $inc: { bookedCount: -booking.partySize } }
  );

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

  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const wasActive = ['pending', 'confirmed'].includes(booking.status);
  booking.status = status;
  await booking.save();

  if (status === 'cancelled' && wasActive) {
    await SlotCapacity.updateOne(
      { date: booking.date, timeSlot: booking.timeSlot },
      { $inc: { bookedCount: -booking.partySize } }
    );
  }

  res.json(booking);
};

module.exports = { createBooking, cancelBooking, getAllBookings, updateBookingStatus };