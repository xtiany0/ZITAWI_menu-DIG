# Zitawi, digital menu

Bilingual (FR/EN) digital menu for the Zitawi restaurant in Cotonou, Benin, built to be opened from a
QR code placed on the tables. There is no ordering backend: the order is assembled in the browser and
handed off as a pre-filled WhatsApp message.

**Status: not yet shown to the restaurant.** This is a speculative build, made to be pitched to them.
Dish names, prices and ingredient lines are transcribed from their printed card, and the photos are
cut from it, so every one of those is unconfirmed until they say otherwise. Feedback recorded below
comes from internal review, not from the restaurant.

## Stack

| Concern | Choice |
| --- | --- |
| Site generator | Astro 5, fully static output |
| Styling | Tailwind CSS v4 (Vite plugin), no config file |
| Content | Markdown files in `src/content/menu`, one file per dish |
| Admin | Decap CMS at `/admin`, backed by Netlify Identity plus Git Gateway |
| Hosting | Netlify, or GitHub Pages — the build targets either |
| Fonts | Bodoni Moda, Archivo, Archivo Narrow, Cairo, IBM Plex Mono, self-hosted via Fontsource |

## Design system

Direction **3a "Crème & accents jaunes"** from `Zitawi menu redesign/design_handoff_zitawi_carte`,
implemented to the handoff. Single scrolling screen, drawn at 430px, fluid to a 480px centred
maximum. It is a phone page, and it stays a phone page on a desktop.

3a is the earlier 2a specification with one rule applied over it, after a reviewer found the card
tiring to read: **yellow is an accent, never a ground.** It survives on the `+` button, the category
title highlight, the active language segment, the rail's position marker and the footer wordmark, and
nowhere else.

- Cream paper `#FBF6E9`, rows separated by a `#ECE2CA` hairline, ink `#141210`, signage yellow
  `#FFD63A`, terracotta banner `#B8452F`.
- Bodoni Moda for the wordmark only, Archivo Narrow for dish names and labels, Archivo for body and
  prices, IBM Plex Mono for counters, Cairo for the tabs.
- The wordmark is black ringed in white via `-webkit-text-stroke` with `paint-order: stroke fill`,
  as the shopfront banner has it.
- Category titles are struck through their lower half with yellow, then a rule runs out to the
  counter. The highlight needs `line-height: 1`: the handoff stops its gradient at 42% of the line
  box, which lands under the glyphs entirely at the default line height.
- Search strips diacritics, so "pecheur" finds "Pizza du pêcheur".
- Dishes with two tariffs show two choice pills; the selected one drives the displayed price, the
  cart key and the total. The order keeps one line per variant chosen.
- The order, the service mode, the name and the note persist in `localStorage` for twelve hours. A
  cart key carries its price, so a repriced or withdrawn dish is dropped on restore.
- Counters are drawn at 26px per the handoff, with the tap area pushed to 44px via a pseudo element
  so a thumb is not asked to hit 26px.

Tokens live in `src/styles/global.css`.

### Light and dark

The banner carries a theme button top left, mirroring the language switch top right: same 34×40
casing, an icon over a label, `aria-label` and `title`. The choice is kept in
`localStorage["zitawi-theme"]` and falls back to `prefers-color-scheme`.

Themes are a variable swap, not a second set of classes. `@theme` holds the light values and
`[data-theme="dark"]` overrides the same custom properties, so every utility keeps working unchanged.
Two rules bind anything new:

- A raw hex in a component defeats the theme. Colours belong in a token, arbitrary values included —
  write `shadow-[4px_4px_0_var(--color-rule)]`, never the hex.
- `--color-ink` flips to near-white in the dark. Anything the handoff lists as unchanged by the theme
  — the banner and its bottom rule, the `+` button, the cart's black header — uses `--color-black`,
  which is a constant. `--color-on` / `--color-on-ink` are the "selected" pair, carrying the active
  tab, the active variant pill, the active service button, the WhatsApp button, the language knob,
  category titles, the cart total and any quantity above zero. They flip together, by design.

A blocking inline script in the head of `MenuLayout.astro` sets `data-theme` before the first paint.
It has to stay blocking and stay in the head, or a dark reader gets a flash of the cream page.

### Category rail

The rail is the only sticky element; the masthead scrolls away. A folding masthead was built and
removed, because shortening the document as it folded fed back into the scroll position and
flickered.

