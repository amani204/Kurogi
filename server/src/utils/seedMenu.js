require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category');
const MenuItem = require('../models/MenuItem');

const categories = [
  { slug: 'starters', order: 1, label: { en: 'Starters', fr: 'Entrées', ar: 'المقبلات' } },
  { slug: 'sushi', order: 2, label: { en: 'Sushi & Sashimi', fr: 'Sushi & Sashimi', ar: 'سوشي وساشيمي' } },
  { slug: 'mains', order: 3, label: { en: 'Mains', fr: 'Plats Principaux', ar: 'الأطباق الرئيسية' } },
  { slug: 'drinks', order: 4, label: { en: 'Drinks', fr: 'Boissons', ar: 'المشروبات' } },
  { slug: 'desserts', order: 5, label: { en: 'Desserts', fr: 'Desserts', ar: 'الحلويات' } },
];

// Only 6 items, each with a distinct name → unique image
const menuItems = [
  {
    slug: 'yuzu-edamame',
    category: 'starters',
    price: 1600,
    name: { en: 'Yuzu Edamame', fr: 'Edamame au Yuzu', ar: 'إيدامامي باليوزو' },
    description: {
      en: 'Steamed young soy beans, yuzu salt, charred lemon.',
      fr: 'Fèves de soja jeunes cuites à la vapeur, sel au yuzu, citron grillé.',
      ar: 'فول الصويا الأخضر المطهو على البخار، ملح اليوزو، ليمون مشوي.',
    },
  },
  {
    slug: 'otoro-nigiri',
    category: 'sushi',
    price: 3200,
    featured: true,
    name: { en: 'Otoro Nigiri', fr: 'Nigiri Otoro', ar: 'نيجيري أوتورو' },
    description: {
      en: 'Two pieces of bluefin belly, aged shari, nikiri brushed.',
      fr: 'Deux pièces de ventre de thon rouge, shari vieilli, badigeonné de nikiri.',
      ar: 'قطعتان من بطن التونة الزرقاء الدهنية، أرز شاري معتّق، مدهون بصلصة نيكيري.',
    },
  },
  {
    slug: 'omakase-12-pieces',
    category: 'mains',
    price: 2500,
    featured: true,
    name: { en: 'Omakase — 12 pieces', fr: 'Omakase — 12 pièces', ar: 'أوماكاسي — 12 قطعة' },
    description: {
      en: "The counter's choice. Whatever the market gave us this morning.",
      fr: 'Le choix du chef. Ce que le marché nous a offert ce matin.',
      ar: 'اختيار الشيف. أفضل ما قدّمه السوق هذا الصباح.',
    },
  },
  {
    slug: 'chirashi-bowl',
    category: 'mains', // second main, but we keep it for variety
    price: 3800,
    name: { en: 'Chirashi Bowl', fr: 'Bol Chirashi', ar: 'طبق تشيراشي' },
    description: {
      en: 'Seasonal sashimi over vinegared rice, wasabi root.',
      fr: 'Sashimi de saison sur riz vinaigré, racine de wasabi.',
      ar: 'ساشيمي موسمي فوق أرز مخلل بالخل، جذر الواسابي.',
    },
  },
  {
    slug: 'junmai-daiginjo',
    category: 'drinks',
    price: 2000,
    name: { en: 'Junmai Daiginjo', fr: 'Junmai Daiginjo', ar: 'جونماي دايغينجو' },
    description: {
      en: 'Yamagata. Pear, white flower, long clean finish. 180ml.',
      fr: 'Yamagata. Poire, fleur blanche, finale longue et nette. 180ml.',
      ar: 'من ياماغاتا. نكهة الكمثرى، زهرة بيضاء، نهاية نظيفة وطويلة. 180 مل.',
    },
  },
  {
    slug: 'matcha-pudding',
    category: 'desserts',
    price: 2500,
    name: { en: 'Matcha Pudding', fr: 'Pudding au Matcha', ar: 'بودينغ الماتشا' },
    description: {
      en: 'Uji matcha, kinako, black sesame brittle.',
      fr: "Matcha d'Uji, kinako, brittle de sésame noir.",
      ar: 'ماتشا من أوجي، كيناكو، بريتل السمسم الأسود.',
    },
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding categories...');

  for (const cat of categories) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`${categories.length} categories ready.`);

  console.log('Seeding menu items (6 items)...');
  for (const item of menuItems) {
    await MenuItem.findOneAndUpdate({ slug: item.slug }, item, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  console.log(`${menuItems.length} menu items ready.`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});