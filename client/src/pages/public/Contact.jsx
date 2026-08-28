import { useLang } from "../../i18n";
import { useFetch } from "../../hooks/useFetch";
import { fetchRestaurantSettings } from "../../features/restaurant/api";
import { SectionDivider } from "../../components/public/InkStroke";

const DAY_LABELS = {
  en: { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' },
  fr: { mon: 'Lundi', tue: 'Mardi', wed: 'Mercredi', thu: 'Jeudi', fri: 'Vendredi', sat: 'Samedi', sun: 'Dimanche' },
  ar: { mon: 'الإثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت', sun: 'الأحد' },
};

const buildWhatsAppLink = (phone, message) => {
  if (!phone) return null;
  const clean = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
};

export default function Contact() {
  const { t, lang } = useLang();
  const { data: restaurant, loading } = useFetch(fetchRestaurantSettings, []);

  if (loading || !restaurant) {
    return (
      <main className="pt-24 md:pt-32">
        <div className="shell py-32 text-center text-sumi/40">...</div>
      </main>
    );
  }

  const contact = restaurant.contact || {};
  const dayLabels = DAY_LABELS[lang] || DAY_LABELS.en;
  const waLink = buildWhatsAppLink(contact.whatsapp, t("contactPage.whatsappMessage"));

  return (
    <main id="contact" className="pt-24 md:pt-32">
      <header className="shell">
        <p className="label text-shu">{t("contactPage.eyebrow")}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          {t("contactPage.title")}
        </h1>
      </header>

      <SectionDivider className="my-12" />

      <div className="shell grid gap-16 pb-28 md:grid-cols-2">
        <div>
          <address className="space-y-3 text-sm not-italic leading-relaxed">
            {contact.address && <p className="font-display text-2xl">{contact.address}</p>}
            {contact.phone && <p className="num text-xs text-muted-foreground">{contact.phone}</p>}
            {contact.email && <p className="text-muted-foreground">{contact.email}</p>}
          </address>

          {waLink && (
            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="hairline-link label mt-6 inline-block text-shu"
            >
              {t("contactPage.whatsappCta")}
            </a>
          )}

          {restaurant.hours?.length > 0 && (
            <>
              <p className="label mt-12 text-muted-foreground">{t("contactPage.hours")}</p>
              <dl className="mt-5 space-y-2">
                {restaurant.hours.map((hour) => (
                  <div key={hour.day} className="flex justify-between gap-6 border-b border-border pb-2">
                    <dt className="label">{dayLabels[hour.day] || hour.day}</dt>
                    <dd className="num text-xs text-muted-foreground">
                      {hour.open && hour.close ? `${hour.open} – ${hour.close}` : t("contactPage.closed")}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        <div>
          {restaurant.contact?.lat && restaurant.contact?.lng ? (
            <iframe
              title={`Map to ${restaurant.name}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${restaurant.contact.lng - 0.003}%2C${restaurant.contact.lat - 0.003}%2C${restaurant.contact.lng + 0.003}%2C${restaurant.contact.lat + 0.003}&layer=mapnik&marker=${restaurant.contact.lat}%2C${restaurant.contact.lng}`}
              className="h-80 w-full border border-border grayscale"
              loading="lazy"
            />
          ) : (
            <div className="h-80 w-full border border-border bg-sumi/5 flex items-center justify-center text-sm text-muted-foreground">
              {contact.address || t("contactPage.mapCaption")}
            </div>
          )}

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t("contactPage.mapCaption")}
          </p>
        </div>
      </div>
    </main>
  );
}