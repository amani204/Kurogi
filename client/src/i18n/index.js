import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next, useTranslation } from "react-i18next";

import en from "./locales/en";
import fr from "./locales/fr";
import ar from "./locales/ar";

const resources = {
  en,
  fr,
  ar,
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    supportedLngs: ["en", "fr", "ar"],

    ns: ["public"],
    defaultNS: "public",

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Set initial document language/direction
const currentLang = i18n.language?.split("-")[0] || "en";

document.documentElement.lang = currentLang;
document.documentElement.dir =
  currentLang === "ar" ? "rtl" : "ltr";

export const languages = ["en", "fr", "ar"];

export function useLang() {
  const { t, i18n } = useTranslation("public");

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