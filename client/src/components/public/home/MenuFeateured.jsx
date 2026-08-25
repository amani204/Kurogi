
import { useFetch } from "../../../hooks/useFetch";
import { useReveal } from "../../../hooks/gsap/useReveal";
import { fetchMenu } from "../../../features/menu/api";
import { getMenuItemImage } from "../../../features/menu/imageMap";
import { useLang } from "../../../i18n";

const DishCard = ({ item }) => {
  const ref = useReveal();
  const { t } = useLang();

  return (
    <article
      ref={ref}
      className="group opacity-0"
    >
      <div className="overflow-hidden">
        <img
          src={getMenuItemImage(item.name)}
          alt={item.name}
          loading="lazy"
          className="
            aspect-4/5
            w-full
            object-cover
            grayscale-12
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
  const { t } = useLang();

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
        {t("featuredDishes.loading")}
      </section>
    );
  }

  if (error || !items?.length) {
    return null;
  }

  return (
    <section className="shell pb-16 md:pb-24">
      <p className="label text-shu">
        {t("featuredDishes.eyebrow")}
      </p>

      <h2 className="mt-5 max-w-2xl font-display text-4xl leading-tight md:text-5xl">
        {t("featuredDishes.title")}
      </h2>

      <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground md:text-base">
        {t("featuredDishes.description")}
      </p>

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

