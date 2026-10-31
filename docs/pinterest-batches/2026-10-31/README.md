# PortdayGuide: six useful Pinterest drafts

**Review only. No Pin is published or scheduled by this change.** Six finished 1000 x 1500 PNGs, English publishing copy, direct destinations, photo rights and a staged publication plan are included. The application, live RSS, existing images, GUIDs, dates and automation schedules are unchanged.

![All six draft Pins](contact-sheet.png)

## Scope and ownership

The owner requested the proposed Pinterest optimization on October 31: three existing pages, two distinct useful angles each. This is a bounded preparation batch, separate from the completed Costa Maya, Osaka and Cozumel/Yokohama releases. It is not six new articles or a permanent publishing increase.

Prepared against main `91aa1d7de0a81d4bff0f0a29bc9f3c59f9ca2a9c`. Read the current operating/acquisition runbooks, operations log, image registers, actual page implementations and recent PRs. Only unrelated PR #4 was open when preparation began. The existing acquisition task was idle. This branch owns only `docs/pinterest-batches/2026-10-31/`; no other task's files or schedules were changed. The coordinator reviews these finished assets before any feed or social publication.

## Delivery audit

[Technical evidence](technical-audit.json), checked October 31 at 23:38 UTC:

- Production RSS: HTTP 200, **8 items**, byte-for-byte equal to the current main feed builder. Eight destinations and eight images return 200; all eight image bytes match the checkout.
- Three selected landing pages: HTTP 200, correct self-canonical, indexable, working destination anchors and links to photo credits. No page selection change was necessary.
- Existing source parameters remain `pinterest / organic_social / portdayguide_guides`. New drafts use the same convention and one distinct `utm_content` per creative, equal to its immutable ID.
- The acquisition runbook records **six historically observed Pins**: the original two, the two September scenic variants, Alaska and Hobby. Domain claim, saved native RSS and the public board were previously verified. This is historical evidence, not a new account inspection. LGB and Osaka import, individual Pin URLs and actual outbound destinations remain unverified.
- The previously blocked Pinterest inspection was not retried. Feed availability, robots allowance and owned-page GETs do not prove Pinterestbot retrieval, a successful import, real visits or revenue.
- The existing Osaka feed date is October 20; actual site release was October 31. It is preserved, not treated as its Pinterest publication date. No existing ID, date or image was refreshed to manufacture a new Pin.

## Finished files

- [Publishing copy and preview for each Pin](copy-and-sources.md): exact English title, description, alt text, destination, angle and linked rights.
- [CSV](publishing-copy.csv): review/publishing reference, **not** an automatic Pinterest bulk-upload specification.
- [Manifest](manifest.json): full destinations, image and source SHA-256 hashes, dimensions, credit/license records, publication order and null actual publication fields.
- [Editable brief](pins.json) and [renderer](render.mjs): deterministic native layouts extending the approach used by `scripts/generate-share-cards.mjs`. Existing photographs are resized/cropped without generative retouching or scene replacement. No new image service or credentials.
- `assets/`: six full-size PNGs. `contact-sheet.png`: all six at 300 pixels wide, with large headlines and practical CTAs checked for readability.

Rebuild locally with installed repository dependencies:

```sh
node docs/pinterest-batches/2026-10-31/render.mjs
```

The renderer writes only this draft directory. It rejects duplicate live IDs, overlong copy and photo enlargement, decodes every resulting PNG in full, and writes hashes. The headline, CTA, selected photograph and decision differ between each page's variants. Every factual promise is supported by the destination implementation identified in `pins.json`. No live fare, savings, selected-date availability, first-hand visit or return guarantee is promised.

## Publication proposal — held for coordinator review

Use the **existing native RSS connection only**, targeting the existing public board **Cruise Port Guides & Tips**. Do not also manually upload these images. The owner review must cover this six-Pin one-time batch allocation; it does not increase recurring quotas or take either new-article Pin reservation. The ordinary existing-page slot is already used by the October 31 Costa Maya release. If this batch allocation is not cleared, keep the drafts held rather than borrowing that slot.

The following are proposed existing acquisition-run slots, **not a scheduled automation**. All are 09:30 America/Chicago (15:30 UTC after the November 1 time change). Do not backdate a missed slot or accumulate catch-up posts. If review finishes later, the coordinator should shift the remaining sequence within the existing authorized period; no task is extended beyond December 13 by this document.

