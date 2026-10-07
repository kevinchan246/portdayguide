# Organic search audit — October 7, 2026

This document records public technical observations. It does not contain private
traffic, order, commission, account or analytics information. A passing technical
crawl establishes that pages can be inspected; it does not establish Google
indexing, rankings, visitors or revenue.

## Scope and repeatable procedure

The dependency-free script `scripts/audit-organic-site.mjs` requests **every HTML
URL in the live sitemap**, seeds the empty `/share` utility route, then follows
discovered query-free internal HTML links to include public pages such as privacy,
terms and any footer-linked photo attribution page. It never constructs a
shared-plan query. It does not take a sample of port guides. It uses read-only GET
requests, three concurrent workers, a
15-second timeout, one retry, a 3 MiB response limit and a 500-page ceiling.

It records HTTP status, title, description, canonical, H1/H2 headings, index
directives, main body text, internal links, image alt/width/height attributes and
JSON-LD parsing. It also records `robots.txt` directives, homepage reachability,
incoming internal links, sitemap redirects, broken internal HTML links, exact
metadata/body duplicates and descriptive-length observations. Length guidance is
advisory: character counts are not search-engine ranking requirements.

The crawler does **not** request APIs, external destinations, affiliate links or
query-bearing URLs; it does not execute JavaScript or emit click events. This
keeps the audit separate from live product, tracking and booking checks. Image
licensing and image URL availability require their own verification; an `<img>`
element's dimensions and alt text do not establish either.

```sh
# Production baseline; reports stay in the ignored outputs directory.
node scripts/audit-organic-site.mjs \
  --output outputs/organic-production-before.json

# Audit a running production build without changing production canonicals.
node scripts/audit-organic-site.mjs \
  --base-url http://127.0.0.1:4173 \
  --output outputs/organic-local-after.json \
  --compare outputs/organic-production-before.json

# Compare the published site after deployment.
node scripts/audit-organic-site.mjs \
  --output outputs/organic-production-after.json \
  --compare outputs/organic-production-before.json
```

All reports must be written below `outputs/`. Production canonical URLs are
required even on a local build or preview. Host-wide preview HTTP `noindex`
headers are recorded and accepted; an accidental page-level meta `noindex` on a
sitemap route still fails in a local production build or preview. An index-blocked
production sitemap page is a failure. Intentional
`noindex` pages outside the sitemap are retained in the report, with canonical
inconsistencies treated as advisory rather than as evidence of blocked content.
A missing H1 in the noindex `/share` utility's static empty state is also advisory;
the H1 requirement remains blocking for indexable content pages.

## Production baseline

The initial October 7 production sitemap/link crawl inspected **89 sitemap pages
and two linked legal pages: 91 of 91 returned HTTP 200**. The repeatable audit now
also seeds `/share`; comparisons should distinguish an expanded audit inventory
from a newly created site route. The final crawl additionally discovers any new
footer-linked attribution page.

| Public page type | Count |
|---|---:|
| Main port guides | 64 |
| Guides answering specific port questions | 11 |
| Regional directories | 5 |
| Blog articles | 3 |
| Blog index | 1 |
| Port directory | 1 |
| Home, about, planner, disclosure, privacy and terms | 6 |
| **Total** | **91** |

No broken internal HTML links, sitemap redirects, sitemap orphans or sitemap
pages unreachable from the homepage were found. Every audited page was reachable
within two internal-link steps from the homepage. Indexable pages had unique
titles, descriptions and exact normalized main bodies, one H1, and production
self-canonicals. All 239 JSON-LD blocks parsed. `robots.txt` returned HTTP 200,
allowed `/`, disallowed `/api/`, and declared the production sitemap. Across 517
rendered image instances (91 distinct image URLs), no
missing alt attributes or missing explicit width/height attributes were found.

The two legal pages `/privacy` and `/terms` were intentionally `noindex, follow`
and outside the sitemap, but inherited the homepage canonical. Giving them their
own canonical is a consistency repair; retaining `noindex` is appropriate for
the current sitemap policy. Their noindex directive does not block the port or
article pages.

Two description lengths were outside the script's advisory 100–170 character
band: `/ports` was 94 characters and `/ports/cozumel` was 222. No title exceeded
65 characters. These observations justify reviewing clarity and specificity,
not forcing all descriptions to a single length.

## Validation record

The October 7 review covers all **78 content pages: 64 port hubs, 11 guides
answering specific port questions and three blog articles**. Code, page data,
metadata, rendered content and internal navigation were reviewed across that
inventory. This coverage is distinct from fresh factual verification: new
first-party source checking was concentrated on five priority ports, not on every
fact for all 64 destinations.

Existing URLs are retained. The only new route is the footer-linked,
`noindex` photo-credit utility. It makes required source and licensing records
available while visible image credits continue to display the author's name.

An October 7 **Content revised** date records a substantive editorial revision.
It does not mean that every local price, transfer time, terminal operation,
availability or other travel fact was verified in real time on that date. Keep
individual source dates and applicability conditions beside facts where they
matter; preserve the distinction between content revision and source verification.

The ignored per-page JSON reports are the evidence for comparisons. After the
content and metadata changes, repeat the complete crawl against the running
production build and the published origin. Compare route inventory and HTTP
status first, then index directives, canonical URLs, heading/JSON-LD validity and
the internal link graph. Preserve working URLs; redirects or disappeared routes
must be investigated before release.

### Production-build crawl, October 7

The final full local production-build comparison returned **93 of 93 HTML pages
with HTTP 200**: the 89 sitemap routes, privacy and terms, the `/share` seed, and
the new photo-credit utility. All prior routes remained in the inventory. The
comparison's added `/share` entry reflects expanded audit coverage of an existing
route; `/photo-credits` is the actual new route.

There were no blocking canonical, production-indexability, H1, metadata,
JSON-LD, broken internal HTML link, exact duplicate or sitemap-orphan findings.
All 239 JSON-LD blocks parsed, and all sitemap pages remained reachable within
two homepage link steps. Privacy, terms, share and photo credits each had their
own production canonical and intentional noindex directive.

The first local crawl exposed a Kaiyukan card-image regression on the homepage
and blog index: both lacked width/height attributes. After those two instances
were repaired, the final full 93-page crawl confirmed **zero missing image
dimensions or alt attributes across all 534 rendered image instances**. It exited
successfully with zero blocking findings. The regression is closed.

Separately, `lib/local-photo-variants.json` listed **77 originals and 230 responsive
WebP variants: 307 unique local photo paths**. All 307 files existed and matched
the manifest's byte sizes. Read-only HTTP HEAD checks, limited to three workers,
also returned HTTP 200, an image content type and the expected content length for
every path. No API or affiliate destination was requested.

This local run explicitly disabled the Viator API key. Its static image/card
inventory is therefore not a measurement of live production product availability
or a basis for concluding that product counts increased or decreased.

Client-rendered product cards, real photo availability, licensing, visual layout,
and the site-wide production test suite are separate checks. Do not represent a
passing static crawl as evidence that Google crawled a previously discovered
page or that organic performance increased. Evaluate those outcomes later using
dated search evidence at comparable observation windows.
