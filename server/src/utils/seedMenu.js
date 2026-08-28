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

// prices are placeholder DA amounts — adjust freely via the admin dashboard later
const menuItems = [
  {
    slug: 'yuzu-edamame', category: 'starters', price: 1600,
    name: { en: 'Yuzu Edamame', fr: 'Edamame au Yuzu', ar: 'إيدامامي باليوزو' },
    description: {
      en: 'Steamed young soy beans, yuzu salt, charred lemon.',
      fr: 'Fèves de soja jeunes cuites à la vapeur, sel au yuzu, citron grillé.',
      ar: 'فول الصويا الأخضر المطهو على البخار، ملح اليوزو، ليمون مشوي.',
    },
  },
  {
    slug: 'chawanmushi', category: 'starters', price: 2000,
    name: { en: 'Chawanmushi', fr: 'Chawanmushi', ar: 'تشاوان موشي' },
    description: {
      en: 'Silken egg custard, dashi, snow crab, mitsuba.',
      fr: 'Flan aux œufs soyeux, dashi, crabe des neiges, mitsuba.',
      ar: 'كاسترد بيض حريري، مرق الداشي، سرطان الثلج، ميتسوبا.',
    },
  },
  {
    slug: 'duck-gyoza', category: 'starters', price: 1000, available: false,
    name: { en: 'Duck Gyoza', fr: 'Gyoza au Canard', ar: 'جيوزا البط' },
    description: {
      en: 'Five pieces, black vinegar, sansho pepper.',
      fr: 'Cinq pièces, vinaigre noir, poivre sansho.',
      ar: 'خمس قطع، خل أسود، فلفل سانشو.',
    },
  },
  {
    slug: 'otoro-nigiri', category: 'sushi', price: 3200, featured: true,
    name: { en: 'Otoro Nigiri', fr: 'Nigiri Otoro', ar: 'نيجيري أوتورو' },
    description: {
      en: 'Two pieces of bluefin belly, aged shari, nikiri brushed.',
      fr: 'Deux pièces de ventre de thon rouge, shari vieilli, badigeonné de nikiri.',
      ar: 'قطعتان من بطن التونة الزرقاء الدهنية، أرز شاري معتّق، مدهون بصلصة نيكيري.',
    },
  },
  {
    slug: 'hamachi-sashimi', category: 'sushi', price: 2600,
    name: { en: 'Hamachi Sashimi', fr: 'Sashimi de Hamachi', ar: 'ساشيمي هاماتشي' },
    description: {
      en: 'Yellowtail cut thin, shiso, cold-pressed sesame.',
      fr: 'Sériole coupée finement, shiso, sésame pressé à froid.',
      ar: 'سمك هاماتشي مقطّع رقيقًا، أوراق الشيسو، سمسم معصور على البارد.',
    },
  },
  {
    slug: 'uni-ikura-gunkan', category: 'sushi', price: 2400, featured: true,
    name: { en: 'Uni & Ikura Gunkan', fr: 'Gunkan Uni & Ikura', ar: 'جونكان أوني وإيكورا' },
    description: {
      en: 'Hokkaido sea urchin, salmon roe, crisp nori.',
      fr: "Oursin d'Hokkaido, œufs de saumon, nori croustillant.",
      ar: 'قنفذ البحر من هوكايدو، بيض السلمون، نوري مقرمش.',
    },
  },
  {
    slug: 'omakase-12-pieces', category: 'mains', price: 2500, featured: true,
    name: { en: 'Omakase — 12 pieces', fr: 'Omakase — 12 pièces', ar: 'أوماكاسي — 12 قطعة' },
    description: {
      en: "The counter's choice. Whatever the market gave us this morning.",
      fr: 'Le choix du chef. Ce que le marché nous a offert ce matin.',
      ar: 'اختيار الشيف. أفضل ما قدّمه السوق هذا الصباح.',
    },
  },
  {
    slug: 'chirashi-bowl', category: 'mains', price: 3800,
    name: { en: 'Chirashi Bowl', fr: 'Bol Chirashi', ar: 'طبق تشيراشي' },
    description: {
      en: 'Seasonal sashimi over vinegared rice, wasabi root.',
      fr: 'Sashimi de saison sur riz vinaigré, racine de wasabi.',
      ar: 'ساشيمي موسمي فوق أرز مخلل بالخل، جذر الواسابي.',
    },
  },
  {
    slug: 'miso-black-cod', category: 'mains', price: 4200,
    name: { en: 'Miso Black Cod', fr: 'Morue Noire au Miso', ar: 'سمك القد الأسود بالميسو' },
    description: {
      en: 'Three-day saikyo miso marinade, hoba leaf.',
      fr: 'Marinade au miso saikyo de trois jours, feuille de hoba.',
      ar: 'متبّل بمعجون الميسو الساكيو لمدة ثلاثة أيام، ورقة هوبا.',
    },
  },
  {
    slug: 'junmai-daiginjo', category: 'drinks', price: 2000,
    name: { en: 'Junmai Daiginjo', fr: 'Junmai Daiginjo', ar: 'جونماي دايغينجو' },
    description: {
      en: 'Yamagata. Pear, white flower, long clean finish. 180ml.',
      fr: 'Yamagata. Poire, fleur blanche, finale longue et nette. 180ml.',
      ar: 'من ياماغاتا. نكهة الكمثرى، زهرة بيضاء، نهاية نظيفة وطويلة. 180 مل.',
    },
  },
  {
    slug: 'roasted-hojicha', category: 'drinks', price: 1500,
    name: { en: 'Roasted Hojicha', fr: 'Hojicha Torréfié', ar: 'هوجيتشا محمّص' },
    description: {
      en: 'Kyoto leaf, roasted in-house, served in kyusu.',
      fr: 'Feuille de Kyoto, torréfiée sur place, servie dans un kyusu.',
      ar: 'أوراق من كيوتو، محمّصة في المطعم، تُقدَّم في إبريق كيوسو.',
    },
  },
  {
    slug: 'matcha-pudding', category: 'desserts', price: 2500,
    name: { en: 'Matcha Pudding', fr: 'Pudding au Matcha', ar: 'بودينغ الماتشا' },
    description: {
      en: 'Uji matcha, kinako, black sesame brittle.',
      fr: "Matcha d'Uji, kinako, brittle de sésame noir.",
      ar: 'ماتشا من أوجي، كيناكو، بريتل السمسم الأسود.',
    },
  },
  {
    slug: 'yuzu-sorbet', category: 'desserts', price: 2000, available: false,
    name: { en: 'Yuzu Sorbet', fr: 'Sorbet au Yuzu', ar: 'سوربيه اليوزو' },
    description: {
      en: 'Sharp, cold, nothing else.',
      fr: "Vif, froid, rien d'autre.",
      ar: 'حاد المذاق، بارد، لا شيء آخر.',
    },
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
    await MenuItem.findOneAndUpdate({ slug: item.slug }, item, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  console.log(`${menuItems.length} menu items ready.`);

  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});