import { useEffect, useRef } from "react";

export function useReveal({
  y = 30,
  duration = 0.9,
  stagger = 0.1,
  start = "top 85%",
  children,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const targets = children
      ? Array.from(element.querySelectorAll(children))
      : [element];
    if (!targets.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion) {
      targets.forEach((target) => {
        target.style.opacity = "1";
        target.style.transform = "none";
      });
      return;
    }

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
        gsap.fromTo(
          targets,
          { opacity: 0, y },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start,
              once: true,
            },
          }
        );
      }, element);
    };

    init();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [y, duration, stagger, start, children]);

  return ref;
}