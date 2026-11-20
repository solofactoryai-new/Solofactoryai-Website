# SoloFactory AI website

The one-page website for **SoloFactory AI**: *Build Your Business. Not Your Team.*

It is a static site built with [Astro](https://astro.build): every page is plain HTML and CSS, with a
little JavaScript for the mobile menu, the scroll fade-ins and the early-access form. It can be
hosted on any static host.

## Run it

Needs Node.js 20 or later.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # type-checks, then writes the site to dist/
npm run preview    # serves dist/ to check the production build
```

## What is where

| Path | What it is |
|---|---|
| `src/pages/index.astro` | The page: the sections in order |
| `src/components/` | One component per section (`Hero`, `Problem`, `Solution`, `Journey`, `Workforce`, `Ecosystem`, `Ownership`, `Vision`, `FinalCta`), plus `Nav`, `Footer`, `Logo`, `Icon` and `HeroVisual` |
| `src/styles/global.css` | Design tokens (colours, type, spacing) and shared styles |
| `src/scripts/waitlist.ts` | The early-access form: validation and sending |
| `src/layouts/Base.astro` | Page title, description, Open Graph and Twitter cards, structured data |
| `src/pages/og-card.astro` | The source of `public/og.png`, the social sharing image |
| `public/` | Favicon and the social image |

Icons are [Lucide](https://lucide.dev) shapes (ISC licence), inlined in `Icon.astro`. Fonts are
Inter and Instrument Serif, served from the site itself through Fontsource (SIL Open Font Licence):
no request goes to a third-party font service.

## Settings

Copy `.env.example` to `.env`, or set these in your host's build settings:

| Variable | Use | Default |
|---|---|---|
| `SITE_URL` | The public address, for canonical and social links | `https://solofactory.ai` |
| `PUBLIC_WAITLIST_ENDPOINT` | Where the early-access form sends its data | empty |

Both are read at **build** time: rebuild after changing them.

## The early-access form

The form asks for name, email, business type and, optionally, a website. It checks every field in
the browser before sending.

**No sign-up service is connected yet.** Until `PUBLIC_WAITLIST_ENDPOINT` is set, the form still
checks the fields, then tells the visitor plainly that sign-up is not connected yet and that nothing
was sent. It never shows a false success message.

To connect it, set `PUBLIC_WAITLIST_ENDPOINT` to an address that accepts a `POST` with this JSON
body and answers with a 2xx status:

```json
{
  "name": "Ada Founder",
  "email": "ada@example.com",
  "businessType": "Ecommerce or D2C",
  "website": "https://example.com",
  "source": "solofactory.ai"
}
```

`website` is an empty string when not given. The endpoint must allow cross-origin requests from the
site's address (CORS), or the browser blocks the request. Options:

- **A form service** such as Formspree, Basin or Getform: create a form and use its endpoint URL.
  Most accept JSON and handle CORS and spam filtering.
- **SoloFactory AI's own backend:** a small endpoint that stores the entry and sends a confirmation
  email. This keeps the list in your own database.
- **A serverless function** (AWS Lambda behind API Gateway, or a Cloudflare Worker) that writes to a
  table or a mailing list.

Whichever you choose, the privacy notice must cover the details collected. The line under the form
says they are used only to contact the person about early access.

A hidden field catches simple bots: if it is filled in, nothing is sent.

## The social image

`public/og.png` (1200 × 630) is rendered from `src/pages/og-card.astro`. After changing the card,
run `npm run dev`, then capture it with headless Chrome or Edge:

```bash
chrome --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=public/og.png http://localhost:4321/og-card/
```

## Deploying

`npm run build` writes everything to `dist/`. Any static host works:

- **GitHub Pages:** a workflow that runs `npm ci && npm run build` and publishes `dist/` (Astro's
  guide: https://docs.astro.build/en/guides/deploy/github/). Set `SITE_URL` to the Pages or custom
  address.
- **AWS (S3 and CloudFront), Netlify, Vercel or Cloudflare Pages:** build command `npm run build`,
  output folder `dist`.

## Content rules

The page keeps to these, and changes should too:

- The brand is always written **SoloFactory AI**.
- It speaks to every kind of entrepreneur, not only software founders.
- No invented customers, numbers, testimonials, partner logos or investor names.
- What exists today is marked **In early access**; everything else is marked **On our roadmap** or
  **In development**. The credits, founder support and marketplace are not presented as available.
- No promise of investment, funding, an acquisition or an exit.
- Illustrations are concepts, not product screenshots, and say so.
