import { hours, restaurant, whatsappLink } from "../features/restaurant/data";
import { SectionDivider } from "../comonents/public/InkStroke";

export default function Contact() {
  return (
    <main id="contact" className="pt-24 md:pt-32">
      {/* Header */}
      <header className="shell">
        <p className="label text-shu">Sainte-Anne</p>

        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          Contact
        </h1>
      </header>
      <SectionDivider className="my-12" />
      <div className="shell grid gap-16 pb-28 md:grid-cols-2">
        <div>
          <address className="space-y-3 text-sm not-italic leading-relaxed">
            <p className="font-display text-2xl">
              {restaurant.address}
            </p>

            <p className="num text-xs text-muted-foreground">
              {restaurant.phone}
            </p>

            <p className="text-muted-foreground">
              {restaurant.email}
            </p>
          </address>

          <a
            href={whatsappLink("Hello Kurogi, I have a question.")}
            target="_blank"
            rel="noreferrer"
            className="hairline-link label mt-6 inline-block text-shu"
          >
            Message on WhatsApp
          </a>

          {/* Hours */}
          <p className="label mt-12 text-muted-foreground">
            Hours
          </p>

          <dl className="mt-5 space-y-2">
            {hours.map((hour) => (
              <div
                key={hour.day}
                className="flex justify-between gap-6 border-b border-border pb-2"
              >
                <dt className="label">
                  {hour.day}
                </dt>

                <dd className="num text-xs text-muted-foreground">
                  {hour.time}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <iframe
            title="Map to Kurogi, 18 Rue Sainte-Anne, Paris"
            src="https://www.openstreetmap.org/export/embed.html?bbox=2.334%2C48.864%2C2.340%2C48.869&layer=mapnik"
            className="h-80 w-full border border-border grayscale"
            loading="lazy"
          />

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Métro Pyramides or Quatre-Septembre, both three minutes on foot.
            The door is unmarked — look for the single lantern.
          </p>
        </div>
      </div>
    </main>
  );
}