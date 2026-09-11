export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const ui = {
  fr: {
    htmlLang: "fr",
    origin: "Cotonou, Bénin",
    heroWords: ["Pizzas", "grillades", "chawarma"],
    heroBody:
      "La carte complète du restaurant, à jour en permanence. Prix en francs CFA, sur place ou à emporter.",
    heroCta: "Voir la carte",
    heroCall: "Appeler",
    categories: {
      pizzas: "Pizzas",
      plats: "Plats",
      sandwichs: "Sandwichs",
      boissons: "Boissons",
    },
    categoryBlurb: {
      pizzas: "Pâte fine, cuisson minute.",
      plats: "Poulet, viande et accompagnements.",
      sandwichs: "Chawarma, burgers et falafel.",
      boissons: "Sucreries, jus pressés, yaourt.",
    },
    currency: "F",
    soldOut: "Épuisé",
    popular: "Sélection",
    refs: "références",
    service: "Service",
    contact: "Contact",
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
    heroWords: ["Pizza", "grills", "shawarma"],
    heroBody:
      "The restaurant's full menu, always current. Prices in CFA francs, dine in or take away.",
    heroCta: "Open the menu",
    heroCall: "Call us",
    categories: {
      pizzas: "Pizza",
      plats: "Plates",
      sandwichs: "Sandwiches",
      boissons: "Drinks",
    },
    categoryBlurb: {
      pizzas: "Thin base, baked to order.",
      plats: "Chicken, beef and sides.",
      sandwichs: "Shawarma, burgers and falafel.",
      boissons: "Soft drinks, pressed juice, yoghurt.",
    },
    currency: "F",
    soldOut: "Sold out",
    popular: "Selection",
    refs: "references",
    service: "Service",
    contact: "Contact",
    otherLang: "FR",
    otherLangHref: "/fr/",
    footerNote: "Prices in CFA francs, taxes included.",
    hours: "Daily, 10am to 11pm",
    address: "Cotonou, Benin",
    updated: "Menu updated on",
    skip: "Skip to the menu",
    bandAlt: "Two loaded pizzas, photographed from the restaurant's menu",
    empty: "No reference available",
  },
} as const;

export const PHONE = "+2290100000000";
export const PHONE_DISPLAY = "+229 01 00 00 00 00";

// The printed menu writes 6.000F. French keeps that dot; English uses a comma,
// where a dot would read as a decimal point.
export function formatPrice(value: number, lang: Lang) {
  return value.toLocaleString("en-US").replace(/,/g, lang === "fr" ? "." : ",");
}

