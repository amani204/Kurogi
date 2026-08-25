import { useEffect, useRef } from "react";

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  );
}

export function useInkDraw(
  trigger = "scroll",
  delay = 0
) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const strokes = Array.from(
      element.querySelectorAll("path, line")
    );

    if (!strokes.length) return;

    if (prefersReducedMotion()) {
      strokes.forEach((stroke) => {
        stroke.style.strokeDashoffset = "0";
      });

      return;
    }

    let cleanup = () => {};
    let cancelled = false;

    const initAnimation = async () => {
      const [{ gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const tween = gsap.to(strokes, {
        strokeDashoffset: 0,
        duration: 1.4,
        delay,
        ease: "power2.inOut",
        stagger: 0.12,

        ...(trigger === "scroll" && {
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
          },
        }),
      });

      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    };

    initAnimation();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [trigger, delay]);

  return ref;
}