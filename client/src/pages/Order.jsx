import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../features/orders/context/CartContext";
import { useFetch } from "../hooks/useFetch";
import { fetchDeliveryZones, submitOrder } from "../features/orders/api";
import { formatPrice } from "../features/menu/formatPrice";
import Button from "../comonents/ui/Button";
import { InkCheck } from "../comonents/public/InkStroke";

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  fulfillment: "pickup",
  wilaya: "",
  address: "",
  notes: "",
};

const Order = () => {
  const { lines, total: cartTotal, clearCart } = useCart();

  const { data: zones, loading: zonesLoading } = useFetch(
    fetchDeliveryZones,
    []
  );

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const selectedZone = useMemo(
    () => zones?.find((z) => z._id === form.wilaya) || null,
    [zones, form.wilaya]
  );

  const deliveryFee =
    form.fulfillment === "delivery" ? selectedZone?.price || 0 : 0;

  const estimatedTotal = cartTotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) {
      return setError("Your cart is empty.");
    }

    if (form.fulfillment === "delivery" && !form.wilaya) {
      return setError("Please select a delivery zone.");
    }

    setSubmitting(true);

    try {
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email || undefined,
        fulfillment: form.fulfillment,
        address:
          form.fulfillment === "delivery" ? form.address : undefined,
        deliveryZoneId:
          form.fulfillment === "delivery" ? form.wilaya : undefined,
        notes: form.notes || undefined,

        items: lines.map((line) => ({
          menuItemId: line.item.id,
          quantity: line.qty,
        })),
      };

      const data = await submitOrder(payload);

      setResult(data);
      clearCart();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong placing your order. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- SUCCESS ---------------- */

  if (result) {
    const { order, whatsappLink } = result;

    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <InkCheck className="h-20 w-24 text-shu" />

        <h1 className="mt-8 font-display text-4xl md:text-5xl">
          Order placed
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you, {order.customerName}. Your total is{" "}
          <span className="num text-shu">
            {formatPrice(order.totalPrice)}
          </span>
          , payable on{" "}
          {order.fulfillment === "delivery" ? "delivery" : "pickup"}.
        </p>

        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-10 bg-shu px-6 py-4 text-washi transition-colors hover:bg-sumi"
        >
          Confirm on WhatsApp
        </a>

        <p className="mt-6 text-sm text-muted-foreground">
          Need to make a change?{" "}
          <Link
            to={`/order-cancel/${order.cancelToken}`}
            className="hairline-link text-foreground"
          >
            Cancel this order
          </Link>
        </p>
      </main>
    );
  }

  /* ---------------- EMPTY CART ---------------- */

  if (lines.length === 0) {
    return (
      <main className="pt-24 md:pt-32">
        <header className="shell">
          <p className="label text-shu">Pickup & delivery</p>

          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            Order online
          </h1>
        </header>

        <div className="shell">
          <div className="my-12 h-px bg-border" />
        </div>

        <section className="shell pb-28">
          <p className="text-sm text-muted-foreground">
            Your basket is empty.{" "}
            <Link
              to="/menu"
              className="hairline-link text-foreground"
            >
              Browse the menu
            </Link>
            .
          </p>
        </section>
      </main>
    );
  }

  /* ---------------- ORDER PAGE ---------------- */

  return (
    <main className="pt-24 md:pt-32">

      {/* Header */}
      <header className="shell">
        <p className="label text-shu">Pickup & delivery</p>

        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          Order online
        </h1>
      </header>

      {/* Divider */}
      <div className="shell">
        <div className="my-12 h-px bg-border" />
      </div>

      <div className="shell grid gap-16 pb-28 md:grid-cols-[1fr_0.8fr]">

        {/* LEFT — BASKET */}

        <section>
          <p className="label text-muted-foreground">
            Your basket
          </p>

          <ul className="mt-6">

            {lines.map(({ item, qty }) => (
              <li
                key={item.id}
                className="flex items-center gap-5 border-t border-border py-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-16 w-16 shrink-0 object-cover grayscale-[15%]"
                />

                <div className="flex-1">
                  <p className="font-display text-lg leading-tight">
                    {item.name}
                  </p>

                  <p className="num mt-1 text-xs text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex items-center border border-border">
                  <span className="num px-3 py-1 text-xs">
                    ×{qty}
                  </span>
                </div>
              </li>
            ))}

          </ul>
        </section>

        {/* RIGHT — FORM */}

        <aside>

          {/* Pickup / Delivery */}

          <div className="flex gap-6">

            {["pickup", "delivery"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    fulfillment: option,
                  }))
                }
                data-active={form.fulfillment === option}
                className="hairline-link label text-muted-foreground data-[active=true]:text-foreground"
              >
                {option}
              </button>
            ))}

          </div>

          {/* Customer fields */}

          <div className="mt-8 grid gap-6">

            <label className="block">
              <span className="label text-muted-foreground">
                Name
              </span>

              <input
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            <label className="block">
              <span className="label text-muted-foreground">
                Phone
              </span>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            <label className="block">
              <span className="label text-muted-foreground">
                Email
              </span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

            {/* Delivery fields */}

            {form.fulfillment === "delivery" && (
              <>
                <label className="block">
                  <span className="label text-muted-foreground">
                    Wilaya
                  </span>

                  <select
                    name="wilaya"
                    value={form.wilaya}
                    onChange={handleChange}
                    className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                  >
                    <option value="" disabled>
                      {zonesLoading
                        ? "Loading..."
                        : "Select your wilaya"}
                    </option>

                    {zones?.map((zone) => (
                      <option key={zone._id} value={zone._id}>
                        {zone.wilaya} — {formatPrice(zone.price)}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="label text-muted-foreground">
                    Address
                  </span>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={2}
                    className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                  />
                </label>
              </>
            )}

            <label className="block">
              <span className="label text-muted-foreground">
                Notes
              </span>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
              />
            </label>

          </div>

          {/* TOTAL */}

          <dl className="mt-10 space-y-2">

            <Row
              label="Subtotal"
              value={formatPrice(cartTotal)}
            />

            <Row
              label={
                form.fulfillment === "delivery"
                  ? "Delivery"
                  : "Pickup"
              }
              value={
                form.fulfillment === "delivery"
                  ? formatPrice(deliveryFee)
                  : "—"
              }
            />

            <Row
              label="Total"
              value={formatPrice(estimatedTotal)}
              strong
            />

          </dl>

          {/* ERROR */}

          {error && (
            <p className="mt-6 text-sm text-shu">
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
            className="mt-8 w-full"
            onClick={handleSubmit}
          >
            {submitting
              ? "Placing order..."
              : `Place order — Cash on ${
                  form.fulfillment === "delivery"
                    ? "Delivery"
                    : "Pickup"
                }`}
          </Button>

        </aside>
      </div>
    </main>
  );
};

function Row({ label, value, strong }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-2">
      <dt className="label text-muted-foreground">
        {label}
      </dt>

      <dd
        className={
          strong ? "num text-lg" : "num text-xs"
        }
      >
        {value}
      </dd>
    </div>
  );
}

export default Order;