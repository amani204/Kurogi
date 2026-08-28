const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'],
  },
  label: {
    en: { type: String, required: true, trim: true, maxlength: 50 },
    fr: { type: String, required: true, trim: true, maxlength: 50 },
    ar: { type: String, required: true, trim: true, maxlength: 50 },
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);