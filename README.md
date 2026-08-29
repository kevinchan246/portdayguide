# PortdayGuide

PortdayGuide is a Next.js App Router site for cruise-port guides, shore-day planning, and matched Viator excursion recommendations. Production uses the canonical domain `https://portdayguide.com`.

## Runtime

- Node.js `22.13.0` or newer
- Next.js `16.2.6`
- React `19.2.6`
- Netlify OpenNext adapter (automatic; do not pin `@netlify/plugin-nextjs`)

## Local development

```bash
npm ci
cp .env.example .env.local
npm run dev
```

The site works without a Viator key, but live affiliate recommendations return a safe `not_configured` response until the server-side key is present.

## Environment variables

| Variable | Required | Scope | Purpose |
| --- | --- | --- | --- |
| `VIATOR_API_KEY` | Production | Server runtime | Viator Partner API authentication. Store as a Netlify secret; never prefix with `NEXT_PUBLIC_`. |
| `VIATOR_API_ROOT` | Recommended | Server runtime | Use `https://api.viator.com/partner` in production. |
| `NEXT_PUBLIC_VIATOR_AFFILIATE_SUFFIX` | Optional | Build + browser | Additional public affiliate query parameters, without a leading `?`. |

Configure these in Netlify under **Project configuration → Environment variables**. Netlify does not read committed `.env` files during a remote build, and secrets must not be committed.

## Verification

```bash
npm run lint
npm test
```

`npm test` creates a production Next.js build, starts it locally, and runs the complete rendered-page, SEO, sitemap, redirect, API, and planner regression suite against the real HTTP server.

## Netlify deployment

1. Import `kevinchan246/portdayguide` into Netlify.
2. Select the migration branch for the first deploy preview.
3. Leave the publish directory unset; Netlify detects Next.js and provisions OpenNext automatically.
4. Add the environment variables above and deploy.
5. Verify the preview against the migration checklist before changing DNS.
6. Keep `portdayguide.com` on the current host until the production Netlify deploy passes parity checks.

The build command and Node version are recorded in `netlify.toml`. API route handlers are deployed as Netlify Functions, while Next.js proxy behavior preserves the legacy Grand Cayman redirect, canonical `www` redirect, and security headers.

## SEO invariants

The migration must not change:

- public paths or trailing-slash behavior
- page titles, descriptions, headings, or article content
- self-referencing canonical URLs on `https://portdayguide.com`
- sitemap and robots directives
- structured data and reciprocal related-guide links
- the permanent redirect from `/ports/george-town-grand-cayman` to `/ports/grand-cayman`

The pre-migration ChatGPT Sites production baseline is retained in Git as the annotated tag `sites-final-v53`.
