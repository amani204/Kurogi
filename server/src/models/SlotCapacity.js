const mongoose = require('mongoose');

const slotCapacitySchema = new mongoose.Schema({
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  bookedCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

slotCapacitySchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('SlotCapacity', slotCapacitySchema);