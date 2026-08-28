import { Link } from "react-router-dom";
import { Trash2, X } from "lucide-react";

import { useCart } from "../../features/orders/context/CartContext";
import { formatPrice } from "../../features/menu/utils/formatPrice";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { useLang } from "../../i18n";

export default function CartDrawer() {
  const { lines, total, setQty, removeItem, open, setOpen } = useCart();
  const { t, lang } = useLang();

  return (
    <>
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-60 bg-sumi/40 backdrop-blur-[2px] transition-opacity duration-500",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-washi",
          "border-l border-border",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-6">
          <div>
            <p className="label text-shu">{t("cart.eyebrow")}</p>
            <h2 className="mt-1 font-display text-2xl leading-none">
              {t("cart.title")}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("cart.close")}
            className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-sumi hover:bg-sumi hover:text-washi"
          >
            <X className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="py-20">
              <p className="label text-muted-foreground">{t("cart.emptyTitle")}</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t("cart.emptyDescription")}
              </p>
              <Link
                to="/menu"
                onClick={() => setOpen(false)}
                className="hairline-link label mt-6 inline-block text-shu"
              >
                {t("cart.browseMenu")}
              </Link>
            </div>
          ) : (
            <ul>
              {lines.map(({ item, qty }) => {
                const name = typeof item.name === 'string' ? item.name : (item.name[lang] || item.name.en);
                return (
                  <li key={item.id} className="group flex gap-4 border-b border-border py-6">
                    <div className="h-20 w-20 shrink-0 overflow-hidden">
                      <img
                        src={item.image}
                        alt={name}
                        loading="lazy"
                        className="h-full w-full object-cover grayscale-[12%] transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg leading-tight">{name}</p>
                      <p className="num mt-2 text-xs text-muted-foreground">
                        {formatPrice(item.price)}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex items-center border border-border">
                          <button
                            type="button"
                            className="num px-3 py-1.5 text-xs transition-colors hover:bg-sumi hover:text-washi"
                            onClick={() => setQty(item.id, qty - 1)}
                            aria-label={t("cart.decrease", { name })}
                          >
                            −
                          </button>
                          <span className="num w-8 text-center text-xs">{qty}</span>
                          <button
                            type="button"
                            className="num px-3 py-1.5 text-xs transition-colors hover:bg-sumi hover:text-washi"
                            onClick={() => setQty(item.id, qty + 1)}
                            aria-label={t("cart.increase", { name })}
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label={t("cart.remove", { name })}
                          className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-shu"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.25} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <footer className="border-t border-border px-6 py-6">
          <div className="flex items-baseline justify-between">
            <span className="label text-muted-foreground">{t("cart.total")}</span>
            <span className="num text-lg">{formatPrice(total)}</span>
          </div>

          <div className="mt-6">
            <Button to="/order" variant="primary" className="w-full" onClick={() => setOpen(false)}>
              {t("cart.checkout")}
            </Button>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            {t("cart.note")}
          </p>
        </footer>
      </aside>
    </>
  );
}