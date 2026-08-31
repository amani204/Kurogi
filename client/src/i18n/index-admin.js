import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// Admin translations
import en from "./locales/en";
import fr from "./locales/fr";
import ar from "./locales/ar";

const adminI18n = i18n.createInstance();
const resources = {
  en,
  fr,
  ar,
};
adminI18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "fr", "ar"],
    ns: ["admin"],
    defaultNS: "admin",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "admin-i18nextLng", 
    },
  });

export const adminLanguages = ["en", "fr", "ar"];

export function useAdminLang() {
  const { t, i18n } = useTranslation("admin", { i18n: adminI18n });

  const lang = i18n.language?.split("-")[0] || "en";

  const setLang = async (language) => {
    await i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  };

  return {
    t,
    lang,
    setLang,
    i18n,
  };
}

export default adminI18n;