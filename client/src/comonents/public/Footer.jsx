import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import { cn } from "../../lib/utils";
import { hours, restaurant } from "../../features/restaurant/data";
import { languages, useLang } from "../../i18n";

export default function Footer() {
  const { lang, setLang } = useLang();

  const links = [
    { to: "/", label: "Home" },
    { to: "/menu", label: "Menu" },
    { to: "/book", label: "Booking" },
    { to: "/order", label: "Order online" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-sumi text-washi">
      <div className="shell grid gap-14 py-20 md:grid-cols-3 md:py-24">

        {/* Restaurant */}
        <div>
          <p className="label tracking-[0.42em]">
            {restaurant.name}
          </p>

          <p className="mt-6 max-w-xs text-sm leading-relaxed text-washi/60">
            A twelve-seat counter. Carefully sourced ingredients,
            considered preparation, and nothing on the plate that
            isn't necessary.
          </p>

          <dl className="mt-8 space-y-1">
            {hours.map((hour) => (
              <div
                key={hour.day}
                className="flex justify-between gap-6 text-sm text-washi/70"
              >
                <dt className="label opacity-70">
                  {hour.day}
                </dt>

                <dd className="num text-xs">
                  {hour.time}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Navigation */}
        <div className="md:justify-self-center">
          <p className="label text-washi/50">
            Navigate
          </p>

          <ul className="mt-6 space-y-3">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hairline-link text-sm text-washi/70"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:justify-self-end">
          <p className="label text-washi/50">
            Find us
          </p>

          <address className="mt-6 space-y-3 text-sm not-italic text-washi/70">
            <p>{restaurant.address}</p>

            <p className="num text-xs">
              {restaurant.phone}
            </p>

            <p>{restaurant.email}</p>
          </address>

          <div className="mt-8 flex gap-5 text-washi/60">
            <a
              href={restaurant.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-shu"
            >
              <Instagram
                className="h-4 w-4"
                strokeWidth={1.25}
              />
            </a>

            <a
              href={restaurant.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-shu"
            >
              <Facebook
                className="h-4 w-4"
                strokeWidth={1.25}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-washi/10">
        <div className="shell flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="label text-washi/40">
            © {new Date().getFullYear()} {restaurant.name}
          </p>

          <div className="flex gap-4">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setLang(language)}
                className={cn(
                  "label transition-colors",
                  lang === language
                    ? "text-shu"
                    : "text-washi/40 hover:text-washi"
                )}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}