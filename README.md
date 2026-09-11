# Zitawi, digital menu

Bilingual (FR/EN) digital menu for the Zitawi restaurant in Cotonou, Benin, built to be opened from a QR code
placed on the tables. The restaurant updates dishes, prices and photos through a web admin at
`/admin` without touching any code.

## Stack

| Concern | Choice |
| --- | --- |
| Site generator | Astro 5, fully static output |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Content | Markdown files in `src/content/menu`, one file per dish |
| Admin | Decap CMS at `/admin`, backed by Netlify Identity plus Git Gateway |
| Hosting | Netlify |
| Fonts | Playfair Display SC (display) and Karla (body), self-hosted via Fontsource |

## Design system

A printed menu, set for screen, on a dark ground. Warm near-black, bone ink, gold prices, and dot
leaders running from each dish name to its price.

- Ground `#170F0E`, ink `#F5EBE8`, secondary text `#B59B95`, rules `#3A2726`.
- Gold `#D4A24C` carries every price at 7.9:1. Red splits in two: `#DC2626` fills the action
  buttons under white text, `#F05252` is the text tone for the sold-out marker, because the
  solid red only reaches 3.1:1 against this ground.
- Playfair Display SC is set in small caps for dish names, which is what makes the page read as a
  menu rather than a product listing.
- The theme is locked dark; `color-scheme: only dark`.
- No gradients, no glow, no glass, no shadowed cards. Separation comes from rules and space.
- Dot leaders are a flex child that grows into whatever gap is left (`.leader` in `global.css`),
  so they work at any name length without measurement.
- Scroll reveal is CSS transitions driven by one IntersectionObserver, not an animation library.
  Everything renders visible when `prefers-reduced-motion: reduce` is set or the observer never runs.
- Touch targets are 48px on every interactive element.

Tokens live in `src/styles/global.css`.

## Local development

```bash
npm install
npm run dev      # http://localhost:4399
npm run build    # static output in dist/
npm run preview
```

## Content model

Each dish is one Markdown file under `src/content/menu`, validated by the Zod schema in
`src/content.config.ts`:

| Field | Type | Notes |
| --- | --- | --- |
| `name_fr`, `name_en` | string | Dish name per language |
| `description_fr`, `description_en` | string | Ingredient list, optional |
| `price` | number | Integer, in CFA francs |
| `price_note_fr`, `price_note_en` | string | Optional qualifier such as "la douzaine" |
| `category` | enum | `pizzas`, `plats`, `sandwichs`, `boissons` |
| `image` | string | Optional path under `/images/menu` |
| `available` | boolean | Set to `false` to show a dish as sold out instead of deleting it |
| `featured` | boolean | Surfaces the dish in the hero shortlist |
| `order` | number | Lower value sorts higher inside its category |

Prices were transcribed from the restaurant's printed menu. Where two printed versions disagreed,
the more recent one was used.

## Deployment

1. Push this repository to GitHub.
2. In Netlify, create a site from the repository. `netlify.toml` already declares the build command,
   the publish directory and the Node version.
3. Enable **Netlify Identity**, set registration to invite-only, and enable **Git Gateway** under
   Identity > Services.
4. Invite the restaurant's email address. They set their own password and sign in at
   `https://zitawi.com/admin/`.
5. Add the `zitawi.com` domain in Netlify and let it provision the Let's Encrypt certificate.

The root URL redirects to `/fr/` by default, or to `/en/` when the browser asks for English. Both
language pages are statically generated and cross-linked with `hreflang`.

## QR code

```bash
npm run qr https://zitawi.com
```

Writes to `qr/`: an SVG and a 2000px PNG of the code, plus `chevalet-table.html`, an A5 table card
ready to print from a browser.

## Photography

The pizza band above the footer is cropped from the printed menu and halftoned. Dish photos are intentionally not bundled. The `image` field is wired end to end, so the restaurant
can upload real photos through `/admin` and they appear immediately. Shoot in daylight, from above,
in landscape, and keep each file under about 500 KB.

## Before going live

Replace the placeholder phone number in `src/i18n/ui.ts` (`PHONE` and `PHONE_DISPLAY`) and confirm
the opening hours string in the same file.
