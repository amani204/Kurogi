import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

import heroImage from "../../assets/hero-suchi.jpg";
import { useParallax } from "../../hooks/useParallax";
import { InkStroke } from "./InkStroke";

export default function Hero() {
  const heroRef = useRef(null);
  const imageRef = useParallax(90);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let ctx = null;
    let cancelled = false;

    const init = async () => {
      if (cancelled) return;

      const { gsap } = await import("gsap");

      if (cancelled) return;

      ctx = gsap.context(() => {
        const timeline = gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        });

        timeline
          .from(".hero-eyebrow", {
            opacity: 0,
            y: 20,
            duration: 0.7,
          })
          .from(
            ".hero-title-line",
            {
              opacity: 0,
              y: 70,
              duration: 1,
              stagger: 0.12,
            },
            "-=0.35"
          )
          .from(
            ".hero-copy",
            {
              opacity: 0,
              y: 25,
              duration: 0.8,
            },
            "-=0.5"
          )
          .from(
            ".hero-actions",
            {
              opacity: 0,
              y: 20,
              duration: 0.7,
            },
            "-=0.4"
          )
          .from(
            ".hero-image",
            {
              opacity: 0,
              scale: 1.08,
              duration: 1.8,
              ease: "power2.out",
            },
            "-=1"
          );
      }, element);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  // rest of component unchanged...
  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-sumi text-washi"
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={imageRef}
          className="hero-image absolute -inset-[8%] bg-cover bg-center"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />

        <div className="absolute inset-0 bg-sumi/45" />
      </div>

      {/* Content */}
      <div className="shell relative z-10 flex min-h-screen items-end pb-20 pt-32 md:pb-28">
        <div className="max-w-5xl">
          <p className="hero-eyebrow label mb-8 text-washi/70">
            Japanese dining · Tokyo inspired
          </p>

          <h1 className="max-w-4xl text-6xl leading-[0.9] md:text-8xl lg:text-[9rem]">
            <span className="hero-title-line block">
              Precision
            </span>

            <span className="hero-title-line block">
              on the plate.
            </span>
          </h1>

          <div className="mt-8 max-w-xl">
            <p className="hero-copy text-base leading-relaxed text-washi/75 md:text-lg">
              Seasonal ingredients, considered preparation,
              and nothing on the plate that isn't necessary.
            </p>

            <InkStroke
              trigger="load"
              className="mt-5 h-4 w-48 text-shu md:w-64"
            />
          </div>

          <div className="hero-actions mt-10 flex flex-wrap gap-3">
            <Link
              to="/book"
              className="label bg-shu px-7 py-4 text-washi transition-colors hover:bg-washi hover:text-sumi"
            >
              Reserve
            </Link>

            <Link
              to="/menu"
              className="label border border-washi/40 px-7 py-4 text-washi transition-colors hover:border-washi hover:bg-washi hover:text-sumi"
            >
              View menu
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-6 z-10 hidden md:block">
        <p className="label rotate-90 text-washi/50">
          Scroll
        </p>
      </div>
    </section>
  );
}