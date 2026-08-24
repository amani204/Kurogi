require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const MenuItem = require('../models/MenuItem');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const catResult = await Category.deleteMany({});
  const itemResult = await MenuItem.deleteMany({});

  console.log(`Deleted ${catResult.deletedCount} categories`);
  console.log(`Deleted ${itemResult.deletedCount} menu items`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Wipe failed:', err);
  process.exit(1);
});