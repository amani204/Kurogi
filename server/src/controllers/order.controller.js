const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const { buildWhatsAppLink } = require('../utils/whatsapp');

const createOrder = async (req, res) => {
  const { customerName, phone, email, fulfillment, address, items, notes } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // rebuild items from DB — client-sent prices/names are ignored entirely
  const menuItemIds = items.map(i => i.menuItemId);
  const dbItems = await MenuItem.find({ _id: { $in: menuItemIds } });

  const resolvedItems = [];
  let totalPrice = 0;

  for (const cartItem of items) {
    const dbItem = dbItems.find(d => d._id.toString() === cartItem.menuItemId);

    if (!dbItem) return res.status(400).json({ message: `Item not found: ${cartItem.menuItemId}` });
    if (!dbItem.available) return res.status(409).json({ message: `${dbItem.name} is sold out` });

    const quantity = Math.max(1, Math.min(50, parseInt(cartItem.quantity, 10) || 1));

    resolvedItems.push({
      menuItem: dbItem._id,
      name: dbItem.name,
      price: dbItem.price,
      quantity,
    });
    totalPrice += dbItem.price * quantity;
  }

  const order = await Order.create({
    customerName, phone, email, fulfillment, address, notes,
    items: resolvedItems,
    totalPrice,
  });

  const restaurant = await Restaurant.findOne();
  const itemsList = resolvedItems.map(i => `${i.quantity}x ${i.name}`).join(', ');
  const message = `New order from ${customerName}: ${itemsList}. Total: ${totalPrice} DA. ${fulfillment === 'delivery' ? `Deliver to: ${address}` : 'Pickup'}. Manage: ${process.env.CLIENT_URL}/order-cancel/${order.cancelToken}`;
  const whatsappLink = buildWhatsAppLink(restaurant.contact.whatsapp, message);

  res.status(201).json({ order, whatsappLink });
};

const cancelOrder = async (req, res) => {
  const order = await Order.findOne({ cancelToken: req.params.token });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

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