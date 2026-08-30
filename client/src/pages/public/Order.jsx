import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../../i18n";
import { useCart } from "../../features/orders/context/CartContext";
import { useFetch } from "../../hooks/useFetch";
import { fetchDeliveryZones, submitOrder } from "../../features/orders/api";
import { formatPrice } from "../../features/menu/utils/formatPrice";
import Button from "../../components/ui/Button";
import { InkCheck, SectionDivider } from "../../components/public/InkStroke";

const initialForm = {
  customerName: "", phone: "", email: "",
  fulfillment: "pickup", wilaya: "", address: "", notes: "",
};

const Order = () => {
  const { lines, total: cartTotal, clearCart } = useCart();
  const { t, lang } = useLang();

  const { data: zones, loading: zonesLoading } = useFetch(fetchDeliveryZones, []);

  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const selectedZone = useMemo(
    () => zones?.find((z) => z._id === form.wilaya) || null,
    [zones, form.wilaya]
  );

  const deliveryFee = form.fulfillment === "delivery" ? selectedZone?.price || 0 : 0;
  const estimatedTotal = cartTotal + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) return setError(t("orderPage.errors.emptyCart"));
    if (form.fulfillment === "delivery" && !form.wilaya) return setError(t("orderPage.errors.noZone"));

    setSubmitting(true);
    try {
      const payload = {
        customerName: form.customerName,
        phone: form.phone,
        email: form.email || undefined,
        fulfillment: form.fulfillment,
        address: form.fulfillment === "delivery" ? form.address : undefined,
        deliveryZoneId: form.fulfillment === "delivery" ? form.wilaya : undefined,
        notes: form.notes || undefined,
        items: lines.map((line) => ({ menuItemId: line.item.id, quantity: line.qty })),
      };

      const data = await submitOrder(payload);
      setResult(data);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || t("orderPage.errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    const { order, whatsappLink } = result;
    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <InkCheck className="h-20 w-24 text-shu" />

        <h1 className="mt-8 font-display text-4xl md:text-5xl">
          {t("orderPage.successTitle")}
        </h1>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t("orderPage.successMessage", {
            name: order.customerName,
            total: formatPrice(order.totalPrice, lang),
            method: order.fulfillment === "delivery" ? t("orderPage.delivery") : t("orderPage.pickup"),
          })}
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="label mt-10 bg-shu px-6 py-4 text-washi transition-colors hover:bg-sumi"
        >
          {t("orderPage.confirmWhatsApp")}
        </a>

        <p className="mt-6 text-sm text-muted-foreground">
          {t("orderPage.cancelPrompt")}{' '}
          <Link to={`/order-cancel/${order.cancelToken}`} className="hairline-link text-foreground">
            {t("orderPage.cancelLink")}
          </Link>
        </p>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="pt-24 md:pt-32">
        <header className="shell">
          <p className="label text-shu">{t("orderPage.eyebrow")}</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
            {t("orderPage.title")}
          </h1>
        </header>

        <SectionDivider className="my-12" />

        <section className="shell pb-28">
          <p className="text-sm text-muted-foreground">
            {t("orderPage.emptyCartText")}{' '}
            <Link to="/menu" className="hairline-link text-foreground">
              {t("orderPage.browseMenu")}
            </Link>
            .
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24 md:pt-32">
      <header className="shell">
        <p className="label text-shu">{t("orderPage.eyebrow")}</p>
        <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
          {t("orderPage.title")}
        </h1>
      </header>

      <SectionDivider className="my-12" />

      <div className="shell grid gap-16 pb-28 md:grid-cols-[1fr_0.8fr]">
        <section>
          <p className="label text-muted-foreground">{t("orderPage.basketTitle")}</p>
          <ul className="mt-6">
            {lines.map(({ item, qty }) => {
              const name = typeof item.name === 'string' ? item.name : (item.name[lang] || item.name.en);
              return (
                <li key={item.id} className="flex items-center gap-5 border-t border-border py-5">
                  <img
                    src={item.image}
                    alt={name}
                    loading="lazy"
                    className="h-16 w-16 shrink-0 object-cover grayscale-15"
                  />
                  <div className="flex-1">
                    <p className="font-display text-lg leading-tight">{name}</p>
                    <p className="num mt-1 text-xs text-muted-foreground">
                      {formatPrice(item.price, lang)}
                    </p>
                  </div>
                  <div className="flex items-center border border-border">
                    <span className="num px-3 py-1 text-xs">×{qty}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <aside>
          <form onSubmit={handleSubmit}>
            <div className="flex gap-6">
              {["pickup", "delivery"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, fulfillment: option }))}
                  data-active={form.fulfillment === option}
                  className="hairline-link label text-muted-foreground data-[active=true]:text-foreground"
                >
                  {t(`orderPage.fulfillment.${option}`)}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-6">
              <label className="block">
                <span className="label text-muted-foreground">{t("orderPage.nameLabel")}</span>
                <input
                  name="customerName" required value={form.customerName} onChange={handleChange}
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                />
              </label>

              <label className="block">
                <span className="label text-muted-foreground">{t("orderPage.phoneLabel")}</span>
                <input
                  name="phone" required value={form.phone} onChange={handleChange}
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                />
              </label>

              <label className="block">
                <span className="label text-muted-foreground">{t("orderPage.emailLabel")}</span>
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                />
              </label>

              {form.fulfillment === "delivery" && (
                <>
                  <label className="block">
                    <span className="label text-muted-foreground">{t("orderPage.zoneLabel")}</span>
                    <select
                      name="wilaya" required value={form.wilaya} onChange={handleChange}
                      className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                    >
                      <option value="" disabled>
                        {zonesLoading ? t("orderPage.loadingZones") : t("orderPage.selectZone")}
                      </option>
                      {zones?.map((zone) => (
                        <option key={zone._id} value={zone._id}>
                          {zone.wilaya} — {formatPrice(zone.price, lang)}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="label text-muted-foreground">{t("orderPage.addressLabel")}</span>
                    <textarea
                      name="address" required value={form.address} onChange={handleChange} rows={2}
                      className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                    />
                  </label>
                </>
              )}

              <label className="block">
                <span className="label text-muted-foreground">{t("orderPage.notesLabel")}</span>
                <textarea
                  name="notes" value={form.notes} onChange={handleChange} rows={2}
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none focus:border-shu"
                />
              </label>
            </div>

            <dl className="mt-10 space-y-2">
              <Row label={t("orderPage.subtotal")} value={formatPrice(cartTotal, lang)} />
              <Row
                label={form.fulfillment === "delivery" ? t("orderPage.delivery") : t("orderPage.pickup")}
                value={form.fulfillment === "delivery" ? formatPrice(deliveryFee, lang) : "—"}
              />
              <Row label={t("orderPage.total")} value={formatPrice(estimatedTotal, lang)} strong />
            </dl>

            {error && <p className="mt-6 text-sm text-shu">{error}</p>}

            <Button type="submit" variant="primary" disabled={submitting} className="mt-8 w-full">
              {submitting
                ? t("orderPage.submitting")
                : t("orderPage.submit", {
                    method: form.fulfillment === "delivery" ? t("orderPage.delivery") : t("orderPage.pickup"),
                  })}
            </Button>
          </form>
        </aside>
      </div>
    </main>
  );
};

function Row({ label, value, strong }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-2">
      <dt className="label text-muted-foreground">{label}</dt>
      <dd className={strong ? "num text-lg" : "num text-xs"}>{value}</dd>
    </div>
  );
}

export default Order;