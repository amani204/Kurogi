import { Link } from "react-router-dom";

import { useReveal } from "../../../hooks/gsap/useReveal";
import { useParallax } from "../../../hooks/gsap/useParallax";

import {
  InkStroke,
  SectionDivider,
} from "../../../components/public/InkStroke";

import chefImage from "../../../assets/home/chef.jpg";

import { useLang } from "../../../i18n";

export default function Philosophy() {
  const { t } = useLang();

  const contentRef = useReveal({
    children: ".philosophy-reveal",
    y: 35,
    stagger: 0.12,
  });

  const imageRef = useParallax(70);

  return (
    <section className="overflow-hidden pt-16 pb-28 md:pt-24 md:pb-36">
      <div className="shell">
        <div className="grid gap-16 md:grid-cols-12 md:items-center">
          {/* Text */}
          <div
            ref={contentRef}
            className="md:col-span-4 md:col-start-1"
          >
            <p className="philosophy-reveal label text-shu">
              {t("philosophy.eyebrow")}
            </p>

            <h2 className="philosophy-reveal mt-8 font-display text-5xl leading-[0.95] md:text-6xl">
              {t("philosophy.title")}
            </h2>

            <InkStroke
              trigger="scroll"
              className="philosophy-reveal mt-6 h-4 w-32 text-shu"
            />

            <p className="philosophy-reveal mt-8 text-sm leading-7 text-muted-foreground md:text-base">
              {t("philosophy.paragraph1")}
            </p>

            <p className="philosophy-reveal mt-6 text-sm leading-7 text-muted-foreground md:text-base">
              {t("philosophy.paragraph2")}
            </p>

            <Link
              to="/gallery"
              className="philosophy-reveal hairline-link label mt-8 inline-block"
            >
              {t("philosophy.link")}
            </Link>
          </div>

          {/* Image */}
          <div className="relative md:col-span-7 md:col-start-6">
            <div className="aspect-4/5 overflow-hidden bg-nori">
              <img
                ref={imageRef}
                src={chefImage}
                alt={t("philosophy.imageAlt")}
                loading="lazy"
                className="h-[115%] w-full object-cover grayscale-[15%]"
              />
            </div>
          </div>
        </div>
      </div>

      <SectionDivider className="mt-12" />
    </section>
  );
}