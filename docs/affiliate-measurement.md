# Affiliate clicks and Roatán choices

## What ships

The root client listener measures sponsored HTTPS Viator links with a `pid`. It covers dynamically loaded cards, ordinary and keyboard clicks, and middle-clicks without modifying links or delaying navigation. Explicit placements cover intent, activity-match, port, featured and Alaska cards; remaining sponsored links use `other-link`. Product codes come from card data or the Viator URL. Campaign values remain exactly as supplied by Viator. No new attribution parameters are appended.

Records are **click events, not visitors, impressions, purchases or revenue**. The same person can click repeatedly. Accidental repeat clicks within 750 ms are suppressed. Ad blockers, offline browsers, DNT/GPC, context-menu navigation and failed requests can undercount. There is no visitor identifier, cookie or cross-device attribution. Do not calculate a booking conversion rate by joining these events to Viator visitors. A purchased product can differ from the original clicked product.

The native Netlify function writes date-partitioned events to the private site-wide Blobs store `affiliate-clicks-v1`. Storage survives deployments. No GA account or extra production secret is required. Deploy previews and localhost do not record. The function verifies production context, origin and host, restricts payload size, validates fields, and uses Netlify's IP rate limit. It never stores the IP or logs submitted payloads. Origin checking is not authentication; synthetic requests can still inflate public analytics. No public reporting endpoint is provided.

The daily scheduled function removes records older than 90 calendar days. Monitor its function logs for failures; Blobs has no automatic TTL. Hosting/security access logs have their own retention policies.

Roatán selection reserves up to two beach and two private culture/tasting matches, then fills remaining slots only with matching products. Beach references take priority for mixed tours. Empty groups disappear. The separate private section explicitly does not promise West Bay, terminal pickup or particular inclusions. Matching remains dependent on Viator's current inventory and search availability.

## Deployment acceptance

1. Merge and wait for Netlify to publish the intended commit. Confirm the two native functions `affiliate-click` and `affiliate-retention` are deployed, and the retention function has a schedule.
2. On `/ports/roatan/west-bay-beach-from-cruise-port`, confirm group labels and inspect `/api/viator/products?port=roatan&intent=west-bay-beach-from-cruise-port`. Missing inventory must not be replaced by unrelated cards. Compare both groups against product titles, tracking parameters and price units.
3. Check the published domain, not only the deploy permalink; this project has previously served stale durable-cache HTML. Purge Netlify's site cache if the production marker is old.
4. With DNT/GPC disabled, click one actual sponsored card from the production domain. Verify the POST to `/.netlify/functions/affiliate-click` returns 204, then confirm a new matching record in Netlify **Data & Storage → Blobs → affiliate-clicks-v1**. A 204 alone is not proof of a persisted event because opt-outs/previews intentionally return it too. Mark this operator check in your analysis and exclude that day's known test click as appropriate. No booking is necessary.
5. Repeat with DNT/GPC enabled: no client tracking request. Outbound links must still work. Check function logs for storage failures (503). Local automated tests mock the storage boundary; only the deployed check proves runtime credentials and storage work.

## Read results

Production persistence was confirmed on 2026-09-10 from the owner's Netlify Blobs screenshots. The operator test event is `2026-09-10/42bdb7ce-45f7-4fa5-8515-26c01f5d9626` (Cozumel taxi guide, product `22191P1`, campaign `pdg-cozumel-taxi-rates`, placement `cozumel-driver-options`). Exclude this one known test click from business analysis; the export script now excludes this exact key before aggregation. This confirms click storage, not a booking or commission.

The Cozumel cost-tool entry sits after its quick answer; the Roatán booking link is an inline note at the end of its opening terminal briefing. These purpose-specific entries are ordinary same-page navigation and are not counted as outbound affiliate clicks. Their targets are static comparison/checklist headings, so they remain available when Viator has no matching products. Existing card placement tracking is unchanged; it does not reveal whether a visitor first used a shortcut. These presentation changes do not change article headings, source copy, URLs, metadata, structured data or reviewed dates.

Browse individual records in the authenticated Netlify Blobs UI. For an aggregate CSV, set `NETLIFY_SITE_ID` (Netlify Project ID) and `NETLIFY_AUTH_TOKEN` in a local terminal, then run:

```sh
node scripts/report-affiliate-clicks.mjs 2026-09-07 2026-09-20 > affiliate-clicks.csv
```

The token is needed only for the operator's export, never in GitHub, browser code or a `NEXT_PUBLIC_` variable. The report is read-only and groups by page, product, campaign and placement. Compare date ranges with Viator's Campaigns export; page/campaign evidence can suggest a source, but cannot prove which click caused an individual booking. Do not treat the earlier Aug 27 booking or pending commission as an outcome of this change.

After two weeks, use which placements receive clicks to prioritize improvements, alongside GSC page traffic and Viator confirmed/completed bookings. Impression measurement is not part of this first release, so card click-through rate is not yet available.

