# Hobby–Galveston three-transfer editorial review

Prepared October 13, 2026 from main b6864d4649e2e8535fec4712e05230e075af5fd3.

## Selection and scope

Three candidates were considered, in this order:

1. Cozumel taxi costs for a family needing more than the four-passenger fare: rejected as an answer duplicate. The current taxi article explicitly excludes applying the four-person estimate to five, asks for every vehicle and return quote, and supplies a whole-party calculator. Existing dated acquisition question AQ-01 is already covered; no new demand magnitude is inferred.
2. HOU arrival the day before a Galveston sailing: selected. The [September 29, 2025 public question](https://www.reddit.com/r/royalcaribbean/comments/1ntw8j2/hobby_to_galveston_transportation/) describes four travelers staying on the island, and replies confuse that with an airport hotel. Read October 13, 2026; the page's date archive identifies September 29, 2025. This is one qualitative question, not search-volume evidence. No traveler identity or reply fare is retained. Current inventory has no Galveston airport/hotel guide.
3. Pre-purchase Alaska one-way versus round-trip decision: the AQ-03 question in the growth runbook has now been answered by October 8 PR #33, including airport pairs and total-party cost. Another page would duplicate that answer. No cruise affiliate CTA is relevant to this already-booked Texas transport question; no approved CruiseDirect/CJ link is inferred.

Target question: “We are four people flying into Hobby before a Galveston cruise and staying on the island. Should we book a shuttle or car, and does a round trip include our hotel?”

The reader must arrange three dated legs, price everyone and luggage, distinguish island/airport hotels, identify the terminal and protect the flight home. The article therefore starts with the three-leg reservation, then works through the party budget, HOU pickup, next-morning terminal and flight-home constraint. No generic destination overview, attraction list, FAQ or forced table. The final confirmation check catches a missing hotel–port booking.

## Comparison actually read

- `app/blog/alaska-one-way-vs-round-trip/page.tsx`: airport pair → last day → hypothetical cost → itinerary/deposit decision; most recent new article.
- `components/OsakaKaiyukanArticle.tsx` and its full editorial draft: berth → entry-time arithmetic → ticket/child/access rules → one continuous visit; October 1 new article, October 6 revision.
- `components/TokyoYokohamaTransferArticle.tsx` plus its registry record: terminal and station routes → luggage → transfer → arrival checklist/FAQ; September 10 article.
- `components/CozumelTaxiArticle.tsx` and registry record: fare evidence → arrangements → calculator → booking → return; existing closest party-cost answer.
- `lib/blog.ts` MCO article and its route: five transport-mode comparison with repeated pros/cons; closest airport article.

Read headings, opening, complete core copy and endings. The Texas article does not reuse the mode-by-mode MCO skeleton or Tokyo terminal/rail table. Shared navigation, typography, hero, metadata and footer are site UI. Reciprocal MCO navigation is the only existing-page change, part of this delivery package, with no old-page rewrite/date reset.

## Public fact sources read October 13

- [Visit Galveston airport transport](https://www.visitgalveston.com/cruising/airport-transportation/): HOU about 40 miles, 45–60 minute road reference; shared price unit corroboration. Not total landing-to-hotel time.
- [Galveston Express rates](https://galvestonexpress.com/galveston-taxi-rates-schedule/): $45 single/$80–85 round-trip shared table; select airport-hotel reservation surcharge, Sunday restrictions/discount exceptions. The title still advertises an old $30 figure; use current visible table. No selected date/seat quote obtained.
- [Galveston Express services](https://galvestonexpress.com/transportation-houston-galveston/): hotel delivery, separate hotel-to-port service and address exceptions. General prose says HOU is cheaper than IAH, inconsistent with equal current rate rows; do not repeat that claim. Confirm the hotel and both endpoints of a round-trip ticket.
- [Houston Airports HOU](https://www.fly2houston.com/hou/ground-transportation/taxi-and-ride-apps/): taxi zone 2 and ride-app zone 5, Arrivals, nearest carousel 4 exit. Not applied to other shuttles.
- [Port of Galveston](https://www.portofgalveston.com/cruise-parking/arrival-departure-guide/): terminals 25/28/16/10; trolley does not stop at port, parking shuttles separate from hotels; assigned check-in slot.
- [Carnival Galveston transfers](https://www.carnival.com/airport-transfers/galveston): the multi-port page's GALVESTON section specifically, day-of transfer, earlier HOU arrivals return by 11 a.m. near baggage claim 4; return flight no earlier than 1:30 p.m. Applies only to this service, not other cruise lines. The Barcelona section above it has different rules and is not used.

Four standard seats × $45 = $180; four × $80–85 = $320–340. These are transparent planning arithmetic before the separate third leg/extras, not current quotes or universal cheapest-price claims. Child seats and mobility requests are confirmations, not claims of universal supply or legal advice.

## Product fit

Search scope: HOU airport/private transfer, Galveston hotel/terminal, return airport transfer and official operators. Public listing and details read before drafting; reread at release gate. No sponsored URL is opened during validation.

- [320728P1546](https://www.viator.com/tours/Houston/Galveston-Port-to-William-Hobby-Airport-HOU-Departure-Transfer/d5186-320728P1546): taxiGo DMC, private port→HOU only, approx 55 minutes; nameplate, bags/ship/terminal/pickup supplied by customer; tax/fee inclusion, infant seats stated, not wheelchair accessible, 24h cancellation. Public listing displays a per-person starting price and group discounts; private does not imply per-vehicle pricing. Date selector is present but no date-specific availability, exact family price, vehicle or flight fit has been verified. Retain one honest static details/check-availability entry for leg three, not a “verified bookable” card or live price. `pid=P00311056`, campaign `pdg-hobby-galveston-three-rides`, sponsored/nofollow and existing click data attributes retained. No API is called for this placement, so a static link is not represented as API success.
- [256991P1](https://www.viator.com/tours/Houston/Houston-Airport-and-Galveston-cruise-Port-Transportation-SUV-Sedan-and-Limo-Service/d5186-256991P1): broad Houston/port transport with selectable points and generic ticket-redemption locations. Exact HOU→island-hotel option and bag capacity not established; excluded from recommendation rather than assuming it covers all legs.
- Search also surfaced 115753P4 (IAH-titled product with conflicting direction snippets) and 115753P12 (Dallas-titled transfer). Neither adopted from snippets. No suitable attraction/ticket/tour is needed to solve this three-transfer question. Recheck a precise HOU hotel-arrival option if a reliable explicit listing becomes available.

## Photography and distribution

See [image record](../hobby-galveston-image-sources.md). One independent licensed real photograph; body does not need a second decorative photo or a speculative route map. Companion Pin is a 1000×1500 graphic using this same photo and short accurate text. Stable ID `hobby-galveston-three-rides-v1`; only this canonical is added to RSS. Feed publication is not Pinterest import; actual Pin status remains unverified until observed.

## SEO, AI and delivery checks

Self-canonical `/blog/hobby-airport-to-galveston-cruise`, unique title/description/H1, visible dated primary references, plain-text answer with HOU direction, USD units and hotel/line limitations. `BlogPosting` and `BreadcrumbList` only; no review/FAQ/Product availability schema. Existing robots wildcard allows page access (Googlebot/Bingbot/OAI-SearchBot); training controls unchanged. Blog registry provides directory and sitemap image/date consistency, MCO supplies a relevant reciprocal internal link.

[Google AI-feature guidance](https://developers.google.com/search/docs/appearance/ai-features) re-read October 13: standard discoverability, textual content and accurate structured data apply; no AI-only file/schema needed. Preparation is not indexing or citation evidence.

Release gates: lint/build, existing rendered/affiliate/feed/cover suite plus new article regression, source identity/hash and visual comparison, desktop/mobile crop/readability/credit navigation, exact-head CI and Netlify preview, exact-head merge, production GET checks. Results and deployment time are recorded in the PR release discussion. GSC reminder only after production 200, self-canonical and indexability pass; no repeat reminder for existing URLs.
