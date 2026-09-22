# PortdayGuide operating instructions

Owner authorization: on 2026-09-14 the owner approved starting the agreed low-maintenance affiliate operating plan. This document scopes recurring work, preserves context, and records the distinction between deployed capabilities and verified results.

## Canonical project and first experiment

- Repository: `kevinchan246/portdayguide`, production branch `main`.
- Public origin: `https://portdayguide.com`; Netlify project slug `verdant-souffle-f6e570`.
- Hosting remains GitHub → Netlify. Do not deploy the old ChatGPT Sites copy or change DNS.
- First experiment: Tokyo hotel/city → the correct Yokohama embarkation terminal. The existing guide from PR #12 is `/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal`.
- Campaign: `pdg-tokyo-to-yokohama-cruise-terminal`; placement: `tokyo-hotel-port-transfers`.
- Existing related guide: `/ports/yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal`.
- On 2026-09-21 the owner authorized executing the optimization recommended from the privately reviewed acquisition snapshot. Keep Tokyo transfer monitoring, and allow improvements to existing pages selected by verified search evidence, beginning with `/ports/cozumel/taxi-rates`. This does not authorize new port expansion or an article quota.
- On 2026-09-22 the owner requested faster autonomous revenue improvement, including acquisition, and offered manual Viator exports when needed. Continue routine implementation, verified PR merges and publication without repeated approval. Extend the work to sourced purchase-fit fixes, useful shareable resources, and the owned Pinterest RSS feed described in [growth acquisition](growth-acquisition.md). A feed being live is not evidence that Pinterest is connected or that visitors were acquired. Third-party account creation, new paid services, advertising spend and unsolicited messages remain outside this instruction.
- Proposed incremental cash ceiling: $60/month and $180 during the first 90 days. Prefer existing services; no new paid subscription, advertising purchase or upgrade is authorized by this operating instruction alone.

## Jobs

1. **Daily public health:** `.github/workflows/site-health.yml`, 13:17 UTC. Runs a bounded GET-only check, without dependencies or secrets, and keeps public HTTP results as GitHub Actions artifacts for 90 days. A failed run is a signal to investigate, not proof that every visitor sees a broken website. GitHub may delay scheduled work or disable schedules after repository inactivity; inspect the latest run date during the weekly review.
2. **Daily private click summary:** `netlify/functions/affiliate-daily-report.mjs`, 05:07 UTC, production only. Reads the last 28 complete UTC days from `affiliate-clicks-v1`, excludes the exact known operator-test key, and saves `latest` plus per-day records in private `affiliate-reports-v1`. No public report endpoint, credentials, visitor identity, raw event IDs, or business counts go into GitHub logs/artifacts. Raw events retain the existing 90-day deletion schedule. Daily aggregates expire after 365 days. A read/storage error fails the job; never replace unavailable data with zero.
3. **Growth operating agent:** use the existing ChatGPT operating task, expanded to Tuesday and Friday mornings in America/Chicago after its successful update. Fetch this document from current `main` on each run. Use GitHub and public HTTP, both verified for this task. Private services only become dependencies after a successful harmless authenticated read. Do not claim any connection grants access to a report until a read succeeds.
4. **Acquisition preparation:** a separate Monday/Wednesday/Friday task researches a bounded set of real travel questions, checks permitted distribution routes, and maintains the owned RSS feed and practical resources. Its required inputs are GitHub and public pages, not an unconnected social account. The native Pinterest account-to-feed connection is a distinct setup step; once actually confirmed, Pinterest handles publication itself. See the acquisition runbook for duplication and source rules.

## Weekly execution

