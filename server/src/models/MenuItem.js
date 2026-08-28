const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
  },
  name: {
    en: { type: String, required: true, trim: true, maxlength: 100 },
    fr: { type: String, required: true, trim: true, maxlength: 100 },
    ar: { type: String, required: true, trim: true, maxlength: 100 },
  },
  description: {
    en: { type: String, trim: true, maxlength: 500, default: '' },
    fr: { type: String, trim: true, maxlength: 500, default: '' },
    ar: { type: String, trim: true, maxlength: 500, default: '' },
  },
  price: { type: Number, required: true, min: 0 }, // single value in DA — not language-dependent
  category: { type: String, required: true, trim: true, lowercase: true }, // references Category.slug
  photoUrl: { type: String, trim: true },
  available: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

menuItemSchema.index({ category: 1 });
menuItemSchema.index({ featured: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);