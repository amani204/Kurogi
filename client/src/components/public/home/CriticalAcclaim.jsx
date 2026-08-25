
import { useReveal } from "../../../hooks/gsap/useReveal";
import { InkStroke } from "../../../components/public/InkStroke";
import { useLang } from "../../../i18n";

const reviews = [
  {
    key: "first",
  },
  {
    key: "second",
  },
  {
    key: "third",
  },
];

export default function CriticalAcclaim() {
  const { t } = useLang();

  const reviewsRef = useReveal({
    children: "blockquote",
    y: 35,
    stagger: 0.15,
    duration: 0.9,
  });

  return (
    <section className="bg-muted py-28 md:py-36">
      <div className="shell">
        <div className="mb-16">
          <p className="label text-shu">
            {t("reviews.eyebrow")}
          </p>

          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
            {t("reviews.title")}
          </h2>
        </div>

        <div
          ref={reviewsRef}
          className="grid gap-12 md:grid-cols-3 md:gap-10"
        >
          {reviews.map((review) => (
            <blockquote
              key={review.key}
              className="opacity-0"
            >
              <InkStroke
                trigger="scroll"
                className="h-4 w-16 text-shu"
              />

              <p className="mt-6 font-display text-2xl leading-snug md:text-[1.7rem]">
                “{t(`reviews.${review.key}.quote`)}”
              </p>

              <footer className="label mt-6 text-muted-foreground">
                {t(`reviews.${review.key}.source`)}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}