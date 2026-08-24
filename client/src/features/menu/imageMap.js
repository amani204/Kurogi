import dishOtoro from "../../assets/menu/dish-otoro.jpg";
import dishHamachi from "../../assets/menu/dish-hamachi.jpg";
import dishUni from "../../assets/menu/dish-uni.jpg";
import dishChirashi from "../../assets/menu/dish-chirashi.jpg";
import dishSake from "../../assets/menu/dish-sake.jpg";
import dishMatcha from "../../assets/menu/dish-matcha.jpg";

export const menuImageMap = {
  "Otoro Nigiri": dishOtoro,
  "Hamachi Sashimi": dishHamachi,
  "Uni & Ikura Gunkan": dishUni,
  "Chirashi Bowl": dishChirashi,
  "Junmai Daiginjo": dishSake,
  "Matcha Pudding": dishMatcha,
};

export const fallbackImage = dishOtoro;

export const getMenuItemImage = (name) =>
  menuImageMap[name] || fallbackImage;