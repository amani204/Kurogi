const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// only the owner should be able to create staff accounts — this is NOT a public
// signup endpoint. There's no public "become an owner" route at all; the first
// owner account is seeded manually (step 7 below).
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

  // deliberately generic error — never reveal whether it was the email or password
  // that was wrong, that lets attackers enumerate valid accounts
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