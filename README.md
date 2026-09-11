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
| Fonts | Inter, self-hosted via Fontsource |

## Design system

The site reproduces `zitawimenustructure1.pdf`, the menu structure supplied by the client.
Colours were sampled from a render of that file rather than guessed.

- Vermillion masthead `#E8482C`, paper `#FBF7F0`, ink `#1A1A1A`, secondary text `#7D7B74`,
  hairlines `#E6E0D7`.
- Each category opens with a full-width black bar, exactly as the PDF does. Pizzas carries the
  wide banner photo underneath.
- Rows are photo, name, ingredients, price. Rows without a photo sit flush left, again per the PDF.
- Prices print as the menu prints them: `6.000F`, and `6.000 / 8.000F` where a dish has two
  tariffs. French keeps the dot separator from the printed menu; English uses a comma, since a dot
  there would read as a decimal point.
- The masthead is sticky and its `Pizzas . Plats . Sandwichs . Boissons` line doubles as the
  category nav. The PDF repeats that line on every page; on a single scrolling page it earns its
  keep as navigation.
- No animation library and no scroll reveal. One IntersectionObserver drives the nav underline.

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
| `price_alt` | number | Optional second tariff, rendered as `6.000 / 8.000F` |
| `category` | enum | `pizzas`, `plats`, `sandwichs`, `boissons` |
| `image` | string | Optional path under `/images/menu` |
| `available` | boolean | Set to `false` to show a dish as sold out instead of deleting it |
| `order` | number | Lower value sorts higher inside its category |

Names, prices and ingredient lists come from `zitawimenustructure1.pdf`, transcribed verbatim
including its lowercase ingredient lines and its `+` separators. 51 dishes: 14 pizzas, 18 plates,
15 sandwiches, 4 drinks.

Where a dish has two tariffs, `price_alt` holds the second and the ingredient line names the two
options, for example `nature / avec viande` against `2.000 / 3.000F`.

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

The dish thumbnails and the pizza banner are extracted from the embedded images in
`zitawimenustructure1.pdf` with `pdfimages`, converted to WebP. 36 files, 192 KB in total. They
are low resolution by origin, roughly 120x75, and are displayed at or below that size so they are
never upscaled.

Two items carry no photo, matching the PDF: Boisson énergétique and Yaourt.

The `image` field stays wired end to end, so the restaurant can replace any of these through
`/admin` with a real photo. Shoot in daylight, from above, in landscape, under about 500 KB.

## Before going live

Replace the placeholder phone number in `src/i18n/ui.ts` (`PHONE` and `PHONE_DISPLAY`) and confirm
the opening hours string in the same file.
