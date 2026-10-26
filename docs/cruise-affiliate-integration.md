# CruiseDirect application packet and integration gates

Prepared October 6, 2026. This is an operator handoff, not a public travel article or evidence of an approved affiliate relationship.

## Verified application route

Start at [CruiseDirect's official affiliate page](https://www.cruisedirect.com/affiliates) and select **Sign up now**. Its October 6 link redirects to [CJ publisher signup for advertiser 965192](https://public.cj.com/signup/publisher?advertiserId=965192). That number belongs to the advertiser signup route; it is not PortdayGuide's publisher ID or a tracking link. The route was read, but the JavaScript signup form supplied no readable fields in this research surface. Do not invent current form labels or approval status.

[CJ Support](https://www.cj.com/support), read October 6, distinguishes publishers (website owners earning referral commissions) from advertisers and requires an active website. Publisher signup is free. [CruiseDirect's eligibility FAQ](https://www.cruisedirect.com/faq/affiliates/does-my-site-qualify-for-the-affiliate-program) says there is no website-traffic minimum; applications still require review. This does not promise acceptance or a response deadline.

## Ready website information

Use the following only where the application asks for the corresponding information; use the owner's real legal/contact/payment details for account fields.

| Website field | Prepared value |
|---|---|
| Property/brand | PortdayGuide |
| Website | https://portdayguide.com |
| Content language | English |
| Content focus | Cruise ports, terminal transport, independent shore-day planning and route decisions |
| Promotion model | Editorial website content and relevant contextual links |
| Proposed first placement | https://portdayguide.com/blog/alaska-cruise-ports |
| Supporting pages | https://portdayguide.com/about ; https://portdayguide.com/disclosure |
| Existing social distribution | Owned RSS for Pinterest; direct social affiliate promotion is not part of this proposed pilot |

Suggested property description:

> PortdayGuide is an English-language cruise planning website. Its guides help travelers identify the correct terminal, compare ground transport and plan shore activities around their ship's return time. We are preparing a focused Alaska itinerary comparison to help readers choose a suitable round-trip or one-way cruise before booking. We propose relevant editorial links from that content to CruiseDirect, followed by links to our existing port-day guides.

No traffic, booking, income, audience-location or personal-experience claim is included. Add any requested audience figures only from a current report with its actual date and definition; do not substitute clicks for visitors.

## Owner's one-time account step

If no CJ publisher account already exists, register through the official route and complete email verification and requested account setup. If one exists, use it and locate CruiseDirect rather than creating a second account. Review and accept the applicable agreements personally, complete requested tax/payment information inside CJ, and apply to the advertiser. Nothing in this packet accepts a contract or submits an application.

After approval, retain the approved program terms and a CJ-generated link for the permitted Alaska/departure destination. The continuation needs approval status, the usable link, allowed placement/channel details and attribution/payment conditions. Do not send passwords, tax documents, bank details or API credentials in chat or put them in GitHub. This packet is the one coordinated account handoff; other operating tasks should not repeatedly request it.

## Terms to verify before activation

The [CruiseDirect program page](https://www.cruisedirect.com/affiliates), read October 6, publishes **3% of commissionable cruise fare** and a **45-day cookie**. The rate is not 3% of the entire payment. Its [FAQ](https://www.cruisedirect.com/faq/affiliates) ties credit/payment to sailing and supplier commission, and describes a monthly payout. CJ's [publisher page](https://www.cj.com/publisher) describes two monthly payouts. These public descriptions do not settle the actual account's locking, cancellation or payout rules.

Use the approved advertiser and CJ account terms for commissionable components, exclusions, reversals, booking versus sailing dates, transaction locking, payment timing, thresholds/currency, permitted geography, deep links and website/social use. Do not publish a guaranteed settlement date or treat a newly booked cruise as paid commission. No live fare, coupon or inventory is supplied by this packet.

## Historical integration plan — October 6

Retained as planning history. The October 8 route-comparison article already answers the earlier editorial handoff; do not recreate it. The current Phase A/B scope below controls further implementation.

1. Finish the existing Alaska page's specific pre-booking answer using the [October 5 reader brief](growth-acquisition.md#october-5-pre-booking-question-and-editorial-handoff). Verify the actual sailing endpoints, airport connections and whole-party budget before placing a booking link. Preserve its canonical URL; do not also create the same answer in another article.
2. Add one contextual, approved destination link after the route comparison. Keep the single footer disclosure and sponsored link attributes; check that the disclosure accurately covers whole-cruise bookings before activation. Preserve Viator campaigns. Do not insert it into the Cozumel taxi or Tokyo transfer pages.
3. Preserve the exact CJ-generated link. Any optional sub-ID must be permitted by the program and use a fixed page/placement code; never append invented tracking parameters or personal data.
4. Separate merchants in the outbound event/report design. Current `lib/affiliate-events.mjs` accepts HTTPS Viator URLs with `pid`; a CJ link would currently be ignored. Extend that allowlist only after reading an actual approved link/redirect destination, with a bounded merchant category and compatibility for old Viator records. Preserve current-page Pinterest/checklist/AI source rules and privacy opt-outs; no raw referrers, visitor identities or cross-page state.
5. Validate classification with synthetic links locally, without navigating sponsored URLs or posting simulated production events. Verify the rendered real link/attributes by GET, use required exact-head CI/Netlify preview, merge that reviewed head, and check production.
6. Keep CJ and Viator reports separate. Website outbound events are neither unique visitors nor bookings. Review actual attributed, reversed, locked/completed and paid transactions using their own dates and definitions; missing data stays unavailable.

## Readiness recorded October 6

Main `80eee1b038e87ed76e5f63abc055057f644557af` contains no CruiseDirect/CJ tracking link or approved-account evidence. This packet adds no integration code, tracking script, new public page, feed entry, account, fee or subscription. Content and implementation must use the existing shared allowance; the weekly new-article slot stays reserved.

## Alaska pilot — October 18 plan, October 25 execution retry

The owner requested a written plan followed by execution. The four-page Chinese plan was completed and saved October 18; the October 25 retry continues that bounded work from main `5a81b5fbe5c8188ebc9864a8a0b934d698575881`. Neither date establishes production publication. Search discovery, internal navigation and whole-cruise monetization remain separate questions; cards or affiliate enrollment do not establish acquired visitors or revenue.

### Phase A: two existing pages, four navigation cards in total

| Existing page | Bounded change | Destination |
| --- | --- | --- |
| `/blog/alaska-cruise-ports` | Promote the inline comparison entry to one guide card; retain the five existing port cards. | `/blog/alaska-one-way-vs-round-trip` |
| `/blog/alaska-one-way-vs-round-trip` | Add three related port-guide cards. | `/ports/juneau`, `/ports/skagway`, `/ports/ketchikan` |

Reuse existing styling and the destination/article's licensed photographs with attribution. Preserve canonical URLs, original publication dates (July 27 and October 8), sourced body and Viator campaigns. A presentation-only change does not mechanically refresh factual check or modification dates. Record the actual production change time in the release evidence.

Only these four new navigation cards enable separately clickable author-name credits using the existing `/photo-credits` records. The image's article link and the photographer's attribution link are siblings, never nested; the small credit does not cover the remaining image navigation area. Keep the original five overview port cards and all other discovery cards' existing presentation unchanged.

This specifically requested two-page batch creates no recurring extra allowance, article, Pin, feed entry, GUID/date reset or duplicate indexing request. Subsequent work uses the shared rolling-seven-day allowance. During the first 28 complete days after verified Phase A production, at most one distinct new route article may occupy an existing article package; do not duplicate the Alaska airport/party-cost comparison. This ceiling does not reactivate disabled publishing or create another article/Pin slot.

Phase A changes internal navigation and implementation records only: no placeholder booking button, invented offer, CJ URL, generic CJ-host allowlist, merchant event acceptance, tracking script or unused runtime configuration. Existing Viator collection is not whole-cruise, card-impression or internal-click tracking.

### Phase B: actual approved-link gate

Use the single account handoff above. Activate only after verified CruiseDirect advertiser approval, applicable current account terms and a real CJ-generated link for the permitted destination and website placement. The owner handles agreements and personal account setup; do not create another account or repeat the request on healthy runs without new evidence.

Read the actual link and its permitted redirect destination before extending bounded merchant classification. Preserve the link exactly; add only program-permitted fixed non-personal placement/sub-ID values. Preserve old Viator records, current-page source rules, privacy opt-outs and the single shared disclosure, checked for whole-cruise scope. Apply sponsored attributes; no raw referrers, visitor identity or cross-page state.

The official [program page](https://www.cruisedirect.com/affiliates) and [FAQ](https://www.cruisedirect.com/faq/affiliates), last checked October 18, describe 3% of commissionable cruise fare and a 45-day cookie; the feed remained described as coming soon. This is not 3% of the complete payment or verified live inventory. Confirm actual cancellation/reversal, locking, payment, geography and channel conditions before activation. Booking is not paid commission.

Validate classification locally with synthetic fixtures. Inspect rendered real href/attributes by GET without navigating sponsored links, simulated production events or test purchases. Keep CJ and Viator reports separate; record actual activation independently of preparation, application and approval.

### Observation and task coordination

Keep original article dates for article-age comparisons. Start navigation observation at verified Phase A production and monetization observation only at Phase B activation. Review each at 28 and 56 complete days with timezone and exact window stated; exclude a partially exposed release day and the unfinished current day.

Preserve November 13, December 3 and December 13 stage reviews; immature windows must show actual elapsed days and the next eligible window. As checked October 25, the SEO/article task is disabled; revenue and acquisition remain enabled through their existing December 13 end. Do not assume the SEO task will carry later reviews. If a 56-day window matures after those tasks end and no enabled task can cover it, arrange one dedicated read-only review after maturity, deduplicated against the pilot ledger. This is a post-publication scheduling action, not a claim that a review is already scheduled; do not restore SEO, extend recurring tasks or expand publishing. Preserve the existing December 3 cadence rules without implying the disabled task will run.

Use page-level search/referral reports, internal-navigation evidence and actual merchant transactions only when available, with matching definitions. Phase A establishes no card-exposure or internal-click denominator. HTTP requests and outbound events are not unique visitors; clicks are not bookings. Missing access is unavailable, not zero; without a valid denominator report counts only, not conversion rates. Keep private metrics, exports and account material out of GitHub.

At 28 complete days, inspect discoverability, usable evidence and concrete faults. At 56, compare like-for-like periods, sample size and maintenance effort to retain, adjust or pause expansion. Small samples or incomplete settlement do not establish market failure or success.

### Release and rollback

Use branch, lint/necessary regression and build checks, desktop/mobile inspection, reviewable PR, required CI/Netlify preview on the exact head, merge that head, then production GET verification. Record actual PR, commit, deployment time and checked URLs in the release comment. These instructions are not a claim of publication. Leave unrelated PRs #4, #41 and #42 untouched; reconcile later main evidence before merging instead of overwriting it.

Revert a faulty navigation change or disable/revert only a later cruise-merchant integration, preserving both articles and Viator behavior. Insufficient evidence pauses expansion; it does not authorize paid traffic, filler content or third-party outreach.
