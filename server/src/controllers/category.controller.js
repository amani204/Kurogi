const Category = require('../models/category');
const MenuItem = require('../models/MenuItem');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ order: 1, 'label.en': 1 });
  res.json(categories);
};

const createCategory = async (req, res) => {
  const { slug, label, order } = req.body;

  const existing = await Category.findOne({ slug });
  if (existing) return res.status(409).json({ message: 'A category with this slug already exists' });

  const category = await Category.create({ slug, label, order });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const { label, order } = req.body;

  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { label, order },
    { new: true, runValidators: true }
  );
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const itemCount = await MenuItem.countDocuments({ category: category.slug });
  if (itemCount > 0) {
    return res.status(409).json({
      message: `Cannot delete: ${itemCount} menu item(s) still use this category. Reassign or delete them first.`,
    });
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };