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

## Small integration plan

1. Finish the existing Alaska page's specific pre-booking answer using the [October 5 reader brief](growth-acquisition.md#october-5-pre-booking-question-and-editorial-handoff). Verify the actual sailing endpoints, airport connections and whole-party budget before placing a booking link. Preserve its canonical URL; do not also create the same answer in another article.
2. Add one contextual, approved destination link after the route comparison. Keep the single footer disclosure and sponsored link attributes; check that the disclosure accurately covers whole-cruise bookings before activation. Preserve Viator campaigns. Do not insert it into the Cozumel taxi or Tokyo transfer pages.
3. Preserve the exact CJ-generated link. Any optional sub-ID must be permitted by the program and use a fixed page/placement code; never append invented tracking parameters or personal data.
4. Separate merchants in the outbound event/report design. Current `lib/affiliate-events.mjs` accepts HTTPS Viator URLs with `pid`; a CJ link would currently be ignored. Extend that allowlist only after reading an actual approved link/redirect destination, with a bounded merchant category and compatibility for old Viator records. Preserve current-page Pinterest/checklist/AI source rules and privacy opt-outs; no raw referrers, visitor identities or cross-page state.
5. Validate classification with synthetic links locally, without navigating sponsored URLs or posting simulated production events. Verify the rendered real link/attributes by GET, use required exact-head CI/Netlify preview, merge that reviewed head, and check production.
6. Keep CJ and Viator reports separate. Website outbound events are neither unique visitors nor bookings. Review actual attributed, reversed, locked/completed and paid transactions using their own dates and definitions; missing data stays unavailable.

## Current readiness

Main `80eee1b038e87ed76e5f63abc055057f644557af` contains no CruiseDirect/CJ tracking link or approved-account evidence. This packet adds no integration code, tracking script, new public page, feed entry, account, fee or subscription. Content and implementation must use the existing shared allowance; the weekly new-article slot stays reserved.
