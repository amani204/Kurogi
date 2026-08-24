import { Link } from "react-router-dom";
import { useReveal } from "../../../hooks/useReveal";
import { useParallax } from "../../../hooks/useParallax";
import { InkStroke } from "../InkStroke";
import { SectionDivider } from "../InkStroke";
import chefImage from "../../../assets/chef.jpg";
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
              Philosophy
            </p>

            <h2 className="philosophy-reveal mt-8 font-display text-5xl leading-[0.95] md:text-6xl">
              Less, but better.
            </h2>

            <InkStroke
              trigger="scroll"
              className="philosophy-reveal mt-6 h-4 w-32 text-shu"
            />

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

            <Link
              to="/gallery"
              className="philosophy-reveal hairline-link label mt-8 inline-block"
            >
              Inside the room
            </Link>
          </div>

          {/* Image */}
          <div className="relative md:col-span-7 md:col-start-6">
            <div className="aspect-4/5 overflow-hidden bg-nori">
              <img
                ref={imageRef}
                src={chefImage}
                alt="Chef preparing sushi behind the counter"
                loading="lazy"
                className="h-[115%] w-full object-cover grayscale-[15%]"
              />
            </div>
          </div>
  
        </div>
       
      </div>
    </section>
  );
}