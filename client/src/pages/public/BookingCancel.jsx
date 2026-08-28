import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cancelBookingRequest } from "../../features/booking/api";
import Button from "../../components/ui/Button";
import { useLang } from "../../i18n"; // <-- add

const BookingCancel = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const { t } = useLang(); // <-- add

  const handleCancel = async () => {
    setStatus("loading");
    try {
      const data = await cancelBookingRequest(token);
      setMessage(data.message || t("bookingCancel.successMessage"));
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.message || t("bookingCancel.error"));
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl">
          {t("bookingCancel.successTitle")}
        </h1>
        <Link to="/" className="hairline-link label mt-10 text-foreground">
          {t("bookingCancel.backToHome")}
        </Link>
      </main>
    );
  }

  return (
    <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
      <p className="label text-shu">{t("bookingCancel.eyebrow")}</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">
        {t("bookingCancel.title")}
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        {t("bookingCancel.warning")}
      </p>

      {status === "error" && (
        <p className="mt-4 text-sm text-shu">{message}</p>
      )}

      <div className="mt-10 flex items-center gap-6">
        <Link to="/" className="hairline-link label text-muted-foreground">
          {t("bookingCancel.keep")}
        </Link>
        <Button
          variant="primary"
          onClick={handleCancel}
          disabled={status === "loading"}
        >
          {status === "loading"
            ? t("bookingCancel.cancelling")
            : t("bookingCancel.cancel")}
        </Button>
      </div>
    </main>
  );
};

export default BookingCancel;