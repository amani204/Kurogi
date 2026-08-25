import { Link } from "react-router-dom";
import { X } from "lucide-react";

import { useCart } from "../../features/orders/context/CartContext";
import { formatPrice } from "../../features/menu/formatPrice";
import Button from "../ui/Button";
import { cn } from "../../lib/utils";

export default function CartDrawer() {
  const { lines, total, setQty, open, setOpen } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-sumi/40 backdrop-blur-[2px] transition-opacity duration-500",
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-washi",
          "border-l border-border",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-6 py-6">
          <div>
            <p className="label text-shu">The counter</p>
            <h2 className="mt-1 font-display text-2xl leading-none">
              Your order
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="flex h-9 w-9 items-center justify-center border border-border transition-colors hover:border-sumi hover:bg-sumi hover:text-washi"
          >
            <X
              className="h-4 w-4"
              strokeWidth={1.25}
            />
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="py-20">
              <p className="label text-muted-foreground">
                Nothing here yet
              </p>

              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                The counter is waiting. Browse the menu and choose
                something for your table.
              </p>

              <Link
                to="/menu"
                onClick={() => setOpen(false)}
                className="hairline-link label mt-6 inline-block text-shu"
              >
                Browse the menu
              </Link>
            </div>
          ) : (
            <ul>
              {lines.map(({ item, qty }) => (
                <li
                  key={item.id}
                  className="group flex gap-4 border-b border-border py-6"
                >
                  {/* Image */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[12%] transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg leading-tight">
                      {item.name}
                    </p>

                    <p className="num mt-2 text-xs text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity */}
                    <div className="mt-4 flex items-center border border-border w-fit">
                      <button
                        type="button"
                        className="num px-3 py-1.5 text-xs transition-colors hover:bg-sumi hover:text-washi"
                        onClick={() => setQty(item.id, qty - 1)}
                        aria-label={`Decrease ${item.name}`}
                      >
                        −
                      </button>

                      <span className="num w-8 text-center text-xs">
                        {qty}
                      </span>

                      <button
                        type="button"
                        className="num px-3 py-1.5 text-xs transition-colors hover:bg-sumi hover:text-washi"
                        onClick={() => setQty(item.id, qty + 1)}
                        aria-label={`Increase ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border px-6 py-6">
          <div className="flex items-baseline justify-between">
            <span className="label text-muted-foreground">
              Total
            </span>

            <span className="num text-lg">
              {formatPrice(total)}
            </span>
          </div>

          <div className="mt-6">
            <Button
              to="/order"
              variant="primary"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Checkout
            </Button>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Pickup or delivery available.
          </p>
        </footer>
      </aside>
    </>
  );
}