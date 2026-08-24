const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, trim: true, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  photoUrl: { type: String, trim: true },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }, 
}, { timestamps: true });

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ featured: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);