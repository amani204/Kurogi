const en = {
  public: {
    // Navigation links (must be strings)
    home: "Home",
    menu: "Menu",
    book: "Booking",
    order: "Order",
    gallery: "Gallery",
    contact: "Contact",

    // Common
    reservebtn: "Reserve",
    checkout: "Checkout",
    total: "Total",
    navigate: "Navigate",
    findUs: "Find us",
    yourOrder: "Your order",
    emptyCart: "Nothing here yet. The menu is a good place to start.",

    nav: {
      home: "Home",
      menu: "Menu",
      booking: "Booking",
      order: "Order",
      gallery: "Gallery",
      contact: "Contact",
      book: "Book",
      openCart: "Open cart",
      openMenu: "Open navigation",
      closeMenu: "Close navigation",
    },

    hero: {
      eyebrow: "Edomae · Paris 1er",
      titleLine1: "Twelve seats,",
      titleLine2: "one counter,",
      titleLine3: "nothing extra.",
      description:
        "Fish flown from Toyosu twice a week. Rice seasoned with red vinegar. Served the moment it is cut.",
      reserve: "Reserve a seat",
      menu: "See the menu",
      scroll: "SCROLL",
    },

    philosophy: {
      eyebrow: "Our philosophy",
      title: "Less, but better.",
      paragraph1:
        "We believe precision is a form of respect. Every ingredient is chosen for its season, every cut has intention, and every plate leaves room for the ingredient to speak.",
      paragraph2:
        "The result is deliberately simple: clean flavours, quiet technique, and an experience that rewards attention.",
      link: "Inside the room",
      imageAlt: "Chef preparing sushi behind the counter",
    },

    featuredDishes: {
      eyebrow: "From the counter",
      title: "A small selection, served at its best.",
      description:
        "Our menu follows the rhythm of the season. A few dishes remain signatures, while the details change with what arrives at the market.",
      loading: "Preparing the menu...",
    },

    reviews: {
      eyebrow: "From our guests",
      title: "The kind of evening that stays with you.",
      first: {
        quote:
          "Beautifully restrained. Every plate felt considered, and nothing was there simply for decoration.",
        source: "Guest, dinner service",
      },
      second: {
        quote:
          "The fish was exceptional, but it was the attention to every small detail that made the evening memorable.",
        source: "Guest, weekend service",
      },
      third: {
        quote:
          "A quiet room, thoughtful service and food that speaks for itself. Exactly the kind of place we were looking for.",
        source: "Guest, private dinner",
      },
    },

    location: {
      eyebrow: "Find us",
      directions: "Get directions",
      imageAlt: "The restaurant dining room",
    },

    reserve: {
      eyebrow: "Reservations",
      titleLine1: "A table is waiting.",
      titleLine2: "Make the evening yours.",
      button: "Reserve a table",
    },

    // Page-specific translations
    menuPage: {
      eyebrow: "The counter",
      title: "Menu",
      description:
        "Seasonal dishes prepared with precision. The menu shifts with what is available from the market.",
      all: "All",
      loading: "Loading...",
      emptyCategory: "No items in this category yet.",
      soldOut: "Sold out",
      addToOrder: "Add to order",
    },

    booking: {
      eyebrow: "Reservations",
      title: "Reserve a table",
      dateLabel: "Date",
      timeLabel: "Time",
      partySizeLabel: "Party size",
      nameLabel: "Name",
      phoneLabel: "Phone",
      emailLabel: "Email (optional)",
      specialRequestsLabel: "Special requests (optional)",
      loadingAvailability: "Loading availability...",
      availabilityError: "Could not load availability.",
      retry: "Retry",
      closed: "Closed on this date.",
      submit: "Reserve Table",
      submitting: "Reserving...",
      successTitle: "Table reserved",
      successMessage:
        "Thank you, {{name}}. We've reserved a table for {{partySize}} on {{date}} at {{time}}.",
      confirmWhatsApp: "Confirm on WhatsApp",
      cancelPrompt: "Need to change plans?",
      cancelLink: "Cancel this booking",
      note:
        "Tables are held for 15 minutes past your reservation time. For parties larger than 8, please call us directly.",
      errors: {
        date: "Please choose a date.",
        time: "Please choose a time slot.",
        generic: "Something went wrong. Please try again.",
      },
    },

    orderPage: {
      eyebrow: "Pickup & delivery",
      title: "Order online",
      basketTitle: "Your basket",
      fulfillment: {
        pickup: "Pickup",
        delivery: "Delivery",
      },
      nameLabel: "Name",
      phoneLabel: "Phone",
      emailLabel: "Email",
      wilayaLabel: "Wilaya",
      addressLabel: "Address",
      notesLabel: "Notes",
      loadingZones: "Loading...",
      selectWilaya: "Select your wilaya",
      subtotal: "Subtotal",
      delivery: "Delivery",
      pickup: "Pickup",
      total: "Total",
      submit: "Place order — Cash on {{method}}",
      submitting: "Placing order...",
      emptyCartText: "Your basket is empty.",
      browseMenu: "Browse the menu",
      successTitle: "Order placed",
      successMessage:
        "Thank you, {{name}}. Your total is {{total}}, payable on {{method}}.",
      confirmWhatsApp: "Confirm on WhatsApp",
      cancelPrompt: "Need to make a change?",
      cancelLink: "Cancel this order",
      errors: {
        emptyCart: "Your cart is empty.",
        noZone: "Please select a delivery zone.",
        generic: "Something went wrong placing your order. Please try again.",
      },
    },

    galleryPage: {
      eyebrow: "The room",
      title: "Gallery",
      loading: "Loading...",
      error: "Couldn't load the gallery.",
    },

    // Cart drawer
    cart: {
      eyebrow: "The counter",
      title: "Your order",
      close: "Close cart",
      emptyTitle: "Nothing here yet",
      emptyDescription:
        "The counter is waiting. Browse the menu and choose something for your table.",
      browseMenu: "Browse the menu",
      total: "Total",
      checkout: "Checkout",
      note: "Pickup or delivery available.",
      decrease: "Decrease {{name}}",
      increase: "Increase {{name}}",
      remove: "Remove {{name}}",
    },
    contactPage: {
  eyebrow: 'Get in Touch',
  title: 'Contact',
  whatsappCta: 'Message on WhatsApp',
  whatsappMessage: 'Hello, I have a question.',
  hours: 'Hours',
  mapCaption: 'Find us on the map below.',
  closed: 'Closed',
},
  },
  
};

export default en;