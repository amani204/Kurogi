const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const SlotCapacity = require('../models/SlotCapacity');
const { buildWhatsAppLink } = require('../utils/whatsapp');

const DAY_MAP = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']; // matches Date.getUTCDay() index

// public — powers the time-slot picker on the booking form
const getAvailability = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: 'date is required (YYYY-MM-DD)' });

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return res.status(400).json({ message: 'Invalid date' });

  const restaurant = await Restaurant.findOne();
  if (!restaurant) return res.status(500).json({ message: 'Restaurant not configured yet' });

  const dayKey = DAY_MAP[parsedDate.getUTCDay()];
  const hoursEntry = restaurant.hours.find((h) => h.day === dayKey);

  if (!hoursEntry || !hoursEntry.open || !hoursEntry.close) {
    return res.json({ slots: [] }); // closed that day
  }

  const slotLength = restaurant.slotLengthMinutes || 90;
  const [openH, openM] = hoursEntry.open.split(':').map(Number);
  const [closeH, closeM] = hoursEntry.close.split(':').map(Number);

  let cursor = openH * 60 + openM;
  let closeMinutes = closeH * 60 + closeM;
  if (closeMinutes <= cursor) closeMinutes += 24 * 60;
  const slotTimes = [];

  while (cursor < closeMinutes) {
    const h = String(Math.floor(cursor / 60) % 24).padStart(2, '0');
    const m = String(cursor % 60).padStart(2, '0');
    slotTimes.push(`${h}:${m}`);
    cursor += slotLength;
  }
  const capacityDocs = await SlotCapacity.find({ date: parsedDate, timeSlot: { $in: slotTimes } });
  const bookedMap = {};
  capacityDocs.forEach((doc) => { bookedMap[doc.timeSlot] = doc.bookedCount; });

  const slots = slotTimes.map((timeSlot) => {
    const booked = bookedMap[timeSlot] || 0;
    const remaining = Math.max(restaurant.capacityPerSlot - booked, 0);
    return { timeSlot, remaining, full: remaining <= 0 };
  });

  res.json({ slots });
};

const createBooking = async (req, res) => {
  const { customerName, phone, email, partySize, date, timeSlot, specialRequests } = req.body;

  const restaurant = await Restaurant.findOne();
  if (!restaurant) return res.status(500).json({ message: 'Restaurant not configured yet' });

  await SlotCapacity.updateOne(
    { date, timeSlot },
    { $setOnInsert: { date, timeSlot, bookedCount: 0 } },
    { upsert: true }
  );

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
    await SlotCapacity.updateOne({ date, timeSlot }, { $inc: { bookedCount: -partySize } });
    throw err;
  }

  const message = `New booking from ${customerName} (${phone}): party of ${partySize} on ${date} at ${timeSlot}.`;
  const whatsappLink = restaurant.contact?.whatsapp
    ? buildWhatsAppLink(restaurant.contact.whatsapp, message)
    : null;

  res.status(201).json({ booking, whatsappLink });
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findOne({ cancelToken: req.params.token });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  if (!['pending', 'confirmed'].includes(booking.status)) {
    return res.status(409).json({ message: 'This booking can no longer be cancelled' });
  }

  booking.status = 'cancelled';
  await booking.save();

  await SlotCapacity.updateOne(
    { date: booking.date, timeSlot: booking.timeSlot },
    { $inc: { bookedCount: -booking.partySize } }
  );

  res.json({ message: 'Booking cancelled' });
};

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

module.exports = { getAvailability, createBooking, cancelBooking, getAllBookings, updateBookingStatus };