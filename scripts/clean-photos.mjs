/**
 * Lifts the printed sheet's yellow out of the dish photos and flattens them
 * onto white.
 *
 * The photos are cut from the client's printed menu, which is a yellow card.
 * The first pass of the pipeline flood-filled the yellow away from the border,
 * but it could not reach yellow enclosed by food — a plate rim, a gap between
 * two skewers. On the 2a ground that residue was invisible. On 3a's cream paper
 * every one of them reads as a stain, so they have to go.
 *
 * Usage: node scripts/clean-photos.mjs [--dry-run]
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIR = "public/images/menu";
const DRY = process.argv.includes("--dry-run");

/** Paper: what the earlier pass already flattened in. */
const paper = (r, g, b) => r > 244 && g > 242 && b > 228;

/**
 * The sheet's yellow keeps red and green close together with almost no blue.
 * The two things this must not eat sit far below it on green: fries read
 * (240,176,0) and cheese (240,112,0), against (240,224,32) for the sheet.
 */
const sheet = (r, g, b) => {
  if (r < 215) return false;
  const ratio = g / r;
  if (b <= 110) return ratio >= 0.82;
  if (b <= 205) return ratio >= 0.93 && g >= 232;
  return false;
};

/** Components smaller than this are anti-aliasing crumbs, not food. */
const CRUMB = 24;

function flood(data, w, h, c, seen, seeds, test) {
  const stack = [...seeds];
  for (const p of seeds) seen[p] = 1;
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (seen[p]) return;
    const i = p * c;
    if (!test(data[i], data[i + 1], data[i + 2])) return;
    seen[p] = 1;
    stack.push(p);
  };
  while (stack.length) {
    const p = stack.pop();
    const x = p % w;
    const y = (p / w) | 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) if (dx || dy) push(x + dx, y + dy);
    }
  }
}

let changed = 0;
for (const file of fs.readdirSync(DIR).sort()) {
  const source = path.join(DIR, file);
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const seen = new Uint8Array(w * h);

  // Pass 1: reclaim the paper from the border inwards.
  const border = [];
  const admit = (x, y) => {
    const p = y * w + x;
    const i = p * c;
    if (paper(data[i], data[i + 1], data[i + 2])) border.push(p);
  };
  for (let x = 0; x < w; x++) { admit(x, 0); admit(x, h - 1); }
  for (let y = 0; y < h; y++) { admit(0, y); admit(w - 1, y); }
  flood(data, w, h, c, seen, border, paper);

  // Pass 2: grow out of that region into the yellow it could not reach, and no
  // further. Food is only ever approached through yellow, never head-on.
  const edge = [];
  for (let p = 0; p < w * h; p++) if (seen[p]) edge.push(p);
  flood(data, w, h, c, seen, edge, (r, g, b) => paper(r, g, b) || sheet(r, g, b));

  // Pass 3: whatever survives in specks too small to be a dish is debris.
  const label = new Int32Array(w * h).fill(-1);
  for (let start = 0; start < w * h; start++) {
    if (seen[start] || label[start] !== -1) continue;
    const part = [start];
    label[start] = start;
    for (let k = 0; k < part.length; k++) {
      const p = part[k];
      const x = p % w;
      const y = (p / w) | 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const q = ny * w + nx;
          if (seen[q] || label[q] !== -1) continue;
          label[q] = start;
          part.push(q);
        }
      }
    }
    if (part.length < CRUMB) for (const p of part) seen[p] = 1;
  }

  let filled = 0;
  for (let p = 0; p < w * h; p++) {
    if (!seen[p]) continue;
    filled += 1;
    const i = p * c;
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = 255;
  }

  console.log(`${((filled / (w * h)) * 100).toFixed(1).padStart(5)}%  ${file}`);
  if (DRY) continue;

  await sharp(data, { raw: { width: w, height: h, channels: c } })
    .flatten({ background: "#ffffff" })
    .resize(160, 160, { fit: "cover" })
    .webp({ quality: 88 })
    .toFile(`${source}.tmp`);
  fs.renameSync(`${source}.tmp`, source);
  changed += 1;
}
console.log(DRY ? "dry run, nothing written" : `${changed} photos rewritten`);
