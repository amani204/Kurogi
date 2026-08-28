import { Link } from "react-router-dom";
import { useReveal } from "../../../hooks/gsap/useReveal";
import ambienceImage from "../../../assets/home/ambience.jpg";
import { useLang } from "../../../i18n";
import { useFetch } from "../../../hooks/useFetch";
import { fetchRestaurantSettings } from "../../../features/restaurant/api";

const DAY_LABELS = {
  en: { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' },
  fr: { mon: 'Lun', tue: 'Mar', wed: 'Mer', thu: 'Jeu', fri: 'Ven', sat: 'Sam', sun: 'Dim' },
  ar: { mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت', sun: 'الأحد' },
};

export default function Location() {
  const { t, lang } = useLang();
  const { data: restaurant } = useFetch(fetchRestaurantSettings, []);

  const contentRef = useReveal({
    children: "[data-reveal]",
    y: 30,
    stagger: 0.1,
  });

  // fetch hasn't resolved yet — render nothing
  if (!restaurant) return null;

  const dayLabels = DAY_LABELS[lang] || DAY_LABELS.en;
  const contact = restaurant.contact || {};

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[65vh] min-h-130">
        {/* Background image */}
        <img
          src={ambienceImage}
          alt={t("location.imageAlt")}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover grayscale-20"
        />

        <div className="absolute inset-0 bg-sumi/65" />

        <div
          ref={contentRef}
          className="shell relative z-10 flex h-full flex-col justify-center text-washi"
        >
          <div className="max-w-xl">
            <p data-reveal className="label text-washi/60">
              {t("location.eyebrow")}
            </p>

            <p data-reveal className="mt-4 text-sm leading-relaxed text-washi/70">
              {contact.address}
            </p>

            <dl data-reveal className="mt-6 max-w-sm space-y-2">
              {(restaurant.hours || []).map((hour) => (
                <div
                  key={hour.day}
                  className="flex justify-between gap-8 border-b border-washi/15 pb-2 text-sm"
                >
                  <dt className="label text-washi/60">
                    {dayLabels[hour.day] || hour.day}
                  </dt>
                  <dd className="num text-xs text-washi/75">
                    {hour.open && hour.close ? `${hour.open} – ${hour.close}` : '—'}
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              data-reveal
              to="/contact"
              className="hairline-link label mt-8 inline-block text-washi"
            >
              {t("location.directions")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}