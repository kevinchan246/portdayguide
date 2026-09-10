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

Production persistence was confirmed on 2026-09-10 from the owner's Netlify Blobs screenshots. The operator test event is `2026-09-10/42bdb7ce-45f7-4fa5-8515-26c01f5d9626` (Cozumel taxi guide, product `22191P1`, campaign `pdg-cozumel-taxi-rates`, placement `cozumel-driver-options`). Exclude this one known test click from business analysis; the export script includes it unless adjusted during analysis. This confirms click storage, not a booking or commission.

The early Cozumel and Roatán shortcuts are ordinary same-page navigation and are not counted as outbound affiliate clicks. Their targets are static comparison/checklist headings, so they remain available when Viator has no matching products. Existing card placement tracking is unchanged; it does not reveal whether a visitor first used a shortcut.

Browse individual records in the authenticated Netlify Blobs UI. For an aggregate CSV, set `NETLIFY_SITE_ID` (Netlify Project ID) and `NETLIFY_AUTH_TOKEN` in a local terminal, then run:

```sh
node scripts/report-affiliate-clicks.mjs 2026-09-07 2026-09-20 > affiliate-clicks.csv
```

The token is needed only for the operator's export, never in GitHub, browser code or a `NEXT_PUBLIC_` variable. The report is read-only and groups by page, product, campaign and placement. Compare date ranges with Viator's Campaigns export; page/campaign evidence can suggest a source, but cannot prove which click caused an individual booking. Do not treat the earlier Aug 27 booking or pending commission as an outcome of this change.

After two weeks, use which placements receive clicks to prioritize improvements, alongside GSC page traffic and Viator confirmed/completed bookings. Impression measurement is not part of this first release, so card click-through rate is not yet available.

References: [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/), [Functions context and schedules](https://docs.netlify.com/build/functions/api/), [code-based rate limits](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/).
