import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://zitawi.com",
  // host: true binds IPv4 and IPv6 so VS Code port forwarding can reach it.
  server: { host: true, port: 4399 },
  vite: {
    plugins: [tailwindcss()],
    // VS Code port forwarding serves the dev server from a devtunnels.ms host.
    server: { allowedHosts: [".devtunnels.ms"] },
    preview: { allowedHosts: [".devtunnels.ms"] },
  },
});
