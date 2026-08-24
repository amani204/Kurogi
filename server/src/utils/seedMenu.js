require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const MenuItem = require('../models/MenuItem');

const categories = [
  { slug: "sushi", label: "Sushi & Sashimi", order: 1 },
  { slug: "mains", label: "Mains", order: 2 },
  { slug: "drinks", label: "Drinks", order: 3 },
  { slug: "desserts", label: "Desserts", order: 4 },
];

const menuItems = [
  {
    name: "Otoro Nigiri",
    description: "Two pieces of bluefin belly, aged shari, nikiri brushed.",
    price: 4000,
    category: "sushi",
    featured: true,
  },
  {
    name: "Hamachi Sashimi",
    description: "Yellowtail cut thin, shiso, cold-pressed sesame.",
    price: 3500,
    category: "sushi",
    featured: true,
  },
  {
    name: "Uni & Ikura Gunkan",
    description: "Hokkaido sea urchin, salmon roe, crisp nori.",
    price: 2000,
    category: "sushi",
    featured: true,
    
  },
  {
    name: "Chirashi Bowl",
    description: "Seasonal sashimi over vinegared rice, wasabi root.",
    price: 1500,
    category: "mains",
    featured: true,
  },
  {
    name: "Junmai Daiginjo",
    description: "Yamagata. Pear, white flower, long clean finish. 180ml.",
    price: 2000,
    category: "drinks",
    featured: true,
  },
  {
    name: "Matcha Pudding",
    description: "Uji matcha, kinako, black sesame brittle.",
    price: 2500,
    category: "desserts",
    featured: true,
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding categories...');

  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log(`${categories.length} categories ready.`);

  console.log('Seeding menu items...');
  for (const item of menuItems) {
    await MenuItem.findOneAndUpdate({ name: item.name }, item, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log(`${menuItems.length} menu items ready.`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});