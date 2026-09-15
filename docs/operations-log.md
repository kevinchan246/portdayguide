# Operations log

This is a public technical log. Business metrics and private reports belong in private storage and owner-only communication.

## 2026-09-14 — Automation setup

- Confirmed GitHub repository and Netlify production architecture. Main began at `b09919a3a837a1655ecb8ac53e4906587142355f`.
- Reviewed and merged existing Tokyo→Yokohama guide PR #12 at head `325a4ebdeab33969ab8bd87db7a4cdf7798741f9`; merge commit `0b218a199d1900f15af3e66d1255844f8c4727b5`. Required CI and deploy-preview checks passed. Official terminal/railway source review and read-only preview product checks passed.
- Added bounded public health checks, private daily click summaries, known operator-test exclusion, aggregate retention, and recurring-operation instructions.
- GSC and Viator booking/commission baselines are unavailable. Netlify connection was confirmed by the owner; an authenticated private report read is still needed.
- Private scheduled-function execution still needs authenticated runtime verification; deployment does not prove a successful private report run.

- First production HTTP baseline at 2026-09-14T04:15:50Z passed all 8 checks: four pages, robots, sitemap and two product endpoints. The Tokyo guide is live, indexable, self-canonical and present in the sitemap. No sponsored links were clicked.

## 2026-09-14 — Rollout verified

- Automation PR #13 merged as `709cc486bae1db5e6b80574eaf34821610aa6268`. CI passed all 65 tests and lint. Netlify deploy-preview passed eight HTTP checks.
- The production privacy notice contains the new aggregate-retention text, confirming the release is serving on the canonical domain. Final production health checks passed.
- The first GitHub-hosted `Live site health` run completed successfully: https://github.com/kevinchan246/portdayguide/actions/runs/34805785786 . The daily schedule is now present on main.
- ChatGPT daily anomaly checks (90 runs, starting September 14, about 10:00 America/Chicago) and weekly operating work (13 Tuesdays, starting September 15, about 09:00 America/Chicago) were created successfully and enabled. They use verified GitHub and public HTTP access; newly connected private data sources need a successful read before becoming dependencies.
- Daily private summary code is deployed for 05:07 UTC. Its first execution and private data output remain unverified; inspect the Netlify scheduled function and `affiliate-reports-v1/latest` after it runs. GSC and Viator financial data still need verified access.

## 2026-09-14 — Recommendation layout and disclosure cleanup

- Owner requested full-width cards when a recommendation group has only one product, and one small affiliate notice at the bottom of every page.
- Added a scoped single-card grid span; removed repeated content notices and footer navigation copies. RootLayout now renders one shared commission notice with the disclosure link, including planner/shared and legal pages. Printed plans retain the bottom notice.
- Preserved booking links, attribution, source pricing, article content and URLs. Updated disclosure-page placement wording to match the interface.
- Local lint, production build and all 65 existing tests passed. Production and responsive visual verification follow the PR checks. No affiliate links were clicked.

## 2026-09-15 — Weekly Tokyo-to-Yokohama review

- Reviewed current main `4b81d0787080cf83d88988f87ff5fad0ba9cfb72`, operating instructions and open PRs. Unrelated PR #4 was left untouched. PR #14's verify, Netlify preview, header and redirect checks passed; authenticated Netlify deployment metadata confirms that exact main commit is published and ready.
- Latest GitHub-hosted health evidence: https://github.com/kevinchan246/portdayguide/actions/runs/34882066868 , checked at 2026-09-14T18:38:59.310Z: seven passes, one HTTP 503 from the general Yokohama product endpoint, no empty-inventory warnings. The focused transfer endpoint passed with one product.
- Ran the repository GET-only production checker on September 15. The 14:19:42Z inspection had four network timeouts and four passes; these were not interpreted as a site-wide outage. The 14:20:58.638Z repeat passed all eight targets, with zero failures or warnings, 12 general Yokohama products and one focused transfer. Page indexing directives, self-canonicals, robots, sitemap and affiliate-link checks passed. The earlier 503 was not reproduced.
- Inspected the public transfer response: product `320728P219` explicitly describes Tokyo city-hotel pickup to Yokohama Cruise Port, with campaign `pdg-tokyo-to-yokohama-cruise-terminal` and the configured partner ID preserved. The component preserves placement `tokyo-hotel-port-transfers` and sponsored link attributes. No sponsored links were followed and no click events were sent.
- The observed transfer response did not supply a pricing package type. Existing rendering correctly avoids inventing a per-person/per-group label; exact pricing-unit verification remains unavailable. Product direction does not establish availability for a particular terminal, date or party. No speculative inventory or pricing change was made.
- Authenticated Netlify read-only project/deployment access succeeded and lists the daily-report schedule. This does not verify a completed private report. Available connector methods do not expose Blobs reports, and the operator environment lacks the credentials required by the existing report reader. GSC and Viator order/commission reads remain unverified; unavailable metrics were not recorded as zero.
- Local lint, production build and all 65 tests passed. This review changes only this public technical log; no feature, article, URL, affiliate attribution, DNS, account or spending changes.
- Next evidence: confirm the pricing package type from a successful source response, monitor recurrence of the product-endpoint 503, and establish a harmless authenticated read of `affiliate-reports-v1/latest` before using its timestamp and complete-period aggregates. Do not expand content or infer commercial performance without acquisition and order evidence.
