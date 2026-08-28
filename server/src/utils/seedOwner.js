require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const ask = (query) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(query, (answer) => { rl.close(); resolve(answer); }));
};

const askHidden = (query) => new Promise((resolve) => {
  process.stdout.write(query);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');

  let input = '';
  const onData = (char) => {
    if (char === '\n' || char === '\r' || char === '\u0004') {
      process.stdin.setRawMode(false);
      process.stdin.removeListener('data', onData);
      process.stdout.write('\n');
      resolve(input);
      return;
    }
    if (char === '\u0003') process.exit();
    if (char === '\u007f') { input = input.slice(0, -1); return; }
    input += char;
  };
  process.stdin.on('data', onData);
});

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = await ask('Owner email: ');
  const name = (await ask('Owner name (optional): ')) || 'Owner';
  const password = await askHidden('Owner password (hidden): ');

  if (!email || !password) {
    console.log('Email and password are required.');
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