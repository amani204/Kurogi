const MenuItem = require('../models/MenuItem');

// public — anyone browsing the site
const getMenu = async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
  res.json(items);
};

const createMenuItem = async (req, res) => {
  const { name, description, price, category, photoUrl, available } = req.body;
  const item = await MenuItem.create({ name, description, price, category, photoUrl, available });
  res.status(201).json(item);
};

const updateMenuItem = async (req, res) => {
  const { name, description, price, category, photoUrl, available } = req.body;
  const item = await MenuItem.findByIdAndUpdate(
    req.params.id,
    { name, description, price, category, photoUrl, available },
    { new: true, runValidators: true }
  );
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

const toggleAvailability = async (req, res) => {
  const item = await MenuItem.findOneAndUpdate(
    { _id: req.params.id },
    [{ $set: { available: { $not: '$available' } } }], 
    { new: true }
  );
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
};

const deleteMenuItem = async (req, res) => {
  const item = await MenuItem.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Item deleted' });
};

module.exports = { getMenu, createMenuItem, updateMenuItem, toggleAvailability, deleteMenuItem };