References: [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/), [Functions context and schedules](https://docs.netlify.com/build/functions/api/), [code-based rate limits](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).

## Automated reporting

See [automated operations](automated-operations.md) for the daily private report, daily public HTTP check and weekly operating process. Reports contain recorded click events, not visitors or revenue. Aggregates are private and retained for up to one year; raw click retention remains 90 days.

## Acquisition source labels (updated September 29, 2026)

Affiliate click events include one bounded `source`: `pinterest`, `checklist`, `ai-search`, or `unspecified`. Pinterest and checklist labels come from recognized `utm_source` values on the page at the time of the click. OpenAI documents that ChatGPT search referrals carry `utm_source=chatgpt.com`; that value, or an HTTPS `chatgpt.com` referring host when no source tag is present, maps to `ai-search`. Unknown, repeated or ambiguous source parameters become `unspecified` and are not replaced by a referrer. No raw query string, full referrer, cookie, session storage, prompt or visitor identifier is collected. Viator campaign values and booking links remain unchanged. Historical events without this field remain valid and group under `unspecified`.

This can distinguish recorded affiliate-click events from labeled entry links and coarse recognized ChatGPT referrals. It cannot count acquired visitors, track a person across pages, establish a last-touch channel, prove which click caused a booking, or produce a visitor conversion rate. Google AI traffic cannot be separated from ordinary Google traffic with this event, and Bing/Copilot remains `unspecified` until an exact referral signal is verified. A reader who navigates to a clean URL loses the source label. There are no synthetic production analytics clicks for this rollout.

Source: [OpenAI Publishers and Developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq), checked September 29, 2026.

Viator orders and commissions are supplied by the owner as manual CSV exports on request. Use Performance Trends by campaign and the Gross Bookings Report, covering matching periods. Keep source exports, booking details and revenue out of this public repository. Request only the report needed for a concrete decision; do not make recurring maintenance depend on its arrival.

## Bounded planning pilot — October 26 draft

This extension is not live until its PR passes visual/release gates and an exact-commit production deploy is verified. Record the actual publication time in the release evidence; do not backfill earlier days as zero. It reuses `affiliate-click`, `affiliate-clicks-v1`, `affiliate-reports-v1` and the existing schedules. No account, SDK, cookie, persistent browser state, new identifier or access permission is added.

| Event | Scope and trigger | What it cannot establish |
| --- | --- | --- |
| `page_arrival` | The Cozumel taxi guide, Yokohama near-terminal guide, Tokyo-to-Yokohama transfer guide and `/planner`, after the client renders; once per path per loaded document | Unique people, external acquisition, sessions, reading, or card impressions. Internal navigation counts too; refreshes/new tabs can count again. |
| `tool_complete` / `cozumel-budget` | Both whole-party totals are valid and a comparison result renders | Accurate quotes, a chosen option, confirmed transport or payment. No amounts/currency/passenger count are sent. |
| `tool_complete` / `tokyo-checklist` | All six items are checked | That the traveler actually confirmed each item, copied/printed the checklist or booked. No individual choices are sent. |
| `tool_complete` / `cruise-planner` | A newly generated plan passes the existing form checks and renders; loading an old saved plan alone does not trigger it | That travel arrangements are feasible or confirmed, or that weather retrieval succeeded. No ship, date, port-call list or plan contents are sent. |
| Existing `click` | Sponsored Viator outclick; original placement/product/campaign/source rules and 750 ms repeat suppression | A completed merchant page load, booking, cancellation-adjusted commission, cash paid or a matched individual conversion. |

Arrival/completion deduplication is an in-memory set keyed only by the fixed event type and allowlisted page. Re-rendering, repeated completion, changing query parameters or revisiting that page within the same loaded document does not add another event of that type. Reloading creates fresh memory. It does not identify visitors and cannot stop a forged request or server replay. The server keeps its existing per-event random storage key, not a visitor key; it accepts no new identifiers. Transport is best effort without retries, so failed requests undercount. The existing rate limit is shared by all three types.

Only event type, one of four exact paths, the existing coarse source label, server UTC date and (for completion) a fixed tool label are stored. No full URL/query/referrer, input values, checkbox states, ship name, private itinerary or client timestamps are sent. Existing DNT/GPC, production host/context, same-origin, body-size, field-validation, private-store, no-public-report and retention protections apply unchanged. Raw events expire under the existing 90-day job; aggregate rows under the existing 365-day job. The privacy notice describes the extension.

Daily report schema v3 preserves `recordedClicks`, `rows`, `last7Days` and `previous7Days` as **click-only**. New `planning.rows`, `planning.last7Days`, `planning.previous7Days` and each day's `planningRows` group event counts by type/page/tool/source. The existing private `read-affiliate-report.mjs` retrieves them; the existing click CSV remains click-only. Older reports without planning fields are unmeasured. Failed reads/record caps still fail the report and preserve its prior latest snapshot; inspect freshness before analysis.

Use matching complete UTC dates and page/source groups to assess aggregate activity, alongside GSC and settled Viator commissions. A completion-to-arrival ratio is only a ratio of these recorded events, not a visitor conversion rate; click-to-arrival ratios can exceed 100% because repeated clicks are valid. No event joins, attribution IDs or cross-device matching are available. Exclude known operator events explicitly; the historical September 10 exclusion stays in place. This draft used mock storage and GET-only public checks, with no production event posts or sponsored clicks. New production persistence and private report generation remain unverified until authorized runtime evidence is read.
