/**
 * GitHub Pages serves a project site from a sub-path (/<repo>/), Netlify from
 * the root. Every absolute URL the site writes has to carry whichever prefix
 * the build was given, so route them all through here rather than hardcoding.
 */
const BASE = import.meta.env.BASE_URL;
const ROOT = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;

export function withBase(path: string): string {
  return ROOT + (path.startsWith("/") ? path : "/" + path);
}
