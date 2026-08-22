import { useEffect, useRef } from "react";

export function useParallax(amount = 80) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let ctx = null;
    let cancelled = false;

    const init = async () => {
      if (cancelled) return;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(element, {
          y: amount,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }, element);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [amount]);

  return ref;
}