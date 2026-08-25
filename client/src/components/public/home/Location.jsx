import { Link } from "react-router-dom";
import { useReveal } from "../../../hooks/gsap/useReveal";
import ambienceImage from "../../../assets/home/ambience.jpg";
import { hours, restaurant } from "../../../features/restaurant/data";

export default function Location() {
  const contentRef = useReveal({
    children: "[data-reveal]",
    y: 30,
    stagger: 0.1,
  });

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[65vh] min-h-130">
        {/* Background image */}
        <img
          src={ambienceImage}
          alt="The restaurant dining room"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover grayscale-20"
        />
        <div className="absolute inset-0 bg-sumi/65" />
        <div
          ref={contentRef}
          className="shell relative z-10 flex h-full flex-col justify-center text-washi"
        >
          <div className="max-w-xl">
            <p data-reveal className="label text-washi/60">
              FIND US
            </p>
            <p
              data-reveal
              className="mt-4 text-sm leading-relaxed text-washi/70"
            >
              {restaurant.address}
            </p>
            <dl data-reveal className="mt-6 max-w-sm space-y-2">
              {hours.map((hour) => (
                <div
                  key={hour.day}
                  className="flex justify-between gap-8 border-b border-washi/15 pb-2 text-sm"
                >
                  <dt className="label text-washi/60">{hour.day}</dt>
                  <dd className="num text-xs text-washi/75">{hour.time}</dd>
                </div>
              ))}
            </dl>
            <Link
              data-reveal
              to="/contact"
              className="hairline-link label mt-8 inline-block text-washi"
            >
              DIRECTIONS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}