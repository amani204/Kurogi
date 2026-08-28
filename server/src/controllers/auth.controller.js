const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// only an owner can create staff accounts — role is always forced to 'staff'
// here, never trusted from the request body
const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, role: 'staff' });

  generateToken(res, user._id, user.role);
  res.status(201).json({ id: user._id, name: user.name, role: user.role });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const genericError = { message: 'Invalid email or password' };

  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json(genericError);

  const match = await user.comparePassword(password);
  if (!match) return res.status(401).json(genericError);

  generateToken(res, user._id, user.role);
  res.json({ id: user._id, name: user.name, role: user.role });
};

const logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out' });
};

const me = (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, role: req.user.role });
};

module.exports = { register, login, logout, me };