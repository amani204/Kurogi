import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next, useTranslation } from "react-i18next";

const resources = {
  en: {
    translation: {
      home: "Home",
      menu: "Menu",
      book: "Booking",
      order: "Order",
      gallery: "Gallery",
      contact: "Contact",
      reserve: "Reserve",
      checkout: "Checkout",
      total: "Total",
      navigate: "Navigate",
      findUs: "Find us",
      yourOrder: "Your order",
      emptyCart:
        "Nothing here yet. The menu is a good place to start.",
    },
  },

  fr: {
    translation: {
      home: "Accueil",
      menu: "Menu",
      book: "Réservation",
      order: "Commander",
      gallery: "Galerie",
      contact: "Contact",
      reserve: "Réserver",
      checkout: "Commander",
      total: "Total",
      navigate: "Navigation",
      findUs: "Nous trouver",
      yourOrder: "Votre commande",
      emptyCart:
        "Votre panier est vide. Découvrez notre menu.",
    },
  },

  ar: {
    translation: {
      home: "الرئيسية",
      menu: "القائمة",
      book: "الحجز",
      order: "الطلب",
      gallery: "المعرض",
      contact: "اتصل بنا",
      reserve: "احجز الآن",
      checkout: "إتمام الطلب",
      total: "المجموع",
      navigate: "التنقل",
      findUs: "موقعنا",
      yourOrder: "طلبك",
      emptyCart:
        "السلة فارغة. ابدأ باستكشاف قائمتنا.",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    supportedLngs: ["en", "fr", "ar"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export const languages = ["en", "fr", "ar"];

export function useLang() {
  const { t, i18n } = useTranslation();

  const lang = i18n.language?.split("-")[0] || "en";

  const setLang = async (language) => {
    await i18n.changeLanguage(language);

    document.documentElement.lang = language;
    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";
  };

  return {
    t,
    lang,
    setLang,
  };
}

export default i18n;