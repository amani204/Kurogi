const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  hours: [{
    day: { type: String, enum: ['mon','tue','wed','thu','fri','sat','sun'] },
    open: String,
    close: String,
  }],
  capacityPerSlot: { type: Number, required: true, min: 1 },
  slotLengthMinutes: { type: Number, default: 90 },
  contact: {
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    address: { type: String, trim: true },
    lat: Number,
    lng: Number,
    facebook: { type: String, trim: true },
    instagram: { type: String, trim: true },
  },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);