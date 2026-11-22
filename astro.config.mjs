// SoloFactory AI website: a static one-page site (Astro builds plain HTML and CSS).
import { defineConfig, passthroughImageService } from "astro/config";

// The public address of the site, used for canonical and social links. Set SITE_URL when
// the domain is live (README, "Deploying").
const site = process.env.SITE_URL || "https://solofactory.ai";

export default defineConfig({
  site,
  // No image processing is needed: every visual is SVG or a ready-made PNG.
  image: { service: passthroughImageService() },
  // Pages are built as folders (/platform/index.html) and linked without a trailing slash
  // (/platform). The publish scripts also store each page under its bare path, because the
  // AWS front end does not look for index.html inside folders (README, "Deploying").
  trailingSlash: "never",
  build: { inlineStylesheets: "auto", format: "directory" },
  devToolbar: { enabled: false },
});