- Read the latest main commit, open PRs, CI, deploy status and daily health run before changing anything. Reuse existing work and avoid overlapping edits.
- When available, read GSC for the latest complete 28-day period and the preceding equal period. Choose page-level work using clicks, impressions, ranking, search intent and source quality together; do not treat impressions as visits or extrapolate growth from a tiny base. Keep counts and exports private. If access fails, label the last verified snapshot with its date and avoid claims of fresh traffic.
- Run `node scripts/check-live-site.mjs --output outputs/site-health.json`. Check failure classifications, source pages, the exact product direction and inventory count. Never click sponsored links or POST simulated click events during routine monitoring.
- If private reporting access has been verified, read the latest snapshot and compare its `generatedAt` and `to` with the current date. Older than 48 hours is stale. Compare recent complete 7-day periods separately; do not infer visitor CTR or order conversion from click-event totals.
- GSC search clicks, website click events, Viator attributed bookings, cancellations, completed commission and cash paid are different metrics. Keep dates, definitions and sources beside any number. Absent access means unavailable, not zero. Product API success is not access to order/commission reports.
- Choose at most one useful, source-backed improvement per operating run and at most two substantive site/feed improvements across all agents in any seven days. The initial September 22 rollout is a scoped setup batch. Prioritize a confirmed breakage, incorrect product match, or an improvement justified by real demand. Review recent merged work and the acquisition task before editing; allow 14–28 complete days after a substantive SEO change instead of churning the same title or layout. Cozumel's September 21 revision is in observation; Osaka's purchase fit and the existing Tokyo transfer journey are the next focused work. If evidence is insufficient, complete monitoring and record the gap; do not generate articles to meet a quota.
- For changes: work on a branch, preserve URLs/SEO/affiliate attribution, run lint and meaningful tests, open a reviewable PR, inspect all required checks, merge the verified head when checks pass, and confirm the production result. Routine scoped changes are authorized. Do not merge unrelated old PRs automatically, bypass branch protections or change account access, DNS, billing or secrets.
- Source facts about transport, meeting points, luggage, accessibility and prices. Do not fabricate experience, reviews, availability, per-person/per-group units, real-time routes or return-to-ship guarantees. If official sources conflict, leave the disputed edit unpublished and describe the exception.
- Keep an operational entry in `docs/operations-log.md`: timestamp, checked commit, actual change/PR, validation, data availability and next evidence needed. This repository is public: no private traffic, click totals, bookings, earnings, exports or credentials in the log. Report those privately to the owner only after verified access.
- Send a brief Chinese update with completed work and material exceptions. Routine healthy daily runs need no separate chat notification. Never send email, Slack, outreach or messages to third parties without explicit authorization.

## Read private reports

Use the authenticated Netlify Blobs UI or the existing read-only operator credentials. Store credentials outside the repository and outside `NEXT_PUBLIC_` variables:

```sh
node scripts/read-affiliate-report.mjs > outputs/affiliate-report.json
node scripts/report-affiliate-clicks.mjs 2026-09-10 2026-09-13 > outputs/affiliate-clicks.csv
```

The CSV now excludes `2026-09-10/42bdb7ce-45f7-4fa5-8515-26c01f5d9626` before aggregation, preserving other clicks on the same date. Daily report reads are capped at 5,000 source records with a time budget; if volume exceeds that bound, alert and redesign batching instead of silently truncating.

## Deployment acceptance and data connection status

- Verify `affiliate-daily-report` appears as Scheduled in Netlify, run it once with Run now when authenticated access is available, and inspect private `latest`. Code tests and a production deployment do not prove that this job has run successfully.
- Before scheduling work that requires a newly connected plugin, perform a harmless authenticated read. The owner confirmed Netlify connection during setup; actual callable report access must still be verified.
- GSC was successfully read on 2026-09-20, with complete data through 2026-09-18, but a new read on 2026-09-21 returned `payment_required` because the trial ended. It is an optional source until access is restored; do not subscribe, upgrade or claim a fresh read. The owner-private analysis snapshot can support the scoped Cozumel improvement but cannot establish subsequent growth. Viator booking and commission reports are not connected by the product API. Establish an authenticated export/integration separately.
- Milestones: day 30 (2026-10-14), day 60 (2026-11-13), day 90 (2026-12-13). Assess the visitor-to-booking path and operator time, not article count. If acquisition or measurement remains unvalidated, stop expansion and identify the missing evidence.
