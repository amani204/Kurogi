export const restaurant = {
  name: "Kurogi",

  description:
    "A considered dining experience built around seasonal ingredients and precise preparation.",

  address: "Algiers, Algeria",

  phone: "+213 XX XX XX XX",

  email: "hello@kurogi.com",

  instagram: "https://instagram.com",

  facebook: "https://facebook.com",

  whatsapp: "+213XXXXXXXXX",
};

export const hours = [
  {
    day: "Monday",
    time: "Closed",
  },
  {
    day: "Tuesday",
    time: "18:00 — 23:00",
  },
  {
    day: "Wednesday",
    time: "18:00 — 23:00",
  },
  {
    day: "Thursday",
    time: "18:00 — 23:00",
  },
  {
    day: "Friday",
    time: "18:00 — 23:00",
  },
  {
    day: "Saturday",
    time: "18:00 — 23:00",
  },
  {
    day: "Sunday",
    time: "Closed",
  },
];

export function whatsappLink(message = "") {
  const phone = restaurant.whatsapp.replace(/\D/g, "");

  return `https://wa.me/${phone}?text=${encodeURIComponent(
    message
  )}`;
}