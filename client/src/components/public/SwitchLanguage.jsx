import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useLang } from "../../i18n";

const languages = [
  { code: "en", label: "EN", name: "English" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "ar", label: "AR", name: "العربية" },
];

export default function LanguageSwitcher({ mobile = false }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const currentLanguage =
    languages.find((language) => language.code === lang) ||
    languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageChange = async (language) => {
    await setLang(language);
    setOpen(false);
  };

  if (mobile) {
    return (
      <div className="border-t border-washi/10 pt-5">
        <div className="flex gap-2">
          {languages.map((language) => {
            const active = lang === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                aria-pressed={active}
                className={cn(
                  "label border px-4 py-2 text-xs transition-all duration-300",
                  active
                    ? "border-washi bg-washi text-sumi"
                    : "border-washi/20 text-washi/60 hover:border-washi/50 hover:text-washi"
                )}
              >
                {language.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={t("selectLanguage")}
        aria-expanded={open}
        className="label flex items-center gap-1.5 text-xs opacity-80 transition-opacity hover:opacity-100"
      >
        <span>{currentLanguage.label}</span>

        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-300",
            open && "rotate-180"
          )}
          strokeWidth={1.25}
        />
      </button>

      <div
        className={cn(
          "absolute right-0 top-full mt-3 w-32 origin-top-right",
          "border border-border bg-washi shadow-lg",
          "transition-all duration-300",
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-2 scale-95 opacity-0"
        )}
      >
        <div className="p-1.5">
          {languages.map((language) => {
            const active = lang === language.code;

            return (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2.5 text-left",
                  "label text-xs transition-colors duration-200",
                  active
                    ? "bg-sumi text-washi"
                    : "text-sumi/60 hover:bg-sumi/5 hover:text-sumi"
                )}
              >
                <span>{language.label}</span>

                <span className="text-[0.65rem] opacity-60">
                  {language.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}