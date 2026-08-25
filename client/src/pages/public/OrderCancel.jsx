import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { cancelOrderRequest } from "../../features/orders/api";
import Button from "../../comonents/ui/Button";

const OrderCancel = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleCancel = async () => {
    setStatus("loading");
    try {
      const data = await cancelOrderRequest(token);
      setMessage(data.message || "Order cancelled.");
      setStatus("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "This order could not be cancelled.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-4xl md:text-5xl">Order cancelled</h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
        <Link to="/menu" className="hairline-link label mt-10 text-foreground">
          Back to the menu
        </Link>
      </main>
    );
  }

  return (
    <main className="shell flex min-h-screen flex-col items-center justify-center py-32 text-center">
      <p className="label text-shu">Order</p>
      <h1 className="mt-4 font-display text-4xl md:text-5xl">Cancel this order?</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        This can't be undone.
      </p>

      {status === "error" && <p className="mt-4 text-sm text-shu">{message}</p>}

      <div className="mt-10 flex items-center gap-6">
        <Link to="/" className="hairline-link label text-muted-foreground">
          Keep my order
        </Link>
        <Button variant="primary" onClick={handleCancel} disabled={status === "loading"}>
          {status === "loading" ? "Cancelling..." : "Yes, cancel it"}
        </Button>
      </div>
    </main>
  );
};

export default OrderCancel;