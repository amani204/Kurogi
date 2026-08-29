const MenuItem = require('../models/MenuItem');
const Category = require('../models/category');

const getMenu = async (req, res) => {
  const { category, featured } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (featured === 'true') filter.featured = true;

  const items = await MenuItem.find(filter).sort({ category: 1, 'name.en': 1 });
  res.json(items);
};

const createMenuItem = async (req, res) => {
  const { slug, name, description, price, category, photoUrl, available, featured } = req.body;

  const categoryExists = await Category.findOne({ slug: category });
  if (!categoryExists) return res.status(400).json({ message: `Unknown category: ${category}` });

  const existingSlug = await MenuItem.findOne({ slug });
  if (existingSlug) return res.status(409).json({ message: 'A menu item with this slug already exists' });

  const item = await MenuItem.create({ slug, name, description, price, category, photoUrl, available, featured });
  res.status(201).json(item);
};

// slug is intentionally not editable — same reasoning as Category: the frontend
// image map and cart reference items by slug, renaming would orphan those links
const updateMenuItem = async (req, res) => {
  const { name, description, price, category, photoUrl, available, featured } = req.body;

  if (category) {
    const categoryExists = await Category.findOne({ slug: category });
    if (!categoryExists) return res.status(400).json({ message: `Unknown category: ${category}` });
  }

  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { name, description, price, category, photoUrl, available, featured },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

const toggleAvailability = async (req, res) => {
  const item = await MenuItem.findOneAndUpdate(
    { _id: req.params.id },
    [{ $set: { available: { $not: '$available' } } }],
    { new: true, updatePipeline: true }
  );
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

const toggleFeatured = async (req, res) => {
  const item = await MenuItem.findOneAndUpdate(
    { _id: req.params.id },
    [{ $set: { featured: { $not: '$featured' } } }],
    { new: true, updatePipeline: true }
  );
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

const deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Item deleted' });
};

module.exports = { getMenu, createMenuItem, updateMenuItem, toggleAvailability, toggleFeatured, deleteMenuItem };