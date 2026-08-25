import { useEffect, useRef } from "react";

import Button from "../../../components/ui/Button";
import { InkStroke } from "../../../components/public/InkStroke";

import heroImage from "../../../assets/home/hero-suchi.jpg";

import { useLang } from "../../../i18n";

export default function Hero() {
  const heroRef = useRef(null);
  const { t } = useLang();

  useEffect(() => {
    const element = heroRef.current;

    if (!element) return;

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let ctx;
    let cancelled = false;

    const init = async () => {
      const { gsap } = await import("gsap");

      if (cancelled) return;

      ctx = gsap.context(() => {
        // Slow cinematic image movement
        gsap.to(".hero-image", {
          scale: 1.1,
          duration: 20,
          ease: "none",
        });

        // Content entrance animation
        const tl = gsap.timeline({
          defaults: {
            ease: "power4.out",
          },
        });

        tl.from(".hero-eyebrow", {
          opacity: 0,
          y: 30,
          duration: 1,
        })
          .from(
            ".hero-title-line",
            {
              opacity: 0,
              y: 80,
              duration: 1.2,
              stagger: 0.3,
              ease: "power3.out",
            },
            "-=0.6"
          )
          .from(
            ".hero-copy",
            {
              opacity: 0,
              y: 40,
              duration: 1,
            },
            "-=0.4"
          )
          .from(
            ".hero-actions",
            {
              opacity: 0,
              y: 30,
              duration: 0.8,
              stagger: 0.15,
            },
            "-=0.3"
          )
          .from(
            ".scroll-indicator",
            {
              opacity: 0,
              duration: 1,
            },
            "-=0.8"
          );
      }, element);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[180vh] text-washi"
    >
      {/* Pinned image layer */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-sumi">
        {/* Hero image */}
        <div
          className="hero-image absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-sumi/80 via-sumi/40 to-transparent" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-sumi/60" />

        {/* Scroll indicator */}
        <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="label text-[0.6rem] tracking-[0.3em] text-washi/40">
            {t("hero.scroll")}
          </span>

          <div className="h-12 w-px bg-washi/20">
            <div className="h-1/2 w-px animate-scrollLine bg-washi/60" />
          </div>
        </div>
      </div>

      {/* Hero content */}
      <div className="absolute inset-x-0 top-0 z-10 flex h-screen items-end pb-24 pt-32 md:pb-32">
        <div className="shell w-full text-washi">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <p className="hero-eyebrow label text-washi/70">
              {t("hero.eyebrow")}
            </p>

            {/* Title */}
            <h1 className="hero-title mt-6 max-w-3xl font-display text-6xl leading-[0.92] md:text-8xl">
              <span className="hero-title-line inline">
                {t("hero.titleLine1")}{" "}
              </span>

              <span className="hero-title-line inline">
                {t("hero.titleLine2")}{" "}
              </span>

              <span className="hero-title-line inline">
                {t("hero.titleLine3")}
              </span>
            </h1>

            {/* Decorative stroke */}
            <InkStroke
              className="mt-4 h-5 w-64 text-shu"
              trigger="mount"
            />

            {/* Description */}
            <p className="hero-copy mt-8 max-w-lg text-sm leading-relaxed text-washi/70 md:text-base">
              {t("hero.description")}
            </p>

            {/* Actions */}
            <div className="hero-actions mt-10 flex flex-wrap gap-4">
              <Button
                to="/booking"
                variant="primary"
              >
                {t("hero.reserve")}
              </Button>

              <Button
                to="/menu"
                variant="secondary"
                className="border-washi/40 text-washi hover:border-washi hover:bg-washi hover:text-sumi"
              >
                {t("hero.menu")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}