# Recommendation card presentation audit — October 13, 2026

## Scope and coordination

The owner explicitly requested auditing the other long-tail articles and presenting actual Viator recommendations in the site's existing recommendation-card style. This is a separately authorized, one-time presentation batch. It does not add an article, a product recommendation, a price, a rating, a selected-date availability claim or another regular weekly old-page improvement.

Inventory and code review started from main `0a60c8b283b9703f371c30c8b4d7a039ffc5b282`, after the Hobby card follow-up in [PR #37](https://github.com/kevinchan246/portdayguide/pull/37). The inventory has 16 canonical planning articles: 11 port-topic guides from `lib/port-intent-guides.ts` and five blog entries from `lib/blog.ts`, combined by `lib/planning-articles.ts`. Unrelated PR #4 is outside this work.

The normal live-card components and their product selection stay intact. Only the Alaska one-way static recommendation and Osaka's existing fallback/no-JavaScript recommendation need presentation conversion. Official transport or attraction references are editorial sources, not automatically Viator product recommendations to turn into affiliate cards.

## Complete article inventory

Paths below are the exact public canonical paths under `https://portdayguide.com`.

| Canonical path | Recommendation component or existing presentation | Presentation decision |
| --- | --- | --- |
| `/blog/hobby-airport-to-galveston-cruise` | Server-rendered `intent-viator-card` for `320728P1546`, completed in PR #37 | Already correct; preserve |
| `/blog/alaska-one-way-vs-round-trip` | Plain static callout for `207018P10` | Convert the existing conditional Whittier-to-Anchorage recommendation to one server-rendered card |
| `/blog/alaska-cruise-ports` | `AlaskaViatorPicks` live `intent-viator-card` collection | Already card-based; preserve; live collection verification belongs to the release record |
| `/blog/future-of-cruise-ship-terminals/mco-to-port-canaveral` | No actual Viator product recommendation or affiliate product link; official transport references | No card conversion or new product insertion |
| `/blog/future-of-cruise-ship-terminals` | No actual Viator product recommendation or affiliate product link; editorial industry references | No card conversion or new product insertion |
| `/ports/osaka/kaiyukan-from-cruise-port` | `OsakaKaiyukanArticle` → `IntentViatorCards`; two normal live cards; existing text fallback/no-JavaScript link for `467011P1` | Convert that fallback to a no-image card; preserve the two normal live cards |
| `/ports/costa-maya/to-mahahual` | Generic topic page → `IntentViatorCards` | Already card-based; preserve |
| `/ports/costa-maya/port-vs-mahahual` | Generic topic page → `IntentViatorCards` | Already card-based; preserve |
| `/ports/roatan/mahogany-bay-vs-coxen-hole` | Generic topic page → `IntentViatorCards`; restricted to `113828P11` | Already card-based; preserve |
| `/ports/roatan/west-bay-beach-from-cruise-port` | `BeachTransferArticle` → `IntentViatorCards`, with separate beach and private-island groups | Already card-based; preserve |
| `/ports/cozumel/which-cruise-terminal` | Generic topic page → `IntentViatorCards` | Already card-based; preserve |
| `/ports/cozumel/taxi-rates` | `CozumelTaxiArticle` → `IntentViatorCards` | Already card-based; preserve |
| `/ports/grand-cayman/tender-guide` | Generic topic page → `IntentViatorCards` | Already card-based; preserve |
| `/ports/grand-cayman/seven-mile-beach-from-port` | `BeachTransferArticle` → `IntentViatorCards` | Already card-based; preserve |
| `/ports/yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal` | `YokohamaTerminalArticle` → `IntentViatorCards` | Already card-based; preserve |
| `/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal` | `TokyoYokohamaTransferArticle` → `IntentViatorCards` | Already card-based; preserve |

## Read-only public port-topic checks

Checked October 13, 2026, approximately 20:36–20:38 UTC. Each of the 11 port-topic canonical pages above returned HTTP 200 and the matching self-canonical. Checks requested public pages and product APIs with GET only; no sponsored link or tracking event was activated.

The HTML contains the live-card loading grid because `IntentViatorCards` fetches after hydration. Absence of an actual product card in initial HTML is not evidence that the browser failed to display it. Browser hydration, card images and desktop/mobile presentation are separate release checks.

| Port-topic path suffix | Final public API result | Product codes returned |
| --- | --- | --- |
| `osaka/kaiyukan-from-cruise-port` | 200, 2 products | `467011P3`, `467011P1` |
| `costa-maya/to-mahahual` | 200, 4 products | `223651P3`, `441202P5`, `5627671P8`, `5562311P1` |
| `costa-maya/port-vs-mahahual` | 200, 4 products after one bounded retry | `6112PRTCTMCHA`, `420443P5`, `420443P3`, `5562311P1` |
| `roatan/mahogany-bay-vs-coxen-hole` | 200, 1 product | `113828P11` |
| `roatan/west-bay-beach-from-cruise-port` | 200, 4 products | `426735P19`, `62963P34`, `184749P93`, `426735P8` |
| `cozumel/which-cruise-terminal` | 200, 4 products | `45382P323`, `22191P1`, `5522PRTCZMSUB`, `270003P13` |
| `cozumel/taxi-rates` | 200, 2 products after one bounded retry | `22191P1`, `427966P14` |
| `grand-cayman/tender-guide` | 200, 4 products | `5658771P3`, `72082P8`, `10309P20`, `6681P3` |
| `grand-cayman/seven-mile-beach-from-port` | 200, 4 products | `405190P6`, `8717P8`, `5613121P1`, `8717P1` |
| `yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal` | 200, 4 products | `174545P159`, `442381P81`, `5586670P118`, `442381P73` |
| `yokohama-tokyo/tokyo-to-yokohama-cruise-terminal` | 200, 1 product | `320728P219` |

The initial Costa Maya comparison and Cozumel taxi API requests returned HTTP 503. One bounded recheck recovered both to 200 with nonempty results. For the generic Costa Maya page, the recheck included its actual component's `content=2026-10-07` version. These observations are transient request failures, not evidence of a persistent outage or a new infrastructure fault.

Exact public API URLs checked:

- <https://portdayguide.com/api/viator/products?port=osaka&intent=kaiyukan-from-cruise-port>
- <https://portdayguide.com/api/viator/products?port=costa-maya&intent=to-mahahual>
- <https://portdayguide.com/api/viator/products?port=costa-maya&intent=port-vs-mahahual>
- <https://portdayguide.com/api/viator/products?port=costa-maya&intent=port-vs-mahahual&content=2026-10-07>
- <https://portdayguide.com/api/viator/products?port=roatan&intent=mahogany-bay-vs-coxen-hole>
- <https://portdayguide.com/api/viator/products?port=roatan&intent=west-bay-beach-from-cruise-port>
- <https://portdayguide.com/api/viator/products?port=cozumel&intent=which-cruise-terminal>
- <https://portdayguide.com/api/viator/products?port=cozumel&intent=taxi-rates>
- <https://portdayguide.com/api/viator/products?port=george-town-grand-cayman&intent=tender-guide>
- <https://portdayguide.com/api/viator/products?port=george-town-grand-cayman&intent=seven-mile-beach-from-port>
- <https://portdayguide.com/api/viator/products?port=yokohama-tokyo&intent=things-to-do-near-yokohama-cruise-terminal>
- <https://portdayguide.com/api/viator/products?port=yokohama-tokyo&intent=tokyo-to-yokohama-cruise-terminal>

The release author additionally checked all five blog canonical URLs on October 13, 2026: each returned HTTP 200 and the matching self-canonical. These are <https://portdayguide.com/blog/hobby-airport-to-galveston-cruise>, <https://portdayguide.com/blog/alaska-one-way-vs-round-trip>, <https://portdayguide.com/blog/alaska-cruise-ports>, <https://portdayguide.com/blog/future-of-cruise-ship-terminals/mco-to-port-canaveral> and <https://portdayguide.com/blog/future-of-cruise-ship-terminals>.

The Alaska overview's existing collection endpoint, <https://portdayguide.com/api/viator/products?featured=alaska>, returned HTTP 200 with four products: `74349P2`, `14707P1`, `64781P20` and `31653P1`. Its server HTML has the loading placeholder; actual cards render after hydration. That placeholder is not proof that recommendations are absent, and the API result is not selected-date booking availability. These are checks of the existing production behavior before the new presentation batch, not proof that the batch is released.

## Existing fallback behavior and scoped change

`IntentViatorCards` currently hides its section on request failure or an empty response when no explicit fallback is configured. Osaka is the only port-topic consumer with an explicit product fallback. Its successful response supplies the two existing products and their API product images. Its fallback and no-JavaScript path currently show a text link for the already reviewed `467011P1` taiko workshop.

The presentation change should render that same fallback as a single card with a concise product title and clear Viator action, while keeping the failure/empty-result explanation outside the card. Use a one-column, no-image form rather than an aquarium photograph that could be mistaken for the theater or workshop. Do not invent a fallback quote, rating, review count, stock badge or successful API response. The same product URL, pid, campaign, placement and product-code attributes remain intact. The default two live cards and their selection rules remain unchanged.

## Product and photo evidence retained

This audit does not newly verify every product's commercial fit. Existing primary-source records remain the basis for the static recommendations. The release author reread `207018P10`, its operator transfer/FAQ sources and `467011P1` on October 13, 2026; the documented direction, seasonal/session and availability limits were unchanged:

- Alaska transfer `207018P10`: <https://www.viator.com/tours/Whittier/Whittier-to-Anchorage-Direct-Transfer-Tour/d22320-207018P10>. Operator: <https://pacificalaskatours.com/whittier-tours/whittier-to-anchorage-cruise-ship-transfer/>; luggage/meeting instructions: <https://pacificalaskatours.com/about/faq/>. Prior read dates and constraints are in [the Alaska editorial review](alaska-one-way-review.md). It is a seasonal Whittier-to-Anchorage disembarkation transfer, not a reverse transfer or return-to-ship excursion. Selected-date inventory and current party quote remain unverified unless separately obtained.
- Osaka fallback `467011P1`: <https://www.viator.com/tours/Osaka/WA-DAIKO-RHYTHM-QUEST-Japanese-drum-experience/d333-467011P1>. Operator workshop: <https://www.tempo-harbor-theater.com/wadaiko-rhythm-quest>. Prior source dates and session restrictions are in [the Kaiyukan editorial review](osaka-kaiyukan-review.md). This is a nearby, separately ticketed workshop; it is not Kaiyukan admission or cruise-port transport.
- Hobby's existing card `320728P1546`: <https://www.viator.com/tours/Houston/Galveston-Port-to-William-Hobby-Airport-HOU-Departure-Transfer/d5186-320728P1546>, reread October 13, 2026. It remains a Galveston port-to-HOU return transfer only, with no selected-date inventory or family quote claim.

The new Alaska card reuses this article's existing licensed Whittier photograph by Laura Alier, photographed June 5, 2004: <https://commons.wikimedia.org/wiki/File:View_of_Whittier_Alaska,_Prince_William_Sound.jpg>. Identify it as dated Whittier context, not a transfer vehicle, current pickup point or supplier endorsement. Retain the existing responsive image and separate linked-author credit/source record. Same-article reuse follows the existing photograph rule; no new source, photograph or transformed scenery is introduced. Osaka's no-image fallback avoids unrelated venue imagery.

There are no new URLs, feed items, Pins, GUIDs, publication dates, article covers or affiliate campaigns in this batch. Existing contextual photos, full source/license records, image credits and article identities remain intact.

## Product-fit handoff outside this presentation batch

The current Costa Maya APIs returned some Bacalar Lagoon and Chacchoben excursions under headings that describe Mahahual beach alternatives. This is an existing relevance concern identified from the returned titles. Corresponding product details were not re-researched in this presentation audit, so suitability has not been resolved. Hand off the named routes and returned codes to the normal revenue product-fit task for primary-source checks; do not insert new products or change those commercial page selections in this card-presentation batch. API success is not a full product-fit or selected-date availability verdict.

## Release gate ownership

The release author owns implementation review, lint/build and applicable tests, actual desktop/mobile and no-JavaScript/failure/empty-response checks, image loading and clickable credits, PR/required CI/preview verification, exact-head merge, and final production GET verification. Until those results are recorded in the release PR, this audit does not claim the Alaska or Osaka presentation changes are deployed. Existing URLs do not trigger a duplicate GSC indexing request.

Only public source URLs, content inventory and technical observations are recorded here. No private analytics, traveler information, orders, revenue, credentials or synthetic affiliate events are included.
