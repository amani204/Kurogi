require('dotenv').config();
const mongoose = require('mongoose');
const DeliveryZone = require('../models/deliveryZone');

const zones = [
  { wilaya: 'Batna', price: 300 },
  { wilaya: 'Sétif', price: 400 },
  { wilaya: 'Constantine', price: 500 },
  { wilaya: 'Alger', price: 800 },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  for (const z of zones) {
    await DeliveryZone.findOneAndUpdate({ wilaya: z.wilaya }, z, { upsert: true, new: true });
  }
  console.log(`${zones.length} delivery zones ready.`);
  process.exit(0);
};

run().catch((err) => { console.error(err); process.exit(1); });