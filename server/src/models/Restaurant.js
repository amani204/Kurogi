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
    phone: String,
    whatsapp: String,
    address: String,
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
