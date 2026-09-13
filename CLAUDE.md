# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (FR/EN) static digital menu for the Zitawi restaurant in Cotonou, Benin, opened from a QR
code on the tables. Astro 5 + Tailwind v4, deployed to Netlify. The restaurant edits dishes through
Decap CMS at `/admin`; no ordering backend exists — the order is assembled in the browser and handed
off as a pre-filled WhatsApp message.

## Commands

```bash
npm run dev                      # dev server on http://localhost:4399, host: true
npm run build                    # static output to dist/
npm run preview
npx astro check                  # type check (no npm script wires it up)
npm run qr https://zitawi.com    # writes qr/: SVG, 2000px PNG, and chevalet-table.html (A5 table card)
```

There is no test suite and no linter. Verification is `npx astro check` plus a build.

## Architecture

**Everything is prerendered, all interactivity is inline script.** `src/pages/[lang]/index.astro`
generates `/fr/` and `/en/` from `getStaticPaths()`. Every dish in every category is rendered into
the HTML for both languages. There are no framework islands: the whole cart, search, tab and
persistence layer is one `is:inline` script at the bottom of that page, plus a small module script in
`SiteHeader.astro` for the collapsing masthead and the language switch. Adding or repricing a dish
requires a rebuild, not a client update.

**Search and tabs are display toggles, not re-renders.** `render()` in the page script walks
`[data-row]` elements and sets `row.style.display`. The per-category counter is recomputed from what
is on screen, and a section with zero visible rows hides itself. The rail doubles as a position
indicator: `spy()` marks the section currently under it, but only while the category is "Tout" and
the search is empty, because the pressed pill and the marker would otherwise contradict each other.

**The cart key is a load-bearing string contract.** Keys are
`` `${catLabel}|${name}${variant ? ` (${variant})` : ""}|${price}` ``, built in `read()` and rebuilt
in `restore()` from the `data-cat-label` / `data-name` / `data-prices` / `data-labels` attributes that
`MenuSection.astro` emits. The price is deliberately part of the key: on restore, any stored key that
no row can currently produce is dropped, so a repriced or withdrawn dish silently falls out of a saved
order. Changing the key format, the category labels, or those data attributes invalidates every saved
cart and must be changed in `MenuSection.astro` and the page script together. State persists under
`localStorage["zitawi-order-2a"]` for 12 hours.

**Two tariffs per dish.** A dish with `price_alt` plus matching `options_fr`/`options_en` renders two
choice pills; the selected one drives the displayed price, the cart key and the total, so the same
dish can appear in an order under both variants. `price_alt` without a matching option pair is
ignored (`optionLabels()` in `MenuSection.astro`), which is what stops a half-filled CMS entry from
rendering a priceless button.

**The content schema is a shared contract.** `src/content.config.ts` (Zod) and
`public/admin/config.yml` (Decap) describe the same fields. Adding, renaming or making a field
required means editing both, or the CMS writes files the build rejects. Dish files live in
`src/content/menu/`, one Markdown file per dish, slugged `{category}--{slug}`.

**All user-facing copy lives in `src/i18n/ui.ts`**, along with `PHONE`, `PHONE_DISPLAY` and
`WHATSAPP` (the number the order message is sent to) and `formatPrice`, which prints `6.000` in
French and `6,000` in English. Strings the client script needs are handed over through `define:vars`
in `[lang]/index.astro` — a new client-side string must be added to `ui.ts` *and* to that `copy`
object.

**Styling is Tailwind v4 with no config file.** Design tokens are `@theme` custom properties in
`src/styles/global.css`; there is no `tailwind.config`. Fonts are self-hosted via Fontsource, all
imported in `MenuLayout.astro`.

**The theme is a variable swap, not a second set of classes.** `@theme` holds the light values and
`[data-theme="dark"]` overrides the same custom properties, so every utility keeps working unchanged.
Two consequences bind anything new:

- A raw hex in a component defeats the theme. Colours belong in a token, including inside arbitrary
  values — write `shadow-[4px_4px_0_var(--color-rule)]`, never the hex.
