import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useCart } from "../../features/orders/context/CartContext";
import { formatPrice } from "../../features/menu/formatPrice";
import { cn } from "../../lib/utils";

export default function CartDrawer() {
  const { lines, total, setQty, open, setOpen } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-sumi/50 transition-opacity duration-400",
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-washi transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="label">Your order</p>

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
            className="transition-opacity hover:opacity-60"
          >
            <X className="h-4 w-4" strokeWidth={1.25} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <p className="py-16 text-sm text-muted-foreground">
              Nothing here yet. The menu is a good place to start.
            </p>
          ) : (
            <ul>
              {lines.map(({ item, qty }) => (
                <li
                  key={item.id}
                  className="flex gap-4 border-b border-border py-5"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-16 w-16 object-cover grayscale-[15%]"
                  />

                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">
                      {item.name}
                    </p>

                    <p className="num mt-1 text-xs text-muted-foreground">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-start">
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        className="num px-2 py-1 text-xs hover:bg-sumi hover:text-washi"
                        onClick={() => setQty(item.id, qty - 1)}
                        aria-label={`Decrease ${item.name}`}
                      >
                        −
                      </button>

                      <span className="num w-6 text-center text-xs">
                        {qty}
                      </span>

                      <button
                        type="button"
                        className="num px-2 py-1 text-xs hover:bg-sumi hover:text-washi"
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
        <div className="border-t border-border px-6 py-6">
          <div className="flex items-baseline justify-between">
            <span className="label">Total</span>

            <span className="num text-lg">
              {formatPrice(total)}
            </span>
          </div>

          <Link
            to="/order"
            onClick={() => setOpen(false)}
            className="label mt-5 block bg-shu px-6 py-4 text-center text-washi transition-colors hover:bg-sumi"
          >
            Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}