require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Owner';

  if (!email || !password) {
    console.log('Usage: node src/utils/seedOwner.js <email> <password> [name]');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('User already exists.');
    process.exit(0);
  }

  await User.create({ name, email, password, role: 'owner' });
  console.log(`Owner account created for ${email}`);
  process.exit(0);
};

run();