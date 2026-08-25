const fr = {
  public: {
    home: "Accueil",
    menu: "Menu",
    book: "Réservation",
    order: "Commander",
    gallery: "Galerie",
    contact: "Contact",

    reservebtn: "Réserver",
    checkout: "Commander",
    total: "Total",
    navigate: "Naviguer",
    findUs: "Nous trouver",
    yourOrder: "Votre commande",
    emptyCart: "Rien pour l'instant. Le menu est un bon point de départ.",

    nav: {
      home: "Accueil",
      menu: "Menu",
      booking: "Réservation",
      order: "Commander",
      gallery: "Galerie",
      contact: "Contact",
      book: "Réserver",
      openCart: "Ouvrir le panier",
      openMenu: "Ouvrir la navigation",
      closeMenu: "Fermer la navigation",
    },

    hero: {
      eyebrow: "Edomae · Paris 1er",
      titleLine1: "Douze places,",
      titleLine2: "un seul comptoir,",
      titleLine3: "rien de plus.",
      description:
        "Du poisson livré de Toyosu deux fois par semaine. Du riz assaisonné au vinaigre rouge. Servi à l'instant où il est préparé.",
      reserve: "Réserver une place",
      menu: "Voir le menu",
      scroll: "DÉFILER",
    },

    philosophy: {
      eyebrow: "Notre philosophie",
      title: "Moins, mais mieux.",
      paragraph1:
        "Nous croyons que la précision est une forme de respect. Chaque ingrédient est choisi selon sa saison, chaque geste est pensé, et chaque assiette laisse au produit la place de s’exprimer.",
      paragraph2:
        "Le résultat est volontairement simple : des saveurs nettes, une technique discrète et une expérience qui invite à prendre le temps.",
      link: "Découvrir la salle",
      imageAlt: "Chef préparant des sushis derrière le comptoir",
    },

    featuredDishes: {
      eyebrow: "Au comptoir",
      title: "Une sélection courte, servie au meilleur moment.",
      description:
        "Notre carte suit le rythme des saisons. Quelques créations restent des signatures, tandis que les détails évoluent au fil des arrivages.",
      loading: "Préparation de la carte...",
    },

    reviews: {
      eyebrow: "Ils en parlent",
      title: "Le genre de soirée qui reste en mémoire.",
      first: {
        quote:
          "Une cuisine d’une grande justesse. Chaque assiette est pensée avec précision, sans jamais en faire trop.",
        source: "Client, service du soir",
      },
      second: {
        quote:
          "Le poisson était remarquable, mais c’est l’attention portée à chaque détail qui a rendu la soirée mémorable.",
        source: "Client, service du week-end",
      },
      third: {
        quote:
          "Une salle paisible, un service attentif et une cuisine qui se suffit à elle-même. Exactement ce que nous recherchions.",
        source: "Client, dîner privé",
      },
    },

    location: {
      eyebrow: "Nous trouver",
      directions: "Itinéraire",
      imageAlt: "La salle du restaurant",
    },

    reserve: {
      eyebrow: "Réservations",
      titleLine1: "Une table vous attend.",
      titleLine2: "À vous de choisir la soirée.",
      button: "Réserver une table",
    },

    menuPage: {
      eyebrow: "Au comptoir",
      title: "Menu",
      description:
        "Des plats de saison préparés avec précision. La carte évolue au fil des arrivages du marché.",
      all: "Tout",
      loading: "Chargement…",
      emptyCategory: "Aucun article dans cette catégorie.",
      soldOut: "Épuisé",
      addToOrder: "Ajouter à la commande",
    },

    booking: {
      eyebrow: "Réservations",
      title: "Réserver une table",
      dateLabel: "Date",
      timeLabel: "Heure",
      partySizeLabel: "Nombre de convives",
      nameLabel: "Nom",
      phoneLabel: "Téléphone",
      emailLabel: "E-mail (facultatif)",
      specialRequestsLabel: "Demandes spéciales (facultatif)",
      loadingAvailability: "Chargement des disponibilités…",
      availabilityError: "Impossible de charger les disponibilités.",
      retry: "Réessayer",
      closed: "Fermé à cette date.",
      submit: "Réserver",
      submitting: "Réservation en cours…",
      successTitle: "Table réservée",
      successMessage:
        "Merci, {{name}}. Nous avons réservé une table pour {{partySize}} le {{date}} à {{time}}.",
      confirmWhatsApp: "Confirmer sur WhatsApp",
      cancelPrompt: "Besoin de modifier ?",
      cancelLink: "Annuler cette réservation",
      note:
        "Les tables sont conservées 15 minutes après l'heure de réservation. Pour plus de 8 personnes, veuillez nous appeler directement.",
      errors: {
        date: "Veuillez choisir une date.",
        time: "Veuillez choisir un créneau horaire.",
        generic: "Une erreur est survenue. Veuillez réessayer.",
      },
    },

    orderPage: {
      eyebrow: "Emporter & livraison",
      title: "Commander en ligne",
      basketTitle: "Votre panier",
      fulfillment: {
        pickup: "Emporter",
        delivery: "Livraison",
      },
      nameLabel: "Nom",
      phoneLabel: "Téléphone",
      emailLabel: "E-mail",
      wilayaLabel: "Wilaya",
      addressLabel: "Adresse",
      notesLabel: "Remarques",
      loadingZones: "Chargement…",
      selectWilaya: "Sélectionnez votre wilaya",
      subtotal: "Sous-total",
      delivery: "Livraison",
      pickup: "Emporter",
      total: "Total",
      submit: "Passer la commande — Paiement à la {{method}}",
      submitting: "Commande en cours…",
      emptyCartText: "Votre panier est vide.",
      browseMenu: "Parcourir le menu",
      successTitle: "Commande passée",
      successMessage:
        "Merci, {{name}}. Votre total est de {{total}}, à régler à la {{method}}.",
      confirmWhatsApp: "Confirmer sur WhatsApp",
      cancelPrompt: "Besoin de modifier ?",
      cancelLink: "Annuler cette commande",
      errors: {
        emptyCart: "Votre panier est vide.",
        noZone: "Veuillez sélectionner une zone de livraison.",
        generic: "Une erreur est survenue. Veuillez réessayer.",
      },
    },

    galleryPage: {
      eyebrow: "La salle",
      title: "Galerie",
      loading: "Chargement…",
      error: "Impossible de charger la galerie.",
    },

    cart: {
      eyebrow: "Au comptoir",
      title: "Votre commande",
      close: "Fermer le panier",
      emptyTitle: "Rien pour l'instant",
      emptyDescription:
        "Le comptoir vous attend. Parcourez le menu et choisissez quelque chose pour votre table.",
      browseMenu: "Parcourir le menu",
      total: "Total",
      checkout: "Commander",
      note: "Emporter ou livraison disponible.",
      decrease: "Diminuer {{name}}",
      increase: "Augmenter {{name}}",
      remove: "Retirer {{name}}",
    },
  },
};

export default fr;