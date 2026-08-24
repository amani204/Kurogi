import { useFetch } from "../../../hooks/useFetch";
import { useReveal } from "../../../hooks/useReveal";

import { fetchMenu } from "../../../features/menu/api";
import { getMenuItemImage } from "../../../features/menu/imageMap";

const DishCard = ({ item }) => {
  const ref = useReveal();

  return (
    <article ref={ref} className="group opacity-0">
      <div className="overflow-hidden">
        <img
          src={getMenuItemImage(item.name)}
          alt={item.name}
          loading="lazy"
          className="
            aspect-[4/5]
            w-full
            object-cover
            grayscale-[12%]
            brightness-90
            transition-all
            duration-700
            group-hover:grayscale-0
            group-hover:brightness-100
            group-hover:scale-[1.02]
          "
        />
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-xl leading-tight text-sumi">
          {item.name}
        </h3>

        <span className="font-mono text-sm text-sumi whitespace-nowrap">
          {item.price} DA
        </span>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-sumi/60">
        {item.description}
      </p>
    </article>
  );
};

const FeaturedDishes = () => {
  const {
    data: items,
    loading,
    error,
  } = useFetch(
    () => fetchMenu({ featured: true }),
    []
  );

  if (loading) {
    return (
      <section className="shell py-28 text-center text-sumi/40">
        Loading...
      </section>
    );
  }

  if (error || !items?.length) {
    return null;
  }

  return (
    <section className="shell py-28 md:py-40">
      <p className="label text-shu">
        Signatures
      </p>

      <h2 className="mt-5 font-display text-4xl leading-tight md:text-5xl">
        Six things worth crossing town for
      </h2>

      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <DishCard
            key={item._id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedDishes;