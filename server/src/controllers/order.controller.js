const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const DeliveryZone = require('../models/deliveryZone');
const { buildWhatsAppLink } = require('../utils/whatsapp');

const createOrder = async (req, res) => {
  const { customerName, phone, email, fulfillment, address, deliveryZoneId, items, notes } = req.body;

  const restaurant = await Restaurant.findOne();
  if (!restaurant || !restaurant.contact?.whatsapp) {
    return res.status(500).json({ message: 'Restaurant not configured yet' });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // --- resolve items from the DB, ignore client-sent names/prices entirely ---
  const menuItemIds = items.map(i => i.menuItemId);
  const dbItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  const resolvedItems = [];
  let itemsTotal = 0;

  for (const cartItem of items) {
    const dbItem = dbItems.find(d => d._id.toString() === cartItem.menuItemId);
    if (!dbItem) return res.status(400).json({ message: `Item not found: ${cartItem.menuItemId}` });
    if (!dbItem.available) return res.status(409).json({ message: `${dbItem.name} is sold out` });

    const quantity = Math.max(1, Math.min(50, parseInt(cartItem.quantity, 10) || 1));
    resolvedItems.push({ menuItem: dbItem._id, name: dbItem.name, price: dbItem.price, quantity });
    itemsTotal += dbItem.price * quantity;
  }

  // --- resolve delivery fee from the DB, ignore any client-sent price ---
  let deliveryZoneSnapshot;
  let deliveryFee = 0;

  if (fulfillment === 'delivery') {
    const zone = await DeliveryZone.findById(deliveryZoneId);
    if (!zone) return res.status(400).json({ message: 'Invalid delivery zone' });
    deliveryZoneSnapshot = { wilaya: zone.wilaya, price: zone.price };
    deliveryFee = zone.price;
  }

  const totalPrice = itemsTotal + deliveryFee; // the ONLY place totalPrice is computed

  const order = await Order.create({
    customerName, phone, email, fulfillment, address, notes,
    deliveryZone: deliveryZoneSnapshot,
    items: resolvedItems,
    totalPrice,
  });

    const itemsList = resolvedItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
  const deliveryLine = fulfillment === 'delivery'
    ? `Deliver to: ${address} (${deliveryZoneSnapshot.wilaya}, +${deliveryFee} DA delivery)`
    : 'Pickup';
  const orderRef = order._id.toString().slice(-6).toUpperCase();
  const message = `New order from ${customerName} (${phone}): ${itemsList}. Total: ${totalPrice} DA. ${deliveryLine}. Ref: ${orderRef}`;
  const whatsappLink = buildWhatsAppLink(restaurant.contact.whatsapp, message);
  res.status(201).json({ order, whatsappLink });
};

const cancelOrder = async (req, res) => {
  const order = await Order.findOne({ cancelToken: req.params.token });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  if (!['pending', 'confirmed'].includes(order.status)) {
    return res.status(409).json({ message: 'Order can no longer be cancelled' });
  }

  order.status = 'cancelled';
  await order.save();
  res.json({ message: 'Order cancelled' });
};

const getAllOrders = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });

  res.json(order);
};

module.exports = { createOrder, cancelOrder, getAllOrders, updateOrderStatus };