import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cancelOrderRequest } from "../../features/orders/api";
import Button from "../../components/ui/Button";
import { useLang } from "../../i18n"; 

const OrderCancel = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const { t } = useLang(); 

  const handleCancel = async () => {
    setStatus("loading");
    try {
      const data = await cancelOrderRequest(token);
      setMessage(data.message || t("orderCancel.successMessage"));
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.message || t("orderCancel.error"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl">
          {t("orderCancel.successTitle")}
        </h1>
        <Link
          to="/menu"
          className="hairline-link label mt-10 text-foreground"
        >
          {t("orderCancel.backToMenu")}
        </Link>
      </main>
    );
  }

  return (
    <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
      <p className="label text-shu">{t("orderCancel.eyebrow")}</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">
        {t("orderCancel.title")}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t("orderCancel.warning")}
      </p>

      {status === "error" && (
        <p className="mt-4 text-sm text-shu">{message}</p>
      )}

      <div className="mt-10 flex items-center gap-6">
        <Link to="/" className="hairline-link label text-muted-foreground">
          {t("orderCancel.keep")}
        </Link>
        <Button
          variant="primary"
          onClick={handleCancel}
          disabled={status === "loading"}
        >
          {status === "loading"
            ? t("orderCancel.cancelling")
            : t("orderCancel.cancel")}
        </Button>
      </div>
    </main>
  );
};

export default OrderCancel;