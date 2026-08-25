import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { hours, restaurant } from "../../features/restaurant/data";
import { languages, useLang } from "../../i18n";

export default function Footer() {
  const { lang, setLang, t } = useLang();

  const linkKeys = [
    { to: "/", key: "home" },
    { to: "/menu", key: "menu" },
    { to: "/book", key: "book" },
    { to: "/order", key: "order" },
    { to: "/gallery", key: "gallery" },
    { to: "/contact", key: "contact" },
  ];

  return (
    <footer className="bg-sumi text-washi">
      <div className="shell grid gap-14 py-20 md:grid-cols-3 md:py-24">
        {/* Restaurant */}
        <div>
          <p className="label tracking-[0.42em]">
            {restaurant.name}
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
            {t("navigate")}
          </p>

          <ul className="mt-6 space-y-3">
            {linkKeys.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hairline-link text-sm text-washi/70"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:justify-self-end">
          <p className="label text-washi/50">
            {t("findUs")}
          </p>

          <address className="mt-6 space-y-3 text-sm not-italic text-washi/70">
            <p>{restaurant.address}</p>

            <p className="num text-xs">
              {restaurant.phone}
            </p>

            <p>{restaurant.email}</p>
          </address>

          <div className="mt-8 flex items-center gap-5 text-washi/60">
            {/* Instagram */}
            <a
              href={restaurant.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-shu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href={restaurant.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-shu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 21v-8h2.75l.4-3h-3.15V8.08c0-.87.24-1.46 1.5-1.46h1.8V3.94c-.31-.04-1.37-.14-2.6-.14-2.57 0-4.33 1.57-4.33 4.46V10H7.1v3h2.77v8h3.63Z" />
              </svg>
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