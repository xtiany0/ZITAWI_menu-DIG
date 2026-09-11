import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const CATEGORIES = ["pizzas", "plats", "sandwichs", "boissons"] as const;

const menu = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/menu" }),
  schema: z.object({
    name_fr: z.string(),
    name_en: z.string(),
    description_fr: z.string().default(""),
    description_en: z.string().default(""),
    price: z.number(),
    price_note_fr: z.string().default(""),
    price_note_en: z.string().default(""),
    category: z.enum(CATEGORIES),
    image: z.string().optional(),
    available: z.boolean().default(true),
    order: z.number().default(100),
  }),
});

export const collections = { menu };
