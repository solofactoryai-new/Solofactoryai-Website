// SoloFactory AI website: a static one-page site (Astro builds plain HTML and CSS).
import { defineConfig, passthroughImageService } from "astro/config";

// The public address of the site, used for canonical and social links. Set SITE_URL when
// the domain is live (README, "Deploying").
const site = process.env.SITE_URL || "https://solofactory.ai";

export default defineConfig({
  site,
  // No image processing is needed: every visual is SVG or a ready-made PNG.
  image: { service: passthroughImageService() },
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
});
