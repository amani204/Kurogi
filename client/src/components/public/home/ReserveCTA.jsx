import Button from "../../ui/Button";
import { InkStroke } from "../InkStroke";
import { useReveal } from "../../../hooks/gsap/useReveal";

export default function ReserveCTA() {
  const contentRef = useReveal({
    children: "[data-reveal]",
    y: 30,
    stagger: 0.12,
  });

  return (
    <section className="bg-shu text-washi">
      <div
        ref={contentRef}
        className="shell flex flex-col gap-10 py-24 md:flex-row md:items-center md:justify-between md:py-28"
      >
        <div className="max-w-2xl">

          <p
            data-reveal
            className="label text-washi/60"
          >
            Reserve
          </p>

          <h2
            data-reveal
            className="mt-5 font-display text-4xl leading-none md:text-6xl"
          >
            The counter opens at six.
            <br />
            Reserve before it fills.
          </h2>

          <InkStroke
            trigger="scroll"
            data-reveal
            className="mt-7 h-4 w-40 text-washi md:w-56"
          />

        </div>

        <div data-reveal>
          <Button
            variant="secondary"
            to="/book"
            className="border-washi text-washi hover:border-washi hover:bg-washi hover:text-shu"
          >
            Reserve a table
          </Button>
        </div>

      </div>
    </section>
  );
}