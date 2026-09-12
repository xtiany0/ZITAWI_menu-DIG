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

Direction **2a "Jaune enseigne"** from `Zitawi menu redesign/design_handoff_zitawi_carte`,
implemented to the handoff. Single scrolling screen, drawn at 430px, fluid up to 480px centred.

- Sign yellow `#FFD63A` / `#FFE783` alternating bands, ink `#141210`, terracotta `#B8452F`,
  maroon category bars `#5D1E17`, cream `#FFFDF3`.
- Bodoni Moda for the wordmark only, Archivo Narrow for dish names and labels, Archivo for body and
  prices, IBM Plex Mono for counters, Cairo for the tabs.
- The wordmark is black ringed in white via `-webkit-text-stroke` with `paint-order: stroke fill`,
  as the shopfront banner has it.
- Bands alternate over the rows actually on screen, so the stripe pattern stays regular after a
  search or a tab change.
- Search strips diacritics, so "pecheur" finds "Pizza du pêcheur".
- Dishes with two tariffs show two choice pills; the selected one drives the displayed price, the
  cart key and the total. The order keeps one line per variant chosen.
- The order, the service mode, the name and the note persist in `localStorage` for twelve hours.
  A cart key carries its price, so a repriced or withdrawn dish is dropped on restore.
- Counters are drawn at 26px per the handoff, with the tap area pushed to 44px via a pseudo
  element so a thumb is not asked to hit 26px.

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

31 dish photos, extracted from `zitawi-menu-structure.pdf` with `pdfimages`. The client asked for
these rather than the cut-outs bundled with the handoff.

They arrived on a solid yellow ground, which would have dissolved into the yellow bands, so the
background is removed by flood-filling inward from the border with a tolerance of 62 and the result
is flattened onto cream. The fill starts at the edges rather than keying every yellow pixel, so
chips, rice and cheese inside a dish are never eaten. A tolerance of 96 was tried and rejected: it
hollowed out burger buns. Anything the fill cannot reach is cut by the round medallion.

Six dishes carry no photo because the PDF shows none: Plat double, Plat KFC, Plat de riz simple,
Portion de frites, Sandwich double and Boisson énergétique. Those show the empty "PHOTO" slot. The
pizzas never get a medallion, which is the handoff's own choice.

## Before going live

Replace the placeholder phone number in `src/i18n/ui.ts` (`PHONE` and `PHONE_DISPLAY`) and confirm
the opening hours string in the same file.
