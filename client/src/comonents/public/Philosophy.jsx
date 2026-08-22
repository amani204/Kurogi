import { useReveal } from "../../hooks/useReveal";
import { useParallax } from "../../hooks/useParallax";
import philosophyImage from "../../assets/chef.jpg";

export default function Philosophy() {
  const contentRef = useReveal({
    children: ".philosophy-reveal",
    y: 35,
    stagger: 0.12,
  });

  const imageRef = useParallax(70);

  return (
    <section className="overflow-hidden py-28 md:py-40">
      <div className="shell">
        <div className="grid gap-16 md:grid-cols-12 md:items-center">

          {/* Text */}
          <div
            ref={contentRef}
            className="md:col-span-4 md:col-start-1"
          >
            <p className="philosophy-reveal label text-shu">
              01 — Philosophy
            </p>

            <h2 className="philosophy-reveal mt-8 text-5xl md:text-6xl">
              Less,
              <br />
              but better.
            </h2>

            <p className="philosophy-reveal mt-8 text-sm leading-7 text-muted-foreground md:text-base">
              We believe precision is a form of respect.
              Every ingredient is selected for its season,
              every cut has intention, and every plate leaves
              room for the ingredient to speak.
            </p>

            <p className="philosophy-reveal mt-6 text-sm leading-7 text-muted-foreground md:text-base">
              The result is deliberately simple: clean
              flavours, quiet technique, and an experience
              that rewards attention.
            </p>
          </div>

          {/* Image */}
          <div className="relative md:col-span-7 md:col-start-6">
            <div className="aspect-[4/5] overflow-hidden bg-nori">
              <div
                ref={imageRef}
                className="h-[115%] w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${philosophyImage})`,
                }}
              />
            </div>

            <p className="label mt-4 text-muted-foreground">
              Seasonal craft · precise preparation
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}