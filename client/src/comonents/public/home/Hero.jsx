import { useEffect, useRef } from "react";
import Button from "../../ui/Button";
import {InkStroke} from "../InkStroke";
import heroImage from "../../../assets/hero-suchi.jpg";

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const element = heroRef.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx;
    let cancelled = false;

    const init = async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.to(".hero-image", { scale: 1.1, duration: 20, ease: "none" });

        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero-eyebrow", { opacity: 0, y: 30, duration: 1 })
          .from(".hero-title-line", { opacity: 0, y: 80, duration: 1.2, stagger: 0.3, ease: "power3.out" }, "-=0.6")
          .from(".hero-copy", { opacity: 0, y: 40, duration: 1 }, "-=0.4")
          .from(".hero-actions", { opacity: 0, y: 30, duration: 0.8, stagger: 0.15 }, "-=0.3")
          .from(".scroll-indicator", { opacity: 0, duration: 1 }, "-=0.8");
      }, element);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section ref={heroRef} className="relative h-[180vh] text-washi">
      {/* Pinned image layer */}
      <div className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-sumi">
        <div
          className="hero-image absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-sumi/80 via-sumi/40 to-transparent" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-sumi/60" />

        <div className="scroll-indicator absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="label text-[0.6rem] tracking-[0.3em] text-washi/40">SCROLL</span>
          <div className="h-12 w-px bg-washi/20">
            <div className="h-1/2 w-px animate-scrollLine bg-washi/60" />
          </div>
        </div>
      </div>

<div className="absolute inset-x-0 top-0 z-10 flex h-screen items-end pb-24 pt-32 md:pb-32">
  <div className="shell w-full text-washi">
    <div className="max-w-3xl">
      <p className="hero-eyebrow label text-washi/70">
        Edomae · Paris 1er
      </p>

      <h1 className="hero-title mt-6 max-w-3xl font-display text-6xl leading-[0.92] md:text-8xl">
        <span className="hero-title-line inline">
          Twelve seats,{" "}
        </span>
        <span className="hero-title-line inline">
          one counter,{" "}
        </span>
        <span className="hero-title-line inline">
          nothing extra.
        </span>
      </h1>

      <InkStroke
        className="mt-4 h-5 w-64 text-shu"
        trigger="mount"
      />

      <p className="hero-copy mt-8 max-w-lg text-sm leading-relaxed text-washi/70 md:text-base">
        Fish flown from Toyosu twice a week. Rice seasoned with red
        vinegar. Served the moment it is cut.
      </p>

      <div className="hero-actions mt-10 flex flex-wrap gap-4">
        <Button
          to="/book"
          variant="primary"
        >
          Reserve a seat
        </Button>

        <Button
          to="/menu"
          variant="secondary"
          className="border-washi/40 text-washi hover:border-washi hover:bg-washi hover:text-sumi"
        >
          See the menu
        </Button>
      </div>
    </div>
  </div>
      </div>
    </section>
  );
}