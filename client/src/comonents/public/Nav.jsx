import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Menu as MenuIcon,
  ShoppingBag,
  X,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { useCart } from "../../features/orders/context/CartContext";
import { languages, useLang } from "../../i18n";
import { restaurant } from "../../features/restaurant/data";

const links = [
  { to: "/", key: "home" },
  { to: "/menu", key: "menu" },
  { to: "/book", key: "book" },
  { to: "/order", key: "order" },
  { to: "/gallery", key: "gallery" },
  { to: "/contact", key: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { pathname } = useLocation();
  const { t, lang, setLang } = useLang();
  const { count, setOpen } = useCart();

  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ",
        overHero
          ? "bg-transparent text-washi"
          : "bg-sumi text-washi"
      )}
    >
      <div className="shell flex h-16 items-center justify-between gap-6 md:h-20 ">

        {/* Logo */}
        <Link
          to="/"
          className="label text-[0.8rem] tracking-[0.42em] no-underline"
        >
          {restaurant.name}
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="hairline-link label opacity-80 transition-opacity hover:opacity-100"
              data-active={pathname === link.to}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Languages */}
          <div className="hidden items-center gap-2 sm:flex">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setLang(language)}
                className={cn(
                  "label transition-opacity",
                  lang === language
                    ? "text-shu opacity-100"
                    : "opacity-50 hover:opacity-90"
                )}
              >
                {language}
              </button>
            ))}
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="label relative flex items-center gap-2 opacity-80 hover:opacity-100"
            aria-label="Open cart"
          >
            <ShoppingBag
              className="h-4 w-4"
              strokeWidth={1.25}
            />

            <span className="num text-[0.7rem]">
              {count}
            </span>
          </button>

          {/* Reserve */}
          <Link
            to="/book"
            className="label hidden bg-shu px-5 py-3 text-washi transition-colors hover:bg-sumi md:inline-block"
          >
            {t("reserve")}
          </Link>

          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.25} />
            ) : (
              <MenuIcon
                className="h-5 w-5"
                strokeWidth={1.25}
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="border-t border-washi/15 bg-sumi md:hidden">
          <div className="shell flex flex-col py-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="label py-3 opacity-80"
              >
                {t(link.key)}
              </Link>
            ))}

            <div className="mt-2 flex gap-4 border-t border-washi/10 pt-4">
              {languages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setLang(language)}
                  className={cn(
                    "label",
                    lang === language
                      ? "text-shu"
                      : "opacity-50"
                  )}
                >
                  {language}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}