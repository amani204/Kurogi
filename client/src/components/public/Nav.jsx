import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu as MenuIcon, ShoppingBag, X } from "lucide-react";

import { cn } from "../../lib/utils";
import { useCart } from "../../features/orders/context/CartContext";
import { useLang } from "../../i18n";
import { restaurant } from "../../features/restaurant/data";

import CartDrawer from "../../components/public/CartDrawer";
import Button from "../../components/ui/Button";
import LanguageSwitcher from "../../components/public/SwitchLanguage";

const links = [
  { to: "/", key: "home" },
  { to: "/menu", key: "menu" },
  { to: "/booking", key: "book" },
  { to: "/order", key: "order" },
  { to: "/gallery", key: "gallery" },
  { to: "/contact", key: "contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { pathname } = useLocation();
  const { t, lang } = useLang(); // <-- added lang
  const { count, setOpen } = useCart();

  const overHero = pathname === "/" && !scrolled;

  // Determine direction based on language
  const dir = lang === "ar" ? "rtl" : "ltr";

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

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          overHero
            ? "bg-transparent text-washi"
            : "bg-sumi text-washi"
        )}
      >
        {/* Main navbar */}
        <div className="shell flex h-16 items-center justify-between gap-6 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="label text-[0.8rem] tracking-[0.42em] no-underline"
          >
            {restaurant.name}
          </Link>

          {/* Desktop navigation */}
          <nav dir={dir} className="hidden items-center gap-8 md:flex">
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
            {/* Language */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Cart */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="label relative flex items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
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

            {/* Desktop Book button */}
            <div className="hidden md:block">
              <Button
                to="/booking"
                variant="primary"
                className="px-5 py-3"
                onClick={() => setOpen(false)}
              >
                {t("reservebtn")}
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="md:hidden"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              aria-label={
                mobileOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X
                  className="h-5 w-5"
                  strokeWidth={1.25}
                />
              ) : (
                <MenuIcon
                  className="h-5 w-5"
                  strokeWidth={1.25}
                />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "grid overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden",
            mobileOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0">
            <div className="border-t border-washi/15 bg-sumi">
              <div dir={dir} className="shell flex flex-col py-5">
                {/* Navigation links */}
                {links.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobileMenu}
                    className={cn(
                      "label border-b border-washi/10 py-4 opacity-0",
                      "transition-all duration-500",
                      mobileOpen &&
                        "translate-y-0 opacity-80",
                      !mobileOpen &&
                        "translate-y-3"
                    )}
                    style={{
                      transitionDelay: mobileOpen
                        ? `${index * 50}ms`
                        : "0ms",
                    }}
                  >
                    {t(link.key)}
                  </Link>
                ))}

                {/* Mobile Book button */}
                <div
                  className={cn(
                    "pt-5 transition-all duration-500",
                    mobileOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  )}
                  style={{
                    transitionDelay: mobileOpen
                      ? `${links.length * 50}ms`
                      : "0ms",
                  }}
                >
                  <Button
                    to="/booking"
                    variant="primary"
                    className="w-full justify-center"
                    onClick={() => {
                      closeMobileMenu();
                      setOpen(false);
                    }}
                  >
                    {t("reservebtn")}
                  </Button>
                </div>

                {/* Mobile language switcher */}
                <div
                  className={cn(
                    "transition-all duration-500",
                    mobileOpen
                      ? "translate-y-0 opacity-100"
                      : "translate-y-3 opacity-0"
                  )}
                  style={{
                    transitionDelay: mobileOpen
                      ? `${(links.length + 1) * 50}ms`
                      : "0ms",
                  }}
                >
                  <LanguageSwitcher mobile />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}