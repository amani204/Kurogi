import { useState } from "react";
import { useLang } from "../../i18n";
import { useFetch } from "../../hooks/useFetch";
import { useReveal } from "../../hooks/gsap/useReveal";
import { useCart } from '../../features/orders/context/CartContext';
import { fetchMenu, fetchCategories } from "../../features/menu/api";
import { getMenuItemImage } from "../../features/menu/imageMap";
import { SectionDivider } from "../../components/public/InkStroke";

const MenuRow = ({ item }) => {
  const ref = useReveal();
  const { addItem } = useCart();
  const { t } = useLang();

  const handleAdd = () => {
    addItem({
      id: item._id,
      name: item.name,
      price: item.price,
      image: getMenuItemImage(item.name),
    });
  };

  return (
    <li ref={ref} className="flex gap-5 border-t border-gin/40 py-7">
      <img
        src={getMenuItemImage(item.name)}
        alt={item.name}
        loading="lazy"
        className="h-24 w-24 shrink-0 object-cover grayscale-15"
      />
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className={`font-display text-xl leading-tight ${item.available ? "text-sumi" : "text-sumi/40"}`}>
            {item.name}
          </h2>
          <span className="font-mono text-sm whitespace-nowrap text-sumi">
            {item.price} DA
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-sumi/60">
          {item.description}
        </p>
        <div className="mt-4 flex items-center gap-4">
          {!item.available ? (
            <span className="label text-sumi/40">{t("menuPage.soldOut")}</span>
          ) : (
            <button
              className="hairline-link label"
              onClick={handleAdd}
              disabled={!item.available}
              aria-label={`Add ${item.name} to cart`}
            >
              {t("menuPage.addToOrder")}
            </button>
          )}
        </div>
      </div>
    </li>
  );
};

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const { t } = useLang();

  const { data: categories, loading: categoriesLoading } = useFetch(fetchCategories, []);
  const { data: items, loading: itemsLoading } = useFetch(
    () => fetchMenu({ category: activeCategory }),
    [activeCategory]
  );

  return (
    <main className="pt-24 md:pt-32">
      <header className="shell">
        <p className="label text-shu">{t("menuPage.eyebrow")}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          {t("menuPage.title")}
        </h1>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-sumi/60">
          {t("menuPage.description")}
        </p>
      </header>

      <SectionDivider className="my-12" />

      <div className="shell flex flex-wrap gap-x-8 gap-y-3">
        <button
          onClick={() => setActiveCategory(null)}
          className={`hairline-link label ${activeCategory === null ? "text-sumi" : "text-sumi/50"}`}
        >
          {t("menuPage.all")}
        </button>
        {!categoriesLoading &&
          categories?.map((category) => (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category.slug)}
              className={`hairline-link label ${activeCategory === category.slug ? "text-sumi" : "text-sumi/50"}`}
            >
              {category.label}
            </button>
          ))}
      </div>

      {itemsLoading ? (
        <div className="shell py-20 text-center text-sumi/40">{t("menuPage.loading")}</div>
      ) : items?.length ? (
        <ul className="shell mt-10 grid gap-x-10 md:grid-cols-2">
          {items.map((item) => (
            <MenuRow key={item._id} item={item} />
          ))}
        </ul>
      ) : (
        <div className="shell py-20 text-center text-sumi/40">{t("menuPage.emptyCategory")}</div>
      )}

      <div className="h-24" />
    </main>
  );
};

export default Menu;