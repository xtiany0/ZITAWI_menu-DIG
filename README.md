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
| Fonts | Inter for the interface, Playfair Display for the wordmark, self-hosted via Fontsource |

## Design system

Dark card menu with an ordering flow, following two references the client supplied: the terracotta
ZITAWI masthead from their shopfront and phone mockup, and a dark card list with category pills.

- Ground `#0E0E10`, cards `#1A1B1E`, text white, secondary `#9A9AA2`.
- Terracotta masthead `#C1543F` carrying the wordmark in black, outlined in white as the shopfront
  banner has it. Orange `#E8752A` marks the active filter and the add buttons; WhatsApp green
  `#25D366` and order green `#1E7A43` belong to the order flow alone.
- Locked dark; `color-scheme: only dark`.
- The category pills filter rather than scroll: one category at a time, plus an All button. Search
  and the filter run through one function so they cannot contradict each other.
- The order lives in `localStorage` for twelve hours. Only ids and quantities are stored; names and
  prices are read back off the page, so a repriced or withdrawn dish cannot return stale.
- Touch targets are 44px everywhere.
- No animation library.

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
| `price_alt` | number | Optional second tariff |
| `options_fr`, `options_en` | string | The two choices facing `price` and `price_alt`, as `A / B` |
| `category` | enum | `pizzas`, `plats`, `sandwichs`, `boissons` |
| `image` | string | Optional path under `/images/menu` |
| `available` | boolean | Set to `false` to show a dish as sold out instead of deleting it |
| `order` | number | Lower value sorts higher inside its category |

Names, prices and ingredient lists come from `zitawi-menu-structure.pdf`, transcribed verbatim
including its lowercase ingredient lines and its `+` separators. 51 dishes: 14 pizzas, 18 plates,
15 sandwiches, 4 drinks.

A dish with two tariffs becomes two buyable lines on the card, one per option, each with its own
price and its own quantity stepper. `price_alt` holds the second tariff and `options_*` names the
two choices in the same order, for example `nature / avec viande` against `2.000` and `3.000`. The
order message spells the choice out, as `1 x Plat pois chiche (nature)`. A `price_alt` without
matching options is ignored, so a half-filled entry cannot render a priceless button.

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

31 dish photos, extracted from the embedded images in `zitawi-menu-structure.pdf` with `pdfimages`
and converted to WebP. 524 KB in total. They are cut-out shots on a plain ground, 82 to 202px
square, which matches the square card thumbnails.

Pairing follows page order, because the PDF places each image beside its own name. Six dishes carry
no photo because the PDF shows none: Plat double, Plat KFC, Plat de riz simple, Portion de frites,
Sandwich double and Boisson énergétique. The fourteen pizzas have no photography of their own
either, so that section opens with a banner instead.

The `image` field stays wired end to end, so the restaurant can replace any of these through
`/admin`. Shoot in daylight, from above, square, under about 500 KB.

## Before going live

Replace the placeholder phone number in `src/i18n/ui.ts` (`PHONE` and `PHONE_DISPLAY`) and confirm
the opening hours string in the same file.
