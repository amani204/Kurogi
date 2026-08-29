require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const MenuItem = require('../models/MenuItem');

const categories = [
  { 
    slug: "sushi", 
    order: 1, 
    label: { 
      en: "Sushi & Sashimi", 
      fr: "Sushi & Sashimi", 
      ar: "سوشي وساشيمي" 
    } 
  },
  { 
    slug: "mains", 
    order: 2, 
    label: { 
      en: "Mains", 
      fr: "Plats Principaux", 
      ar: "الأطباق الرئيسية" 
    } 
  },
  { 
    slug: "drinks", 
    order: 3, 
    label: { 
      en: "Drinks", 
      fr: "Boissons", 
      ar: "المشروبات" 
    } 
  },
  { 
    slug: "desserts", 
    order: 4, 
    label: { 
      en: "Desserts", 
      fr: "Desserts", 
      ar: "الحلويات" 
    } 
  },
];

const menuItems = [
  {
    slug: "otoro-nigiri",
    name: {
      en: "Otoro Nigiri",
      fr: "Nigiri Otoro",
      ar: "نيجيري أوتورو"
    },
    description: {
      en: "Two pieces of bluefin belly, aged shari, nikiri brushed.",
      fr: "Deux pièces de ventre de thon rouge, shari vieilli, badigeonné de nikiri.",
      ar: "قطعتان من بطن التونة الزرقاء الدهنية، أرز شاري معتّق، مدهون بصلصة نيكيري."
    },
    price: 4000,
    category: "sushi",
    featured: false,
    available: true,
  },
  {
    slug: "hamachi-sashimi",
    name: {
      en: "Hamachi Sashimi",
      fr: "Sashimi de Hamachi",
      ar: "ساشيمي هاماتشي"
    },
    description: {
      en: "Yellowtail cut thin, shiso, cold-pressed sesame.",
      fr: "Sériole coupée finement, shiso, sésame pressé à froid.",
      ar: "سمك هاماتشي مقطّع رقيقًا، أوراق الشيسو، سمسم معصور على البارد."
    },
    price: 3500,
    category: "sushi",
    featured: false,
    available: true,
  },
  {
    slug: "uni-ikura-gunkan",
    name: {
      en: "Uni & Ikura Gunkan",
      fr: "Gunkan Uni & Ikura",
      ar: "جونكان أوني وإيكورا"
    },
    description: {
      en: "Hokkaido sea urchin, salmon roe, crisp nori.",
      fr: "Oursin d'Hokkaido, œufs de saumon, nori croustillant.",
      ar: "قنفذ البحر من هوكايدو، بيض السلمون، نوري مقرمش."
    },
    price: 2000,
    category: "sushi",
    featured: false,
    available: true,
  },
  {
    slug: "chirashi-bowl",
    name: {
      en: "Chirashi Bowl",
      fr: "Bol Chirashi",
      ar: "طبق تشيراشي"
    },
    description: {
      en: "Seasonal sashimi over vinegared rice, wasabi root.",
      fr: "Sashimi de saison sur riz vinaigré, racine de wasabi.",
      ar: "ساشيمي موسمي فوق أرز مخلل بالخل، جذر الواسابي."
    },
    price: 1500,
    category: "mains",
    featured: true,
    available: true,
  },
  {
    slug: "junmai-daiginjo",
    name: {
      en: "Junmai Daiginjo",
      fr: "Junmai Daiginjo",
      ar: "جونماي دايغينجو"
    },
    description: {
      en: "Yamagata. Pear, white flower, long clean finish. 180ml.",
      fr: "Yamagata. Poire, fleur blanche, finale longue et nette. 180ml.",
      ar: "من ياماغاتا. نكهة الكمثرى، زهرة بيضاء، نهاية نظيفة وطويلة. 180 مل."
    },
    price: 2000,
    category: "drinks",
    featured: true,
    available: true,
  },
  {
    slug: "matcha-pudding",
    name: {
      en: "Matcha Pudding",
      fr: "Pudding au Matcha",
      ar: "بودينغ الماتشا"
    },
    description: {
      en: "Uji matcha, kinako, black sesame brittle.",
      fr: "Matcha d'Uji, kinako, brittle de sésame noir.",
      ar: "ماتشا من أوجي، كيناكو، بريتل السمسم الأسود."
    },
    price: 2500,
    category: "desserts",
    featured: true,
    available: true,
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('✅ Cleared');

    // Seed categories
    console.log('🌱 Seeding categories...');
    for (const cat of categories) {
      const newCat = new Category(cat);
      await newCat.save();
    }
    console.log(`✅ ${categories.length} categories seeded`);

    // Seed menu items
    console.log('🌱 Seeding menu items...');
    for (const item of menuItems) {
      const newItem = new MenuItem(item);
      await newItem.save();
    }
    console.log(`✅ ${menuItems.length} menu items seeded (${menuItems.filter(i => i.featured).length} featured)`);

    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

run();