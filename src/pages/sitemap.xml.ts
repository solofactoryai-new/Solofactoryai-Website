/* sitemap.xml: the public pages (src/config/site.ts), on the site's address. The privacy page is
   left out while it is a draft. */
import type { APIRoute } from "astro";
import { sitemapPaths, routes } from "../config/site";

const privacyIsDraft = true; // Keep in step with `draft` in src/pages/privacy.astro.

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL("https://solofactory.ai")).origin;
  const urls = sitemapPaths
    .filter((p) => !(privacyIsDraft && p === routes.privacy))
    .map((p) => `  <url><loc>${base}${p === "/" ? "/" : p}</loc></url>`)
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
};
