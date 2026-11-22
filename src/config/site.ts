/* The site's pages, in one place, so every link and the sitemap agree (the rebuild brief,
   part 2). Insights is not listed: it appears only once a real article exists.

   HOME is "/" on solofactory.ai. The S3 test link has no page at "/", so its build sets
   PUBLIC_HOME_PATH=index.html (scripts/publish-aws.sh preview). It is given without the leading
   slash because Git Bash on Windows rewrites "/index.html" into a Windows path. */
const homeEnv = (import.meta.env.PUBLIC_HOME_PATH ?? "").trim().replace(/^\/+/, "");
export const HOME = homeEnv ? `/${homeEnv}` : "/";

export const routes = {
  home: HOME,
  platform: "/platform",
  howItWorks: "/how-it-works",
  workforce: "/ai-workforce",
  vision: "/vision",
  about: "/about",
  earlyAccess: "/early-access",
  privacy: "/privacy",
} as const;

/* The top bar: five pages in the middle, early access on the right. */
export const mainNav = [
  { href: routes.platform, label: "Platform" },
  { href: routes.howItWorks, label: "How It Works" },
  { href: routes.workforce, label: "AI Workforce" },
  { href: routes.vision, label: "Vision" },
  { href: routes.about, label: "About" },
];

/* Pages listed in sitemap.xml (paths on solofactory.ai). */
export const sitemapPaths = [
  "/",
  routes.platform,
  routes.howItWorks,
  routes.workforce,
  routes.vision,
  routes.about,
  routes.earlyAccess,
  routes.privacy,
];
