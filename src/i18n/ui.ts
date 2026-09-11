export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const ui = {
  fr: {
    htmlLang: "fr",
    origin: "COTONOU / BÉNIN",
    heroWords: ["PIZZAS", "GRILLADES", "CHAWARMA"],
    heroBody: "Carte complète. Prix en francs CFA. Sur place ou à emporter.",
    heroCta: "CONSULTER LA CARTE",
    heroCall: "APPELER",
    categories: {
      pizzas: "PIZZAS",
      plats: "PLATS",
      sandwichs: "SANDWICHS",
      boissons: "BOISSONS",
    },
    categoryBlurb: {
      pizzas: "Pâte fine, cuisson minute.",
      plats: "Poulet, viande et accompagnements.",
      sandwichs: "Chawarma, burgers et falafel.",
      boissons: "Sucreries, jus pressés, yaourt.",
    },
    currency: "FCFA",
    soldOut: "RUPTURE",
    popular: "SÉLECTION",
    refs: "RÉF.",
    service: "SERVICE",
    contact: "CONTACT",
    otherLang: "EN",
    otherLangHref: "/en/",
    footerNote: "PRIX EN FRANCS CFA, TAXES COMPRISES.",
    hours: "TOUS LES JOURS 10H-23H",
    address: "COTONOU, BÉNIN",
    updated: "CARTE RÉVISÉE LE",
    skip: "ALLER À LA CARTE",
    bandAlt: "Deux pizzas garnies, tramées depuis la carte imprimée du restaurant",
  },
  en: {
    htmlLang: "en",
    origin: "COTONOU / BENIN",
    heroWords: ["PIZZA", "GRILLS", "SHAWARMA"],
    heroBody: "Full menu. Prices in CFA francs. Dine in or take away.",
    heroCta: "OPEN THE MENU",
    heroCall: "CALL US",
    categories: {
      pizzas: "PIZZA",
      plats: "PLATES",
      sandwichs: "SANDWICHES",
      boissons: "DRINKS",
    },
    categoryBlurb: {
      pizzas: "Thin base, baked to order.",
      plats: "Chicken, beef and sides.",
      sandwichs: "Shawarma, burgers and falafel.",
      boissons: "Soft drinks, pressed juice, yoghurt.",
    },
    currency: "FCFA",
    soldOut: "SOLD OUT",
    popular: "SELECTION",
    refs: "REF.",
    service: "SERVICE",
    contact: "CONTACT",
    otherLang: "FR",
    otherLangHref: "/fr/",
    footerNote: "PRICES IN CFA FRANCS, TAXES INCLUDED.",
    hours: "DAILY 10AM-11PM",
    address: "COTONOU, BENIN",
    updated: "MENU REVISED ON",
    skip: "SKIP TO THE MENU",
    bandAlt: "Two loaded pizzas, halftoned from the restaurant's printed menu",
  },
} as const;

export const PHONE = "+2290100000000";
export const PHONE_DISPLAY = "+229 01 00 00 00 00";

export function formatPrice(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB").format(value);
}

export function pad(index: number) {
  return String(index).padStart(3, "0");
}
