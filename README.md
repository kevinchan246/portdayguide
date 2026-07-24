# PortdayGuide

PortdayGuide is a cruise port planning website with 64 port guides, port-day itinerary tools, destination articles, live weather context, and Viator excursion discovery.

## Tech stack

- Next.js 16 and React 19
- TypeScript
- Vinext and Vite
- Cloudflare Workers-compatible server output
- ChatGPT Sites hosting configuration

## Local setup

Requirements:

- Node.js 22.13 or newer
- npm
- Linux, WSL, or another environment with Bash, `curl`, `flock`, and GNU `timeout`

Install dependencies:

```bash
npm ci
```

Copy the example environment file and provide your own values:

```bash
cp .env.example .env.local
```

Never commit `.env.local` or any other file containing real credentials. Environment files are ignored by Git.

Start the development server:

```bash
npm run dev
```

## Environment variables

| Variable | Required | Exposure | Purpose |
|---|---:|---|---|
| `VIATOR_API_KEY` | For live Viator products | Server only | Viator Partner API credential |
| `VIATOR_API_ROOT` | No | Server only | Override the Viator API root; production is the default |
| `NEXT_PUBLIC_VIATOR_AFFILIATE_SUFFIX` | No | Browser-visible | Affiliate query string appended to eligible outbound Viator links |

`VIATOR_API_KEY` must be stored as a secret in the hosting provider. Do not rename it with a `NEXT_PUBLIC_` prefix.

## Validation

```bash
npm run lint
npm test
```

`npm test` runs the production build and the rendered-page regression suite.

## Production hosting

The repository includes `.openai/hosting.json` for the existing ChatGPT Sites project. That file contains project configuration, not API credentials. Production secret values are managed separately in the hosting platform and are not stored in this repository.

Before deploying elsewhere, configure the environment variables in that provider's secret or environment settings.

## Main routes

- `/` — homepage
- `/ports` — cruise port guide directory
- `/ports/[slug]` — individual port guides
- `/planner` — cruise port-day planner
- `/blog` — cruise planning blog

## Affiliate disclosure

PortdayGuide may earn a commission from eligible bookings made through affiliate links. The website does not operate tours or complete bookings. See `/disclosure` for the full disclosure.
