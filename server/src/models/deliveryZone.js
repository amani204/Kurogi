const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  wilaya: { type: String, required: true, trim: true, unique: true, maxlength: 100 },
  price: { type: Number, required: true, min: 0 },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);