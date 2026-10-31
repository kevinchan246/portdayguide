# Costa Maya port-vs-Mahahual product fit — October 23, 2026

## Scope and shared allowance

Start from current main `5a81b5fbe5c8188ebc9864a8a0b934d698575881`. Read both operating runbooks, the public operations log, recent commits, current production deployment and open work. PR #41 is an unmerged Osaka Castle article package blocked on mobile visual QA; unrelated PR #4 remains untouched. The October 16 Mahahual transport-page release occupies the independent existing-page slot until after `2026-10-23T14:52:47.454Z`. Do not merge or count this comparison-page revision before that instant.

This is the single independent existing-page improvement for the next rolling window. It does not create an article, canonical URL, Pinterest item or feed change, and it does not use either new-article package. Preserve the page title, description, decision structure, campaign, independent cover photograph and reciprocal Mahahual transport link.

## Confirmed production mismatch

GET of the production API with `port=costa-maya&intent=port-vs-mahahual&content=2026-10-07` on October 23 returned four cards:

| Product | Actual subject | Decision |
| --- | --- | --- |
| `6112PRTCTMCHA` | Chacchoben archaeological-site day trip | Exclude. It does not help readers choose between the port complex and Mahahual. |
| `420443P3` | Chacchoben ruins plus Bacalar Lagoon | Exclude. It is an inland two-destination excursion, not either side of this comparison. |
| `420443P1` | Bacalar Lagoon plus a Mayan experience | Exclude. It is an inland excursion, not a Mahahual beach alternative. |
| `420443P5` | Five-hour Nohoch Kay Mahahual beach package | Keep conditionally as one bundled Mahahual alternative to compare with staying in port or taking a DIY taxi. |

The page's current generic query is therefore a confirmed product-fit fault, even though the API returned HTTP 200. Restrict the page to exact code `420443P5`, use the precise product search, and version the request with the page's new October 23 modification date so the already-correct campaign receives fresh results after deployment. Do not add unrelated filler.

## Product conditions actually read

The public Viator page for `420443P5` was read successfully on October 23. It describes an approximately five-hour Nohoch Kay visit, per-person pricing, a date/traveler availability control and free cancellation up to 24 hours before the experience. Round-trip transport is included only with the selected transport option. That option meets outside Costa Maya port's main access one hour after ship arrival, no earlier than 9 AM ship time; the supplier asks for the ship name and advance time confirmation. The no-transport option starts at Nohoch Kay and leaves both rides to the traveler.

The listing labels the activity wheelchair accessible but separately states that transport vehicles accept foldable wheelchairs only, are not wheelchair-adapted and cannot take non-folding chairs. Keep the narrower vehicle limitation beside the card instead of turning the broad activity label into an access guarantee. The public page and API do not prove seats for a selected sailing, a full-party total, luggage capacity, current beach conditions or on-time ship return.

The recommendation is not admission to the Costa Maya port complex and not a taxi-only transfer. Its complete five-hour duration, pickup walk, option, return time and party total must fit the ship schedule. The original comparison and DIY guidance remains useful without a purchase.

## Image and presentation

Retain the page's independent 2023 Costa Maya port-entrance photograph by Larry D. Moore: [original Commons file](https://commons.wikimedia.org/wiki/File:Port_Entrance_Costa_Maya_Quintana_Roo_2023.jpg), CC BY 4.0, source SHA-1 `03a0098b7323a42e9ba07c500725f7e3f9c6e603`. Current cover, credit and responsive manifests identify it only for `costa-maya-port-vs-mahahual`; it is not a renamed or recropped copy used by another article. Preserve the author-only linked credit and all 480/800/1600 responsive variants. The card may use the product API image; do not claim it is the article cover or a port-navigation photograph.

Use the existing recommendation-card component. The exact-code API must return one `420443P5` card with the existing `pid=P00311056`, campaign `pdg-costa-maya-port-vs-mahahual`, sponsored/nofollow attributes, source price and honest missing-unit handling. An empty/error response remains a failure state, not successful monetization.

## Release gates

Run lint, production build, all rendered/affiliate/cover tests and whitespace review. Inspect desktop and mobile page/card/cover/credit/overflow behavior. Create a reviewable PR, wait for required CI and Netlify preview on the exact head, and merge only after the rolling-window time gate. Then confirm an exact-main ready production deployment and GET-only checks for page HTTP 200, self-canonical/indexability, unchanged sitemap URL, the single `420443P5` API/card, image and attribution parameters. Do not follow a sponsored link or generate a click event. This existing URL does not trigger another GSC indexing reminder.
