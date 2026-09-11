export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const HOURS = { open: 10, close: 23 };

export const ui = {
  fr: {
    htmlLang: "fr",
    origin: "Cotonou, Bénin",
    heroBody:
      "La carte complète du restaurant, à jour en permanence. Prix en francs CFA, sur place ou à emporter.",
    categories: {
      pizzas: "Pizzas",
      plats: "Plats",
      sandwichs: "Sandwichs",
      boissons: "Boissons",
    },
    currency: "FCFA",
    tagline: "Restaurant & Fast Food",
    openNow: "Ouvert",
    closedNow: "Fermé",
    searchLabel: "Rechercher un plat",
    searchPlaceholder: "Chercher une pizza, un plat...",
    noResult: "Aucun plat ne correspond.",
    add: "Ajouter",
    remove: "Retirer",
    orderCta: "Commande via WhatsApp",
    total: "Total",
    orderIntro: "Bonjour Zitawi, je souhaite commander :",
    orderTotal: "Total",
    soldOut: "Épuisé",
    otherLang: "EN",
    otherLangHref: "/en/",
    footerNote: "Prix en francs CFA, taxes comprises.",
    hours: "Tous les jours, 10h à 23h",
    address: "Cotonou, Bénin",
    updated: "Carte mise à jour le",
    skip: "Aller à la carte",
    bandAlt: "Deux pizzas garnies, photographiées sur la carte du restaurant",
    empty: "Aucune référence disponible",
  },
  en: {
    htmlLang: "en",
    origin: "Cotonou, Benin",
    heroBody:
      "The restaurant's full menu, always current. Prices in CFA francs, dine in or take away.",
    categories: {
      pizzas: "Pizza",
      plats: "Mains",
      sandwichs: "Sandwiches",
      boissons: "Drinks",
    },
    currency: "FCFA",
    tagline: "Restaurant & Fast Food",
    openNow: "Open",
    closedNow: "Closed",
    searchLabel: "Search the menu",
    searchPlaceholder: "Search a pizza, a dish...",
    noResult: "No dish matches.",
    add: "Add",
    remove: "Remove",
    orderCta: "Order on WhatsApp",
    total: "Total",
    orderIntro: "Hello Zitawi, I would like to order:",
    orderTotal: "Total",
    soldOut: "Sold out",
    otherLang: "FR",
    otherLangHref: "/fr/",
    footerNote: "Prices in CFA francs, taxes included.",
    hours: "Daily, 10am to 11pm",
    address: "Cotonou, Benin",
    updated: "Menu updated on",
    skip: "Skip to the menu",
    bandAlt: "Two loaded pizzas, photographed from the restaurant's menu",
    empty: "No items available",
  },
} as const;

// Placeholder. Replace with the restaurant's real line before going live;
// WHATSAPP is what the order button sends to.
export const PHONE = "+2290100000000";
export const WHATSAPP = "2290100000000";
export const PHONE_DISPLAY = "+229 01 00 00 00 00";

// The printed menu writes 6.000F. French keeps that dot; English uses a comma,
// where a dot would read as a decimal point.
export function formatPrice(value: number, lang: Lang) {
  return value.toLocaleString("en-US").replace(/,/g, lang === "fr" ? "." : ",");
}

