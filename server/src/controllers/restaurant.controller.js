const Restaurant = require('../models/Restaurant');

// public — needed for homepage hours/contact/map
const getSettings = async (req, res) => {
  const restaurant = await Restaurant.findOne();
  if (!restaurant) return res.status(404).json({ message: 'Not configured yet' });
  res.json(restaurant);
};

// owner only
const updateSettings = async (req, res) => {
  const restaurant = await Restaurant.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true, // creates it if it doesn't exist yet — convenient for first-time setup
    runValidators: true,
  });
  res.json(restaurant);
};

module.exports = { getSettings, updateSettings };