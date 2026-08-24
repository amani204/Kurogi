import { useFetch } from "../hooks/useFetch";
import { useReveal } from "../hooks/useReveal";
import { fetchMenu } from "../features/menu/api";
import { getMenuItemImage } from "../features/menu/imageMap";
const GalleryTile = ({ item, index }) => {
  const ref = useReveal();

  return (
    <figure
      ref={ref}
      className={index % 4 === 0 ? "sm:col-span-2" : ""}
    >
      <div className="group relative overflow-hidden">
        <img
          src={getMenuItemImage(item.name)}
          alt={item.name}
          loading="lazy"
          className="
            w-full
            object-cover
            grayscale-[12%]
            transition-all
            duration-700
            group-hover:scale-105
            group-hover:opacity-90
          "
        />

        <div
          className="
            absolute inset-0
            flex items-end
            bg-gradient-to-t from-sumi/70 via-transparent to-transparent
            opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
          "
        >
          <span className="p-5 font-mono text-xs tracking-widest uppercase text-washi">
            {item.name}
          </span>
        </div>
      </div>

      <figcaption className="label mt-3 text-muted-foreground">
        {item.name}
      </figcaption>
    </figure>
  );
};
const Gallery = () => {
  const {
    data: items,
    loading,
    error,
  } = useFetch(() => fetchMenu({}), []);

  if (loading) {
    return (
      <main className="pt-24 md:pt-32">
        <div className="shell py-32 text-center text-sumi/40">
          Loading...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 md:pt-32">
        <div className="shell py-32 text-center text-sumi/40">
          Couldn't load the gallery.
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 md:pt-32">
      {/* Header */}
      <header className="shell">
        <p className="label text-shu">The room</p>

        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          Gallery
        </h1>
      </header>

      {/* Hairline divider */}
      <div className="shell">
        <div className="my-12 h-px bg-border" />
      </div>

      {/* Gallery */}
      <div className="shell grid gap-8 pb-28 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <GalleryTile
            key={item._id}
            item={item}
            index={index}
          />
        ))}
      </div>
    </main>
  );
};

export default Gallery;