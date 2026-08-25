const mongoose = require('mongoose');
const crypto = require('crypto');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  name: { type: String, required: true },   // snapshot — survives menu edits later
  price: { type: Number, required: true },  // snapshot — never trust client-sent price
  quantity: { type: Number, required: true, min: 1, max: 50 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true, trim: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, match: [/^[0-9+\s-]{8,15}$/, 'Invalid phone number'] },
  email: { type: String, trim: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
  fulfillment: { type: String, enum: ['delivery', 'pickup'], required: true },
  address: {
    type: String,
    trim: true,
    maxlength: 300,
    required: function () { return this.fulfillment === 'delivery'; },
  },
  // snapshot of the zone at order time — same reasoning as item price snapshots:
  // survives the admin later changing/deleting that zone's price
  deliveryZone: {
    wilaya: { type: String, trim: true },
    price: { type: Number, min: 0 },
  },
  items: {
    type: [orderItemSchema],
    validate: [arr => arr.length > 0, 'Order must contain at least one item'],
  },
  totalPrice: { type: Number, required: true, min: 0 }, // itemsTotal + delivery fee, computed server-side only
  notes: { type: String, trim: true, maxlength: 300 },
  paymentMethod: { type: String, enum: ['cod'], default: 'cod' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  cancelToken: { type: String, default: () => crypto.randomUUID(), unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);