const DeliveryZone = require('../models/deliveryZone');

const getDeliveryZones = async (req, res) => {
  const zones = await DeliveryZone.find().sort({ wilaya: 1 });
  res.json(zones);
};

const createDeliveryZone = async (req, res) => {
  const { wilaya, price } = req.body;

  const existing = await DeliveryZone.findOne({ wilaya });
  if (existing) return res.status(409).json({ message: 'This wilaya already has a delivery price set' });

  const zone = await DeliveryZone.create({ wilaya, price });
  res.status(201).json(zone);
};

// wilaya name isn't editable here — same reasoning as Category slugs: orders
// already reference it by value, renaming would orphan the historical snapshot
const updateDeliveryZone = async (req, res) => {
  const { price } = req.body;
  const zone = await DeliveryZone.findByIdAndUpdate(req.params.id, { price }, { new: true, runValidators: true });
  if (!zone) return res.status(404).json({ message: 'Delivery zone not found' });
  res.json(zone);
};

const deleteDeliveryZone = async (req, res) => {
  const zone = await DeliveryZone.findByIdAndDelete(req.params.id);
  if (!zone) return res.status(404).json({ message: 'Delivery zone not found' });
  res.json({ message: 'Delivery zone deleted' });
};

module.exports = { getDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone };