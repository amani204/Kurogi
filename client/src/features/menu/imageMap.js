import dishOtoro from '../../assets/menu/dish-otoro.jpg';
import dishHamachi from '../../assets/menu/dish-hamachi.jpg';
import dishUni from '../../assets/menu/dish-uni.jpg';
import dishChirashi from '../../assets/menu/dish-chirashi.jpg';
import dishSake from '../../assets/menu/dish-sake.jpg';
import dishMatcha from '../../assets/menu/dish-matcha.jpg';

// key = MenuItem.slug (stable across all languages, unlike name which is now {en,fr,ar})
export const menuImageMap = {
  'yuzu-edamame': dishHamachi,
  'chawanmushi': dishMatcha,
  'duck-gyoza': dishChirashi,
  'otoro-nigiri': dishOtoro,
  'hamachi-sashimi': dishHamachi,
  'uni-ikura-gunkan': dishUni,
  'omakase-12-pieces': dishOtoro,
  'chirashi-bowl': dishChirashi,
  'miso-black-cod': dishHamachi,
  'junmai-daiginjo': dishSake,
  'roasted-hojicha': dishSake,
  'matcha-pudding': dishMatcha,
  'yuzu-sorbet': dishMatcha,
};

export const fallbackImage = dishOtoro;

export const getMenuItemImage = (slug) => menuImageMap[slug] || fallbackImage;