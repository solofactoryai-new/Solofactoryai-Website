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
| `src/pages/` | The pages: `index` (home), `platform`, `how-it-works`, `ai-workforce`, `vision`, `about`, `early-access`, `privacy` (a draft until approved), and `sitemap.xml` |
| `src/components/home/` | The homepage sections, in the order of the rebuild brief (2026-11-22) |
| `src/components/` | `Nav`, `Footer`, `Logo`, `Icon`, `EarlyAccessForm`, and `ui/` (`PageHero`, `CtaBand`) |
| `src/data/` | What exists today and what is planned: `workers.ts` (the AI Workers) and `journey.ts` (the eight stages). Check the live product before marking anything Early Access |
| `src/config/` | `site.ts` (every page's address, the menu, the sitemap) and `waitlist.ts` (the Google Form) |
| `src/layouts/Page.astro` | Every page: top bar, footer, reveal-on-scroll and the analytics hooks |
| `src/styles/global.css` | Design tokens (colours, type, spacing) and shared styles |
| `src/scripts/waitlist.ts` | The early-access form: validation and sending |
| `src/layouts/Base.astro` | Page title, description, Open Graph and Twitter cards, structured data |
| `src/pages/og-card.astro` | The source of `public/og.png`, the social sharing image |
| `public/` | The logo files (`brand/mark.png`, `brand/icon-512.png`), favicons and the social image |

Icons are [Lucide](https://lucide.dev) shapes (ISC licence), inlined in `Icon.astro`. The font is
Inter, served from the site itself through Fontsource (SIL Open Font Licence): no request goes to a
third-party font service.

## Design

The website looks like the SoloFactory AI product (PRD 2.10); the founder kept these three colours
over a dark design on 2026-11-22. `global.css` uses the
product's tokens: white and light grey (`#F1F1F1`) backgrounds, `#171717` text, `#636363`
secondary text, `#E5E5E5` borders, black (`#080808`) buttons, 6/8/12 px corners, and Inter.
The only black area is the top bar. Sections alternate white and light grey, as the product's
pages do.

The logo is the V4 "Architectural" five-blade mark from the founder's logo deck ("SoloFactory AI:
Final Logo Refinement"), chosen for the website on 2026-11-20. The deck notes that no trademark
search has been done yet. `Logo.astro` draws the mark from `public/brand/mark.png` as a mask, so
it takes the text colour around it. To change the logo, replace the files in `public/brand/` and
the favicons.

## Settings

Copy `.env.example` to `.env`, or set these in your host's build settings:

| Variable | Use | Default |
|---|---|---|
| `SITE_URL` | The public address, for canonical and social links | `https://solofactory.ai` |
| `PUBLIC_WAITLIST_ENDPOINT` | Where the early-access form sends its data | empty |

Both are read at **build** time: rebuild after changing them.

## The early-access form

The form, on `/early-access`, asks for name, email, the business stage (Idea, Exploring, Building,
Already operating), what the person is trying to build, and consent to be emailed (the rebuild
brief, 2026-11-22). It checks every field in the browser before sending.

**Sign-ups go to the founder's Google Form** "SoloFactory AI early access"
(https://forms.gle/1R982dbffSKiDik79), set up on 2026-11-22. They appear in the form's Responses
tab. The visitor stays on the site: the page posts the answers to the form's `formResponse`
address in the background. The form ID and question IDs are in `src/config/waitlist.ts`.

Google does not let the page read its answer, and it drops a sign-up it does not accept without
saying so. So the Google Form must accept everything the page sends:

- No question may be required that the page does not send. The old Business type and Website
  questions are no longer sent: they must not be required.
- The stage question must be Short answer, or offer exactly the four stages in
  `src/config/waitlist.ts`. Change both together.
- If a question is added, removed or recreated, its ID changes: update `src/config/waitlist.ts`.
  The IDs can be read from the form's public page (`FB_PUBLIC_LOAD_DATA_`).

With no Google Form configured, the form can instead send JSON to `PUBLIC_WAITLIST_ENDPOINT`. With
neither, it still checks the fields, then tells the visitor plainly that sign-up is not connected
yet and that nothing was sent. It never shows a false success message.

`PUBLIC_WAITLIST_ENDPOINT` must accept a `POST` with this JSON body and answer with a 2xx status:

```json
{
  "name": "Ada Founder",
  "email": "ada@example.com",
  "stage": "Exploring",
  "building": "An online bakery",
  "consent": "Yes",
  "source": "solofactory.ai"
}
```

The endpoint must allow cross-origin requests from the
site's address (CORS), or the browser blocks the request. Options:

- **A form service** such as Formspree, Basin or Getform: create a form and use its endpoint URL.
  Most accept JSON and handle CORS and spam filtering.
- **SoloFactory AI's own backend:** a small endpoint that stores the entry and sends a confirmation
  email. This keeps the list in your own database.
- **A serverless function** (AWS Lambda behind API Gateway, or a Cloudflare Worker) that writes to a
  table or a mailing list.

Whichever you choose, the privacy notice (`/privacy`) must cover the details collected.

A hidden field catches simple bots: if it is filled in, nothing is sent.

## The social image

`public/og.png` (1200 × 630) is rendered from `src/pages/og-card.astro`. After changing the card,
run `npm run dev`, then capture it with headless Chrome or Edge:

```bash
chrome --headless=new --hide-scrollbars --window-size=1200,630 --screenshot=public/og.png http://localhost:4321/og-card/
```

## Deploying

`npm run build` writes everything to `dist/`.

The site lives on AWS, in the SoloFactory AI account (Mumbai, `ap-south-1`), approved by the founder
on 2026-11-21:

- **`infra/website.yaml`** (CloudFormation stack `solofactory-website`): a private S3 bucket and
  what serves it over HTTPS, chosen by `Frontend`. About $0 to $1 a month.
  - **`apigateway` (live since 2026-11-22):** a regional REST API that reads the bucket with its own
    role. A stand-in, because AWS has not yet verified the account for CloudFront (the error asks
    for an AWS Support case). It has no plain-HTTP address (`http://solofactory.ai` does not
    answer; browsers go to https), and `www` shows the site instead of redirecting. Requests are
    capped at 50 a second.
  - **`cloudfront` (the aim):** CloudFront in front of the bucket, with a small function that
    sends `www` to the bare domain and plain HTTP to HTTPS. Switch once AWS verifies the account,
    then point the two DNS records at the distribution.
- **Certificates** for `solofactory.ai` and `www.solofactory.ai`, requested with the AWS CLI outside
  the stack and proved with two CNAME records at Hostinger (the same records serve both): one in
  `ap-south-1` for API Gateway (`RegionalCertificateArn`) and one in `us-east-1` for CloudFront
  (`CertificateArn`).
- **Search engines:** `AllowIndexing=true` since the early-access form works (2026-11-22, the
  founder's choice). `false` sends `X-Robots-Tag: noindex`.
- **DNS at Hostinger:** `solofactory.ai` is a CNAME at `@` (Hostinger stores it as an ALIAS) to the
  stack output `ApexTarget`, and `www` a CNAME to `WwwTarget`. Leave the MX and TXT records alone:
  they carry the domain's email at Hostinger.

To publish, with the AWS CLI profile `solofactory` signed in (`aws login --remote --profile
solofactory-login --region ap-south-1`):

```bash
bash scripts/publish-aws.sh            # the live site
bash scripts/publish-aws.sh preview    # the test link, hidden from search engines
```

The test link is https://solofactory-ai-website-test.s3.ap-south-1.amazonaws.com/index.html.
Pages are built as folders (`dist/platform/index.html`); the script also stores each one under its
bare path (`platform`), because neither front end looks for `index.html` inside a folder.

To change the stack itself:

```bash
aws cloudformation deploy --profile solofactory --region ap-south-1 --stack-name solofactory-website \
  --template-file infra/website.yaml --capabilities CAPABILITY_IAM \
  --parameter-overrides Frontend=apigateway RegionalCertificateArn=<ap-south-1 arn> AllowIndexing=true
```

## Content rules

The page keeps to these, and changes should too:

- The brand is always written **SoloFactory AI**.
- It speaks to every kind of entrepreneur, not only software founders.
- No invented customers, numbers, testimonials, partner logos or investor names.
- What exists today is marked **In early access**; everything else is marked **On our roadmap** or
  **In development**. The credits, founder support and marketplace are not presented as available.
- No promise of investment, funding, an acquisition or an exit.
- Illustrations are concepts, not product screenshots, and say so.
