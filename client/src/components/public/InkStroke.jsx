import { cn } from "../../lib/utils";
import { useInkDraw } from "../../hooks/gsap/useInkDraw";

export function InkStroke({
  className,
  trigger = "scroll",
  delay = 0,
}) {
  const ref = useInkDraw(trigger, delay);

  return (
    <span
      ref={ref}
      className={cn("ink-draw block", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 26"
        fill="none"
        className="h-full w-full"
      >
        <path
          d="M4 18C60 8 118 5 186 7c62 2 118 9 180 11 58 2 118-2 226-12"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          style={{ "--dash": 640 }}
        />
      </svg>
    </span>
  );
}

export function InkCheck({ className }) {
  const ref = useInkDraw("load", 0.15);

  return (
    <span
      ref={ref}
      className={cn("ink-draw block", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 90"
        fill="none"
        className="h-full w-full"
      >
        <path
          d="M10 48c9 4 20 14 30 27C56 47 76 21 110 6"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ "--dash": 200 }}
        />
      </svg>
    </span>
  );
}

export function SectionDivider({ className }) {
  return (
    <div className={cn("shell", className)}>
      <div className="flex items-center gap-6">
        <div className="h-px flex-1 bg-border" />

        <InkStroke className="h-4 w-24 text-shu" />

        <div className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}