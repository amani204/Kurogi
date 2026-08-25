import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../../features/restaurant/data";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(
        "Hello — I'd like to ask about a booking."
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center bg-shu text-washi transition-transform duration-300 hover:-translate-y-0.5"
    >
      <MessageCircle
        className="h-5 w-5"
        strokeWidth={1.4}
      />
    </a>
  );
}