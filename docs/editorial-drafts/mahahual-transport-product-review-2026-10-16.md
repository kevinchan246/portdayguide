# Mahahual transport recommendation fit — October 16, 2026

## One existing-page improvement

Current main: `a24df52e2f0063c78bf5d25c0f0386f24db0cb1a`. Read all three operating records, recent commits, branch inventory and open PRs; only unrelated #4 is open. Continue the product-fit handoff from the October 13 card audit, not its completed presentation changes. The October 9 Roatán update is outside seven days before this release. October 13 Hobby and October 15 LGB occupy the two new-article packages. This revision uses one independent existing-page slot; no article, Pin, feed entry or new canonical.

Target: `https://portdayguide.com/ports/costa-maya/to-mahahual`. A cruise passenger choosing independent Mahahual transport needs to distinguish a taxi from a beach package and its actual pickup option. Do not recommend an inland lagoon outing under a beach-transport heading. Preserve the article's title, URL, taxi estimates' existing review date, campaign and independent photograph.

## Actual evidence and selection

GET of the production API with `port=costa-maya&intent=to-mahahual&content=2026-10-07` on October 16 returned `223651P3`, `441202P5`, `5627671P8`, `5562311P1`. This is successful inventory retrieval but not proof of suitability. The comparison-page API was also inspected; its separate product-fit concern is retained for a later allowed run, not changed here.

| Product | Actually read source | Decision |
| --- | --- | --- |
| `223651P3` | [Viator](https://www.viator.com/tours/Costa-Maya/Tour-to-the-Bacalar-Lagoon-from-Costa-Maya/d4345-223651P3) and public API | Bacalar lagoon/boat itinerary, not a ride to Mahahual; exclude. |
| `441202P5` | Public API description/route | Explicit Bacalar lagoon itinerary; exclude. No claim about selected-date sales. |
| `5562311P1` | [Viator](https://www.viator.com/tours/Costa-Maya/Beach-club-restaurant-kraken/d4345-5562311P1) | Meeting at Mariachi Loco, with instructions to take your own taxi; not a port-transport package. Exclude from this heading rather than call it unavailable. |
| `5627671P8` | Public API and search-retrieved Tripadvisor supplier listing | Potential Mahahual package, but exact Viator detail page was unreadable. Not selected pending a complete successful primary product read; not declared nonexistent or unavailable. |
| `420443P5` | [Viator](https://www.viator.com/tours/Costa-Maya/Costa-Maya-All-Included-Beach-Break/d4345-420443P5), read before editing and again at release | Select conditionally as a Nohoch Kay beach package with an explicitly chosen transport option, not a taxi fare. |

Search scope covered the four returned candidates and a precise Mahahual beach package. The selected product's detail page exposes price-per-person and a date/party availability control, and the public API returns its offering under the comparison intent. Neither establishes selected-date seats or a transport-inclusive party total. No availability request, checkout, sponsored-link click or simulated event is made. The revised precise search and exact-code allowlist must return the selected product on the preview and production API; an empty/error result is not accepted as successful monetization.

The visible copy records option-specific pickup, return confirmation, foldable/non-adapted vehicle limitations and cancellation. Do not copy the supplier's blanket accessibility label into a vehicle-access guarantee. No baggage capacity, child-seat provision, current weather/sea condition or ship-return guarantee is established; affected travelers must obtain confirmation. A five-hour package does not fit every four-hour minimum DIY call; the package requires its own ship-clock check. Original independent taxi guidance stays usable without a purchase.

## Existing image retained, no new photo

The matching malecón photograph by Juan Ortega is retained from `lib/article-covers.json` and `lib/article-photo-credits.json`: [original Commons file](https://commons.wikimedia.org/wiki/File:Walking_the_Malecon_(http-www.bluekaymahahual.com)_-_panoramio.jpg), CC BY 3.0, source SHA-1 `b5a3c6e37eba41064c471da8f0d59d760207fc28`. This is Mahahual walking context, not a photo of Nohoch Kay or a transfer vehicle. Full source/changes/license remain on `/photo-credits#costa-maya-to-mahahual`; the visible credit stays the clickable author name. No source identity, crop, variant, social/sitemap cover or other article image is replaced. Verify cross-article source identity and existing manifests with the cover suite and visually inspect desktop/mobile; live cards use the supplied product image.

## Release requirements

Lint, build, complete rendered tests including cover checks; API regression fixture excluding inland/unreviewed/beach-only candidates; browser desktop/mobile image/card/credit/overflow checks; exact-head required CI and Netlify preview; exact-head merge and ready production deployment; GET-only public page, canonical/indexing/sitemap, versioned API, card/image and attribution verification. Preserve the `content=2026-10-16` cache version, `pid=P00311056`, `campaign=pdg-costa-maya-to-mahahual`, product/placement attributes, sponsored/nofollow and single footer disclosure. No indexing reminder for this existing URL. Final release evidence belongs in the PR discussion, not a standalone documentation deployment. No private business data is included.
