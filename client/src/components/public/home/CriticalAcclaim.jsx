import { useReveal } from "../../../hooks/gsap/useReveal";
import { InkStroke } from "../../../components/public/InkStroke";

const reviews = [
  {
    quote:
      "The otoro alone justifies the trip. Twelve seats and not one wasted gesture.",
    source: "Le Fooding",
  },
  {
    quote:
      "Rice temperature is exact. That is rarer than good fish.",
    source: "Atabula",
  },
  {
    quote:
      "A room that asks you to pay attention, and rewards it.",
    source: "Régal",
  },
];

export default function CriticalAcclaim() {
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
            Critical acclaim
          </p>

          <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
            A few words from the room.
          </h2>
        </div>
        <div
          ref={reviewsRef}
          className="grid gap-12 md:grid-cols-3 md:gap-10"
        >
          {reviews.map((review) => (
            <blockquote
              key={review.source}
              className="opacity-0"
            >
              <InkStroke
                trigger="scroll"
                className="h-4 w-16 text-shu"
              />

              <p className="mt-6 font-display text-2xl leading-snug md:text-[1.7rem]">
                “{review.quote}”
              </p>

              <footer className="label mt-6 text-muted-foreground">
                {review.source}
              </footer>
            </blockquote>
          ))}
        </div>

      </div>
    </section>
  );
}