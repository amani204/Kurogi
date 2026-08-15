const mongoose = require('mongoose');
const crypto = require('crypto');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9+\s-]{8,15}$/, 'Invalid phone number'],
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
  },
  partySize: { type: Number, required: true, min: 1, max: 30 },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending',
  },
  specialRequests: { type: String, trim: true, maxlength: 300 },
  cancelToken: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
  },
}, { timestamps: true });

bookingSchema.index({ date: 1, timeSlot: 1 });

module.exports = mongoose.model('Booking', bookingSchema);