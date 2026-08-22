import { useReveal } from "../../hooks/useReveal";

const reviews = [
  {
    quote:
      "A remarkably restrained dining experience. Every course feels considered.",
    source: "Le Guide",
  },
  {
    quote:
      "Beautifully precise without ever becoming precious.",
    source: "Table Notes",
  },
  {
    quote:
      "The kind of meal that stays with you long after the final plate.",
    source: "The Dining Journal",
  },
];

export default function CriticalAcclaim() {
  const sectionRef = useReveal({
    children: ".acclaim-item",
    y: 25,
    stagger: 0.15,
  });

  return (
    <section className="bg-muted py-28 md:py-36">
      <div className="shell">
        <div
          ref={sectionRef}
          className="grid gap-16 md:grid-cols-12"
        >
          {/* Heading */}
          <div className="acclaim-item md:col-span-3">
            <p className="label text-shu">
              02 — Critical acclaim
            </p>

            <h2 className="mt-8 text-4xl md:text-5xl">
              Words from
              <br />
              the table.
            </h2>
          </div>

          {/* Reviews */}
          <div className="md:col-span-8 md:col-start-5">
            {reviews.map((review, index) => (
              <article
                key={review.source}
                className="acclaim-item border-t border-border py-10 last:border-b"
              >
                <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
                  <blockquote className="font-display text-3xl leading-tight italic md:text-4xl">
                    “{review.quote}”
                  </blockquote>

                  <p className="label whitespace-nowrap text-muted-foreground">
                    — {review.source}
                  </p>
                </div>

                <p className="num mt-6 text-xs text-muted-foreground">
                  0{index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}