- `--color-ink` flips to near-white in the dark. Anything the handoff lists as unchanged by the theme
  — the banner and its bottom rule, the `+` button, the cart's black header, the skip link — must use
  `--color-black`, which is a constant. `--color-on` / `--color-on-ink` are the "selected" pair, and
  they carry the active tab, the active variant pill, the active service button, the WhatsApp button,
  the language knob, category titles, the cart total and any quantity above zero. They all flip
  together, by design.

A blocking inline script in the head of `MenuLayout.astro` sets `data-theme` before the first paint,
from `localStorage["zitawi-theme"]` and falling back to `prefers-color-scheme`. It has to stay
blocking and it has to stay in the head, or a dark reader gets a flash of the cream page.

## Design constraints to preserve

The implementation follows direction 3a "Crème & accents jaunes" from the handoff in
`Zitawi menu redesign/` (gitignored — reference bundle, not source). 3a is the 2a specification with
one rule applied over it: **yellow is an accent, never a ground.** It survives on the `+` button, the
category title highlight, the active language segment, the rail's position marker and the footer
wordmark, and nowhere else. Points that look like bugs but are deliberate:

- The layout is drawn at 430px and fluid to a 480px centred maximum. It is a phone page, and it stays
  a phone page on a desktop.
- The wordmark is black ringed in white via `-webkit-text-stroke` with `paint-order: stroke fill`,
  matching the shopfront banner. Under 375px it no longer clears the language switch, so the masthead
  gains top padding and the wordmark drops below it rather than shrinking.
- Counters are 26px per the handoff; the `.tap` pseudo-element pushes the hit area to 44px. Do not
  "fix" the visual size.
- The `.mark` highlight needs `leading-none` on its heading. The handoff stops the gradient at 42% of
  the line box, which lands under the glyphs entirely at the default line height.
- Pizzas never get a photo medallion. Six other dishes have no photo in the source PDF and show the
  empty "PHOTO" slot instead.
- Search strips diacritics on both sides, so "pecheur" finds "Pizza du pêcheur".
- Only the category rail is sticky. The masthead scrolls away. A folding masthead was built and
  removed: shortening the document as it folded fed back into the scroll position and flickered.
- The sticky bar is `[data-rail]` and the row that scrolls sideways inside it is `[data-tabs]`; the
  theme button sits outside that row so it stays put while the categories pass it. `spy()` reads the
  bar for its edge and scrolls the row.
- The position marker is outlined, not filled. Filled in the accent, it is the active tab in the
  dark theme, where `--color-on` is the signage yellow.
- The language switch is a vertical toggle, against the handoff, which draws a horizontal pill. It
  was asked for twice, and at 34px wide it is also the only version that clears the wordmark down to
  320px.
- Dish names, prices and ingredient lines are transcribed verbatim from `zitawi-menu-structure.pdf`,
  including lowercase ingredient lines and `+` separators.
- Dish photos come from that same PDF, not from the bundle's `images/` — those still carry uncut
  slabs of the yellow sheet. `scripts/clean-photos.mjs` lifts the sheet's yellow out and flattens
  them onto white; it keys on green being close to red, which is what separates the sheet
  `(240,224,32)` from fries `(240,176,0)` and cheese `(240,112,0)`. A plain hue window was tried and
  rejected: it ate bread and rice.

## Deployment

Two targets, and the difference between them is the URL prefix. GitHub Pages
serves a project site from `/<repo>/`, Netlify from the root, so
`astro.config.mjs` reads `PUBLIC_BASE` and `PUBLIC_SITE` from the environment and
falls back to `/` and `https://zitawi.com` when they are unset. Every absolute
URL the site writes goes through `withBase()` in `src/lib/path.ts`; a new
hardcoded `/fr/` or `/images/...` builds fine and 404s under a sub-path, so keep
them out. `public/.nojekyll` is what stops GitHub Pages from discarding
`_astro/`.

`.github/workflows/deploy.yml` builds on every push to `main` and derives the
base from the repository name, so renaming the repository moves the site with no
edit. Decap CMS does not work on GitHub Pages: `git-gateway` is a Netlify
service, so `/admin` is dead there and dishes are edited as Markdown files.

`netlify.toml` owns the build, the Node version (22), the security headers, and the `/` redirect to
`/en/` when the browser asks for English and `/fr/` otherwise. The CMS needs Netlify Identity
(invite-only) with Git Gateway enabled; the CMS commits straight to `main`, so a CMS edit triggers a
rebuild.
