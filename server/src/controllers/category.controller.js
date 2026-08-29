const Category = require('../models/category');
const MenuItem = require('../models/MenuItem');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ order: 1, 'label.en': 1 });
  res.json(categories);
};

// shifts every category at or after `order` up by one, making room for an insert
const makeRoomAtOrder = async (order, excludeId = null) => {
  const filter = { order: { $gte: order } };
  if (excludeId) filter._id = { $ne: excludeId };
  await Category.updateMany(filter, { $inc: { order: 1 } });
};

const createCategory = async (req, res) => {
  const { slug, label, order } = req.body;

  const existing = await Category.findOne({ slug });
  if (existing) return res.status(409).json({ message: 'A category with this slug already exists' });

  const desiredOrder = order ?? 0;
  const orderTaken = await Category.findOne({ order: desiredOrder });
  if (orderTaken) {
    await makeRoomAtOrder(desiredOrder);
  }

  const category = await Category.create({ slug, label, order: desiredOrder });
  res.status(201).json(category);
};

const updateCategory = async (req, res) => {
  const { label, order } = req.body;

  const current = await Category.findById(req.params.id);
  if (!current) return res.status(404).json({ message: 'Category not found' });

  if (order !== undefined && order !== current.order) {
    const orderTaken = await Category.findOne({ order, _id: { $ne: current._id } });
    if (orderTaken) {
      await makeRoomAtOrder(order, current._id);
    }
  }

  const category = await Category.findByIdAndUpdate(
    req.params.id, { label, order }, { new: true, runValidators: true }
  );
  res.json(category);
};

// step 1: DELETE with no body -> if items exist, returns 409 with the count
// instead of deleting, so the frontend can ask the user what to do next.
// step 2: DELETE again with { action: 'delete-items' } or { action: 'reassign', reassignTo }
const deleteCategory = async (req, res) => {
  const { action, reassignTo } = req.body || {};

  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });

  const itemCount = await MenuItem.countDocuments({ category: category.slug });

  if (itemCount > 0) {
    if (action === 'delete-items') {
      await MenuItem.deleteMany({ category: category.slug });
    } else if (action === 'reassign') {
      if (!reassignTo) return res.status(400).json({ message: 'reassignTo is required' });
      if (reassignTo === category.slug) {
        return res.status(400).json({ message: 'Cannot reassign to the category being deleted' });
      }
      const target = await Category.findOne({ slug: reassignTo });
      if (!target) return res.status(400).json({ message: 'Target category does not exist' });

      await MenuItem.updateMany({ category: category.slug }, { category: reassignTo });
    } else {
      // no action given yet — tell the frontend there's a decision to make
      return res.status(409).json({
        message: `This category has ${itemCount} menu item(s).`,
        itemCount,
      });
    }
  }

  await category.deleteOne();
  res.json({ message: 'Category deleted' });
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };