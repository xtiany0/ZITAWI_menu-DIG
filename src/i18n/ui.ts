export const LANGS = ["fr", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const ui = {
  fr: {
    htmlLang: "fr",
    tagline: "Restaurant",
    heroTitle: "Pizzas au feu, grillades et chawarma.",
    heroBody:
      "Carte complète du jour. Prix en francs CFA, service sur place ou à emporter.",
    heroCta: "Voir la carte",
    heroCall: "Appeler",
    categories: {
      pizzas: "Pizzas",
      plats: "Plats",
      sandwichs: "Sandwichs",
      boissons: "Boissons",
    },
    categoryBlurb: {
      pizzas: "Pâte fine, cuisson minute, garnitures généreuses.",
      plats: "Assiettes complètes, poulet, viande et accompagnements.",
      sandwichs: "Chawarma, burgers et falafel préparés à la commande.",
      boissons: "Sucreries fraîches, jus pressés et yaourt maison.",
    },
    currency: "FCFA",
    soldOut: "Épuisé",
    popular: "Populaire",
    otherLang: "English",
    otherLangHref: "/en/",
    footerNote: "Prix en francs CFA, taxes comprises.",
    hours: "Ouvert tous les jours, 10h à 23h",
    address: "Lomé, Togo",
    updated: "Carte mise à jour le",
    skip: "Aller à la carte",
  },
  en: {
    htmlLang: "en",
    tagline: "Restaurant",
    heroTitle: "Fire-baked pizza, grills and shawarma.",
    heroBody:
      "The full menu of the day. Prices in CFA francs, dine in or take away.",
    heroCta: "See the menu",
    heroCall: "Call us",
    categories: {
      pizzas: "Pizzas",
      plats: "Plates",
      sandwichs: "Sandwiches",
      boissons: "Drinks",
    },
    categoryBlurb: {
      pizzas: "Thin base, baked to order, generous toppings.",
      plats: "Full plates of chicken, beef and sides.",
      sandwichs: "Shawarma, burgers and falafel made to order.",
      boissons: "Cold soft drinks, pressed juice and house yoghurt.",
    },
    currency: "FCFA",
    soldOut: "Sold out",
    popular: "Popular",
    otherLang: "Français",
    otherLangHref: "/fr/",
    footerNote: "Prices in CFA francs, taxes included.",
    hours: "Open daily, 10am to 11pm",
    address: "Lomé, Togo",
    updated: "Menu updated on",
    skip: "Skip to the menu",
  },
} as const;

export const PHONE = "+22890000000";
export const PHONE_DISPLAY = "+228 90 00 00 00";

export function formatPrice(value: number, lang: Lang) {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB").format(value);
}