| Order | Proposed slot | Creative | Reason |
| --- | --- | --- | --- |
| 1 | November 2 | `costa-maya-port-or-town-v1` | Start with a page absent from the current feed; test the setting decision. |
| 2 | November 4 | `cozumel-beach-pass-transport-v1` | Specific admission/transport gap, rather than another generic taxi-cost cover. |
| 3 | November 9 | `yokohama-name-your-terminal-v1` | Correct-terminal decision before route selection. |
| 4 | November 16 | `costa-maya-return-budget-v1` | At least 14 days after its first variant; test time and full-cost readiness. |
| 5 | November 18 | `cozumel-driver-inclusions-v1` | At least 14 days after its first variant; test reserved time versus two rides. |
| 6 | November 23 | `tokyo-yokohama-seats-and-bags-v1` | At least 14 days after its first variant; test group/luggage readiness. |

For each cleared slot, the existing acquisition owner must:

1. Re-read main, open PRs and current ownership. Check the ledger, RSS and actual Pinterest evidence for this immutable ID/image/title/destination. A pending or uncertain prior import is not permission to upload it again.
2. Copy **only that Pin** to `/public/media/share/<id>.png`. Add one item to the existing editorial feed list using the exact title, description, path and anchor in `pins.json`, `imagePath: /media/share/<id>.png`, and a factual first-feed-publication timestamp. Retain all earlier entries and dates. Never install this draft manifest as the live feed or add all six at once. No new feed, board or task is necessary.
3. Preserve the full source/license/change information in the public rights record, especially the CC BY-SA 4.0 license on `yokohama-name-your-terminal-v1`. Keep the Pin's visible author names and attribution-bearing description. Native RSS maps title/description/image; it does not establish that custom alt text is imported. Use the supplied alt text only through a supported existing-Pin accessibility field, if available, without recreating the Pin.
4. Apply ordinary scoped PR, CI/preview and production checks once per substantive publication. Keep old feed entries byte-stable. Confirm the intended production image, URL, anchor, canonical and source parameters via GET; do not navigate sponsored links or POST test analytics.
5. Record feed deployment separately from the observed Pin ID, URL, board and actual publication timestamp. Pinterest says RSS imports may take up to 24 hours. If import remains unverified, keep it pending and pause further expansion; do not reset the GUID/date or add a manual duplicate. Verify `Visit site`'s destination by reading its href, without creating a test affiliate click.

The smallest account-evidence handoff is the current board view showing the LGB and Osaka entries, with their **Copy link** Pin URLs; an account owner can also inspect the native RSS status for a specific error. No new account, domain claim or RSS connection is needed. A Pinterest analytics export becomes necessary for a traffic assessment, not for finishing these drafts. Do not ask again for previously supplied account setup or unrelated financial files.

## What to measure

The goal is qualified visits and affiliate earnings. Impressions/saves are diagnostic context, not the success criterion. Start each creative's observation clock from its **verified actual Pin publication**, not this draft date, its proposed slot or RSS date. Compare equal 28- and 56-complete-day windows and state source timezone/coverage. Use existing review tasks only; a future window outside their authorized end date remains an explicit handoff, not a new schedule.

| Outcome | Evidence required | Current limit |
| --- | --- | --- |
| Pinterest outbound clicks per Pin | Native Analytics export or actual Pin analytics with date range/timezone and Pin ID | Not read in this task. Pin closeup clicks are a different metric. |
| External website visits | A verified existing analytics source that actually measures visits/referrals | Not available here. Do not rename `page_arrival` events as external visits, sessions or people. |
| Planning activity | Existing private report, after runtime persistence and freshness are verified | Cozumel and Tokyo guides have arrival/tool events; Costa Maya has no arrival coverage in this pilot. Missing history/coverage is not zero. |
| Pinterest-labeled affiliate actions | Existing current-page `source=pinterest` click rows, correct page/campaign and complete dates | Aggregate events, not visitors. `utm_content` is **not stored** by this collector, so downstream per-Pin attribution is unavailable. Source can be lost after internal navigation. |
| Orders and earnings | Matching Viator campaign reports, separated into bookings, cancellations, confirmed commission and cash paid | Page-campaign reporting cannot prove which Pin caused an order. No new financial report or earnings read occurred. |

Keep private reports and counts out of this public directory. At 28 days, check actual outbound demand and useful on-site activity where supported. At 56 days, retain or stop the channel/angle based on verified traffic, affiliate results and maintenance cost; small samples or unavailable data do not justify a winner or more volume. These staged variants are a directional test, not a randomized causal experiment.

## Official references

- [RSS import requirements and title/description mapping](https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed), read October 31, 2026.
- [Original content, 2:3 imagery, matched landing pages and duplicate avoidance](https://help.pinterest.com/en/business/article/pin-performance-and-distribution), read October 31, 2026.
- [Pinterest Analytics metrics](https://help.pinterest.com/en/business/article/pinterest-analytics), read October 31, 2026.

No paid tools, accounts, credentials, advertisements, outreach or recurring automations were added. The canceled competitor outreach remains canceled.
