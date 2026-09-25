import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// Astro 7 deprecates re-exporting zod from astro:content.
import { z } from "zod";

export const CATEGORIES = ["pizzas", "plats", "sandwichs", "boissons"] as const;

const menu = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/menu" }),
  schema: z.object({
    name_fr: z.string(),
    name_en: z.string(),
    description_fr: z.string().default(""),
    description_en: z.string().default(""),
    price: z.number(),
    price_alt: z.number().optional(),
    // "A / B": the two labels facing price and price_alt, in that order.
    options_fr: z.string().default(""),
    options_en: z.string().default(""),
    category: z.enum(CATEGORIES),
    image: z.string().optional(),
    available: z.boolean().default(true),
    order: z.number().default(100),
  }),
});

export const collections = { menu };