The rail doubles as a position indicator. While the category is "Tout" and the search is empty, the
section currently under the rail is marked, and the rail scrolls sideways to keep that pill visible.
Filtering or searching switches the marker off: there is no longer a "where am I" to answer, and the
marker would contradict the pressed pill. The marker is filled on the light theme and outlined on the
dark one, where a filled marker would be the active tab exactly.

## Local development

```bash
npm install
npm run dev          # http://localhost:4399
npm run build        # static output in dist/
npm run preview
npx astro check      # type check; no npm script wires it up
```

There is no test suite and no linter. Verification is `npx astro check` plus a build.

## Content model

Each dish is one Markdown file under `src/content/menu`, validated by the Zod schema in
`src/content.config.ts`. `public/admin/config.yml` describes the same fields for the CMS; adding,
renaming or requiring a field means editing both, or the CMS writes files the build rejects.

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

Five dishes carry two tariffs. `price_alt` holds the second and `options_*` names the two choices in
the same order, for example `nature / avec viande` against `2.000` and `3.000`. Each becomes its own
cart line with its own quantity, and the order message spells the choice out, as
`1× Plat pois chiche (nature) : 2.000 FCFA`. A `price_alt` without matching options is ignored, so a
half-filled entry cannot render a priceless button.

All user-facing copy lives in `src/i18n/ui.ts`, along with `PHONE`, `PHONE_DISPLAY` and `WHATSAPP`.
Strings the client script needs are handed over through `define:vars` in `src/pages/[lang]/index.astro`,
so a new client-side string has to be added in both places.

## Deployment

`astro.config.mjs` reads `PUBLIC_BASE` and `PUBLIC_SITE` from the environment and falls back to `/`
and `https://zitawi.com`. Every absolute URL the site writes goes through `withBase()` in
`src/lib/path.ts`; a hardcoded `/fr/` or `/images/...` builds fine and 404s under a sub-path, so keep
them out.

### GitHub Pages

`.github/workflows/deploy.yml` builds on every push to `main` and derives the base from the
repository name, so renaming the repository moves the site with no edit. In the repository settings,
set **Pages → Source** to **GitHub Actions**. The repository has to be public, or Pages needs a paid
plan. `public/.nojekyll` is what stops Pages from discarding `_astro/`.

Decap CMS does not work there: `git-gateway` is a Netlify service, so `/admin` is dead and dishes are
edited as Markdown files.

### Netlify

`netlify.toml` declares the build command, the publish directory, the Node version and the security
headers. Then:

1. Enable **Netlify Identity** and set registration to invite-only.
2. Enable **Git Gateway** under Identity → Services.
3. Invite the restaurant's email address. They set their own password at `/admin/`.

The CMS commits straight to `main`, so a CMS edit triggers a rebuild. The root URL redirects to
`/fr/` by default, or to `/en/` when the browser asks for English; `dist/index.html` also carries a
meta-refresh fallback, so the redirect rules are not load-bearing. Both language pages are statically
generated and cross-linked with `hreflang`.

## QR code

```bash
npm run qr https://xtiany0.github.io/ZITAWI_menu-DIG/
```

Writes to `qr/`: an SVG and a 2000px PNG of the code, plus `chevalet-table.html`, an A5 table card
ready to print from a browser. Regenerate it whenever the site URL changes.

## Photography

31 dish photos, extracted from `zitawi-menu-structure.pdf` with `pdfimages`. These are used rather
than the cut-outs bundled with the handoff, which still carry uncut slabs of the yellow sheet.

They come off a printed yellow card. The first pass flood-filled that yellow away from the border,
but it could not reach yellow enclosed by food — a plate rim, a gap between two skewers. On 2a's
yellow ground the residue was invisible; on 3a's cream paper every one of them reads as a stain.

`scripts/clean-photos.mjs` grows out of the border fill into the sheet's yellow and stops there, then
flattens the result onto white. It keys on green sitting close to red, which is what separates the
sheet `(240,224,32)` from fries `(240,176,0)` and cheese `(240,112,0)`. A plain hue window was tried
and rejected: it ate bread and rice.

Six dishes carry no photo because the PDF shows none: Plat double, Plat KFC, Plat de riz simple,
Portion de frites, Sandwich double and Boisson énergétique. Those show the empty "PHOTO" slot. The
pizzas never get a medallion, which is the handoff's own choice.

The photo-to-dish pairing is a hypothesis read off the printed card, and "Plat poulet / plat viande"
shows spaghetti with a whole fish, straight from the PDF. Both go on the list of things to confirm
with the restaurant, along with the prices and the opening hours.
