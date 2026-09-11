import { mkdir, writeFile } from "node:fs/promises";
import QRCode from "qrcode";

const url = process.argv[2] ?? "https://zitawi.com";
const outDir = new URL("../qr/", import.meta.url);

await mkdir(outDir, { recursive: true });

const options = {
  errorCorrectionLevel: "H",
  margin: 2,
  color: { dark: "#15201B", light: "#FFFFFF" },
};

const svg = await QRCode.toString(url, { ...options, type: "svg", width: 1200 });
await writeFile(new URL("zitawi-qr.svg", outDir), svg, "utf8");
await QRCode.toFile(new URL("zitawi-qr.png", outDir).pathname, url, {
  ...options,
  width: 2000,
});

const card = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Zitawi, chevalet de table</title>
<style>
  @page { size: A5 portrait; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Outfit", "Inter Tight", system-ui, sans-serif; }
  .card {
    width: 148mm; height: 210mm; padding: 18mm 14mm;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; background: #fdfdfc; color: #15201b;
  }
  .brand { font-size: 13mm; font-weight: 600; letter-spacing: -0.02em; }
  .lead { margin-top: 4mm; font-size: 4.6mm; line-height: 1.5; color: #5a6660; max-width: 95mm; }
  .qr { margin: 10mm 0; width: 78mm; height: 78mm; }
  .foot { font-size: 4mm; color: #5a6660; }
  .accent { color: #1e4d3a; font-weight: 600; }
</style>
</head>
<body>
  <div class="card">
    <p class="brand">Zitawi</p>
    <p class="lead">Scannez pour voir la carte complète.<br>Scan to see the full menu.</p>
    <img class="qr" src="zitawi-qr.svg" alt="QR code">
    <p class="foot"><span class="accent">${url.replace(/^https?:\/\//, "")}</span></p>
  </div>
</body>
</html>
`;
await writeFile(new URL("chevalet-table.html", outDir), card, "utf8");

console.log(`QR generated for ${url} in ./qr`);
