import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves this from /<repo>/, Netlify from the root. The workflow
// passes both values in; an unset environment builds for the root, as before.
const base = process.env.PUBLIC_BASE ?? "/";
const site = process.env.PUBLIC_SITE ?? "https://zitawi.com";

export default defineConfig({
  site,
  base,
  // host: true binds IPv4 and IPv6 so VS Code port forwarding can reach it.
  server: { host: true, port: 4399 },
  vite: {
    plugins: [tailwindcss()],
    // VS Code port forwarding serves the dev server from a devtunnels.ms host.
    server: { allowedHosts: [".devtunnels.ms"] },
    preview: { allowedHosts: [".devtunnels.ms"] },
  },
});
