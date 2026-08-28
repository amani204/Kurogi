const Restaurant = require('../models/Restaurant');

const getSettings = async (req, res) => {
  const restaurant = await Restaurant.findOne();
  if (!restaurant) return res.status(404).json({ message: 'Not configured yet' });
  res.json(restaurant);
};

// explicit whitelist — never spread req.body directly into an update
const updateSettings = async (req, res) => {
  const { name, capacityPerSlot, slotLengthMinutes, hours, contact } = req.body;

  const restaurant = await Restaurant.findOneAndUpdate(
    {},
    { name, capacityPerSlot, slotLengthMinutes, hours, contact },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json(restaurant);
};

module.exports = { getSettings, updateSettings };