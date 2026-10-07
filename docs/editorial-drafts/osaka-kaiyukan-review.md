# September 24, 2026 — Osaka aquarium article handoff

Status as of October 1: resumed in the same PR #19, with article route implemented. The September 24 handoff below is retained as history; the October 1 review supersedes its quota hold and unimplemented-route statements. Publication still requires the exact-head CI/preview and production checks.

## Current-main and quota check

- Base: `bb8e1f4cbddb449efd3c46e8b6a1bb14e0917824`. Read the three operating documents, actual content registry/routes, current sitemap, recent commits and open PRs. No AGENTS.md exists in the recursive tree. Unrelated open PR #4 remains untouched.
- Current rolling-seven-day substantive releases: #16, `71bf9364af39329cf38e8e665b92bed2ced9bf11`, committed 2026-09-21T04:39:13Z; #17, `d80d4ee57297588a5e64bc0eac79c1a373cfa0cb`, committed 2026-09-22T04:09:19Z. #18 is documentation only.
- The old runbooks call #17 an initial setup batch. The current owner instruction explicitly caps all substantive changes by actual commit time and does not exempt that batch, so count it conservatively. No third substantive release on September 24. Recheck main and all three tasks at the next run; do not infer an available slot merely from this old ledger.
- Latest inspected hosted health run succeeded on current main: https://github.com/kevinchan246/portdayguide/actions/runs/35898476055 (created September 23, 2026). This is existing-site evidence, not article acceptance.

## Bounded candidate review and intent switch

1. Tokyo to Daikoku with cruise luggage: rejected for overlap. Current `/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal` already covers the road connection, access documents, organizer arrival time, luggage and exact-terminal confirmation. Public search did not yield an additional verified question sufficient to justify another page.
2. Seven Mile Beach transport and public access: rejected for overlap. Current `/ports/grand-cayman/seven-mile-beach-from-port` already compares named accesses, taxi/bus/bundled transfer and last-tender timing. No independently verified new facility decision was established.
3. **Can I visit Kaiyukan independently during a short Tempozan cruise call, and which entry time should I book?** Selected for drafting after those rejections. Osaka hub's city plans cover castle/food districts and generic nearby fallback, not aquarium ticket-slot arithmetic, entry availability or family access. This is a narrower admission decision, not a renamed Osaka overview.

Public discovery: the Kaiyukan search returned traveler discussion of advance tickets and crowding, including a cruise visitor describing a timed ticket. Read result: https://en.tripadvisor.com.hk/Attraction_Review-g298566-d320969-Reviews-Osaka_Aquarium_Kaiyukan-Osaka_Osaka_Prefecture_Kinki.html . General result: https://www.tripadvisor.ie/Attraction_Review-g298566-d320969-Reviews-Osaka_Aquarium_Kaiyukan-Osaka_Osaka_Prefecture_Kinki.html . These are qualitative discovery only, not demand counts, verified travel instructions or proof of a trending keyword. No traveler identities retained. Broad searches often returned irrelevant results; those were discarded. Official ticket guidance independently establishes the actual timed-entry limitation. No search volume, difficulty, ranking or order estimates are asserted.

GSC was not a dependency and no fresh read is claimed. The runbook's last successful snapshot was read September 20 with data through September 18; the September 21 read failed with `payment_required`. No private counts or financial exports are included here.

## Reader brief written before drafting

- Reader: independent cruise passenger, particularly a family, with a confirmed short Osaka port call.
- Scenario: considering a nearby paid aquarium visit from Tempozan rather than a city excursion; not an airport transfer, Kyoto day trip or luggage-storage guide.
- Decision: whether to buy, which date/time to choose, and when to abandon the purchase if the remaining slot does not fit.
- Constraints: actual berth/exit, clearance, opening calendar, timed admission, visit duration, child/mobility needs, and ship's return instructions. No assured ticket inventory or gangway-to-door walking time.
- Essential subquestions: is this the correct berth, how do I find the attraction, how long inside, what entry deadline fits, what changes the group price, what if late, how do stroller/access needs change planning, and how do I get back without adding an unrelated district?
- Structure: answer -> berth gate -> backward time calculation -> ticket purchase -> family/access exceptions -> stop-or-continue decision. The time calculation precedes price because an unusable slot is the decisive failure, regardless of cost. No generic FAQ, overview checklist, table, fixed product count or repeated CTA. The numerical example is explicitly hypothetical arithmetic, not a fabricated traveler case or recommended universal buffer.
- Service fit: verified official date/time admission is the useful purchase. No Viator product has been verified as a better match, so no affiliate product or general city-tour filler is included. Existing site attribution, campaign conventions and footer disclosure stay unchanged.

## Sources actually read September 24

- https://www.mlit.go.jp/kankocho/cruise/detail/029/index.html — two berth names and port context. It is not a live berth assignment or a step-free route survey.
- https://www.mlit.go.jp/kankocho/cruise/detail/029/documents/kanko.pdf — page 2 places Tempozan Harbor Village beside the port; not evidence of a precise gangway walking duration.
- https://osaka-info.jp/en/spot/osaka-aquarium-kaiyukan/ — aquarium address, Osakako Exit 1 reference, 120-minute visit reference. Its generic price/hours are not used as the current dated booking quote.
- https://www.kaiyukan.com/info/ticket/kaiyukan/ — variable pricing, advance date/time e-tickets, warning that same-day preferred entry may be unavailable. Calendar values did not render as reliable current inventory; no live price/availability asserted.
- https://www.kaiyukan.com/info/hours/ — official operating-calendar destination; specific future day/hour values not verified.
- https://www.kaiyukan.com/info/area/nursing/ — stroller policy, elevator assistance, baby-care facilities.
- https://www.kaiyukan.com/info/area/barrierfree/ — limited loan wheelchairs, accessible toilets, staff elevator guidance. Does not prove accessible access from the ship.
- The older `/language/eng/` endpoint returned 403 to the reader. The current public Japanese home page and its linked current pages were readable; no access control was bypassed.

## Comparison and content self-check

Actually read current article components and their relevant content records, not only titles:

- `/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal`: answer -> terminal table -> Tokyo origin routes -> Daikoku exception -> luggage -> transfers/cost -> arrival -> checklist/FAQ -> related guides.
- `/ports/cozumel/taxi-rates`: answer/fit -> fare-source table -> pricing mechanics -> arrangement choice -> cost calculator -> booking checks -> drivers -> return/verdict.
- `/ports/roatan/west-bay-beach-from-cruise-port`: answer/fit -> terminal split -> beach-name distinctions -> transport -> booking inclusions -> products -> return/verdict.
- `/ports/grand-cayman/seven-mile-beach-from-port`: answer/fit -> access selection -> named beaches -> transport costs -> products -> two return checkpoints -> verdict.
- Related `/ports/osaka`: read local planning data, independent city routes, access notes and route render code; it selects one city area and explicitly excludes Kyoto from short-call examples.

Shared visual components are appropriate; copying these complete skeletons is not. The draft answers the essential questions and closes on the entry/return decision instead of repeating a summary or injecting generic products. Rejected during drafting: a universal five-minute ship walk; an unverified fixed ticket price; implied guaranteed wheelchair access; luggage-locker availability; assumed late-entry/refund rights; a new generic FAQ section. None is claimed in the draft.

## Planned implementation, still uncompleted

- Suggested route: `/ports/osaka/kaiyukan-from-cruise-port`; do not link it as live yet.
- SEO title: `Kaiyukan From Osaka Cruise Port: Short-Call Planning`.
- H1: the draft title. Description: `Plan a Kaiyukan visit from Tempozan: choose a workable entry slot, allow time to return, check ticket costs, and account for children or mobility needs.`
- Render original prose in the existing port-article visual system without the mandatory generic fit/steps/verdict skeleton. Reuse navigation, typography, accessible links and footer disclosure.
- Add the route to the real content registry and sitemap; add a relevant Osaka hub/directory entry and reciprocal link. Do not broadly rewrite the September 22 hub or its city budgets.
- Self-canonical must be the final production URL. Use truthful Article/Breadcrumb metadata matching visible content; no FAQ/rating/AI-specific schema. Set actual publication date only when publication is scheduled to occur; preserve the genuine source-check date.
- No new photo is required to understand this decision. If using the existing Osaka hero, verify its actual identity, license/credit and rendering; do not label a generic Osaka photo as the aquarium or route.
- Before first successful article release, synchronize September 23 authorization, one reserved weekly article slot, shared quota, per-article completeness/non-template checks and AI-search goals into BOTH operating runbooks in this same PR. Preserve historical instructions and unrelated constraints; do not merge a documentation-only authorization rollout.

## AI-search preparation and remaining acceptance gates

Natural-language target and berth/entry/time/price conditions are explicit above and beside the relevant draft answers. First-party citations and the real verification date are included; arithmetic is labeled editorial. Official guidance read: https://developers.google.com/search/docs/appearance/ai-features , https://developers.openai.com/api/docs/bots , https://help.openai.com/en/articles/12627856-publishers-and-developers-faq . Google does not require AI-specific schema; OAI-SearchBot search controls are separate from GPTBot training controls. No training preference changed.

Production `/robots.txt` was read directly and currently allows `/` for `User-Agent: *`, disallowing `/api/`; this does not explicitly block Googlebot, Bingbot or OAI-SearchBot from article routes. The actual sitemap was readable. Neither fact establishes requests from genuine crawler IPs or inclusion in AI results.

GET-only existing-site preflight at `2026-09-24T13:32:00.610Z` passed all eight repository health targets, with no warnings: four existing pages, robots, sitemap and two product endpoints. Ran `node --use-env-proxy scripts/check-live-site.mjs --output outputs/seo-preflight-proxy-2026-09-24.json`; the unconfigured direct-network attempt is not evidence of a site outage. No sponsored links were followed and no click events were posted. Draft files pass whitespace/content review. These checks do not validate a new rendered article.

The new route is not implemented, so its rendered body, canonical, robots headers, schema, reciprocal links, desktop/mobile layout, lint/build/rendered tests, exact-head required CI, preview and production acceptance remain **pending**. No article publication or AI citation is claimed. Preserve this PR as draft; finish those steps only after the rolling quota is rechecked. Keep October 14, November 13 and December 13 reviews, then monthly; normally allow 28 days after actual article publication before assessing complete-period outcomes. No extra Viator-report request or Pinterest item is created here.

## October 1 resumption and review

- Current main: `22da037add4fe1536851153291d08b90618b80d7`; no AGENTS.md exists in this checkout. Merged current main into the existing article branch; unrelated #4 untouched.
- Seven-day ledger: #22 at 2026-09-29T14:51:29Z occupies the shared improvement slot. #25 at 2026-09-30T23:00:10Z is the separately owner-requested scenic batch explicitly recorded as a scoped exception in both current-main runbooks; that exception preserves the reserved article slot. #20 is crawl-regression test coverage, #21/#23 are records, #24 is separate domain verification setup. No article was released during the window. This one article uses the reserved slot; no catch-up article or feed change.
- Reconsidered the same three questions and retained Osaka: Tokyo/Daikoku and Seven Mile transport remain answered by their existing guides. Public search on October 1 shows conflicting unofficial statements about timed tickets/re-entry, establishing a practical source-correction gap, not keyword volume. Re-read official ticket/port/tourism/family/accessibility pages. The current official May 30 e-ticket notice verifies 15-minute slots, Webket login, late-entry priority and conditional cancellation. May 21 notice ends re-entry June 15. April 16 notice prohibits carry cases from April 24; inspected the English PDF visually to distinguish prohibited luggage from conditional stroller/walking-aid access. June 12 ticket-seller notice directs readers to authorized purchase routes. Added these material rules rather than republishing stale draft assumptions.
- Additional sources: <https://www.kaiyukan.com/about/news/20582.html>, <https://www.kaiyukan.com/about/news/20564.html>, <https://www.kaiyukan.com/about/news/20515.html>, <https://www.kaiyukan.com/assets/pdf/rule/list_of_rule_changes.pdf>, <https://www.kaiyukan.com/about/news/20615.html>. Check date in the article is October 1, 2026; original September 24 research remains documented above. No current ticket price or inventory was readable reliably, so the article directs readers to the date calendar instead of inventing a quote.
- Re-read the actual current component bodies for Tokyo→Yokohama, Cozumel taxis, West Bay, Seven Mile and the Osaka hub/planning data using the paths in the original comparison. The new article keeps the berth → backward slot calculation → purchase terms → family/luggage → continuous visit/return sequence. It has no borrowed generic fit panel, fare table, FAQ, product-card quota or planner CTA. Rewrites add an immediate conditional answer, replace the vague late/refund warning with verified seller-specific rules and replace generic suitcase advice with the actual prohibition. All essential brief questions remain answered; the 14:00/11:00 example is explicitly hypothetical and uses no universal walking guarantee.
- Article body lives in `components/OsakaKaiyukanArticle.tsx`; registry drives the existing route, Osaka hub backlink, `/ports` directory and sitemap. Article/Breadcrumb schema mirrors title/date/canonical; no FAQ, rating or AI-specific schema. No affiliate product is verified as suitable, and none is rendered; official tickets are the appropriate purchase path. No sponsored links clicked or production click events sent.
- Both runbooks now preserve the September 23 weekly-authoring, structure/completeness, AI-search and task-ownership rules within the first article PR, alongside the existing GSC reminder rule. Private analytics and commercial figures are excluded.
- Local/hosted validation and final production evidence are recorded in the PR and operations log. GSC reminder remains pending until production verification. A deployed route does not prove Google indexing or AI citation. Keep the established review dates and approximately 28-day observation window.

## October 6 existing-article monetization and photo revision

The owner requested suitable Viator options and matching high-quality pictures on the published article, plus direct publication after checks. The October 1 no-affiliate decision remains historical; it does not establish that Viator has no related inventory. This is a separately authorized revision to the same URL, not a new article.

Researched exact admission listings `61600P12` and `107217P131`; current public retrieval exposes no booking interface and includes unresolved redemption/timed-entry details, so they are excluded rather than advertised as confirmed active admission. The `2142OSA_P601` aquarium/bay outing meets in Umeda rather than at Tempozan and remains unsuitable for this independent short-call plan. A private cruise walking guide `429399P3` has a current sales interface and Tempozan meeting, but its sample route does not include Kaiyukan; no generic city-tour card is inserted to fill the gap.

Selected two optional experiences at the adjacent Tempo Harbor Theater, Osaka Cultural Center fourth floor, 1-5-10 Kaigandori: `467011P1` (Wadaiko Rhythm Quest workshop) and `467011P3` (UTAGE performance). Both Viator public pages currently show price/date/traveler selection and Check Availability, independently checked October 6. They are separate purchases, not aquarium admission, transport or a guarantee of a seat on a particular cruise date. Current operator English/Japanese UTAGE weekday schedules conflict and Viator lists about 45 minutes versus approximately an hour in the venue program, so the article does not hardcode days/times and budgets about an hour plus each activity's own arrival instructions and ship-return allowance. The workshop requires arrival 15 minutes early, disallows entry more than five minutes late and is listed as not wheelchair accessible; those conditions are not transferred to the performance. UTAGE requires under-16s to have a guardian. Afternoon/evening sessions may not fit a short call; the optional section explicitly tells the reader to skip an unsuitable session.

Sources actually read:
- <https://www.viator.com/tours/Osaka/WA-DAIKO-RHYTHM-QUEST-Japanese-drum-experience/d333-467011P1>
- <https://www.viator.com/tours/Osaka/OSAKA-UTAGE-LIVE-SHOW-at-TEMPO-HARBOR-THEATER/d333-467011P3>
- <https://www.tempo-harbor-theater.com/en>
- <https://www.tempo-harbor-theater.com/wadaiko-rhythm-quest>
- <https://www.tempo-harbor-theater.com/en/utage-live-show>
- <https://www.tempo-harbor-theater.com/utage-live-show>
- <https://www.kaiyukan.com/info/ticket/>

The existing berth → backward slot calculation → official purchase → family/luggage → one continuous visit sequence stays intact. The two optional nearby experiences follow the existing reassessment decision and do not require making the aquarium visit longer or changing the return margin. Product-code filtering excludes unreviewed lookalikes and old tickets; existing API supplies current source prices/reviews where available. A clear direct workshop listing fallback does not invent a quote or dated availability. Campaign: `pdg-osaka-kaiyukan-from-cruise-port`; placement: `kaiyukan-nearby-taiko`. The official aquarium ticket route stays available.

Replaced the castle hero with the actual 2026 Kaiyukan exterior, including matching Open Graph/Twitter/Article image. Added a licensed archival whale-shark body photograph clearly labelled 2010. Original sources, authors, licenses, dimensions, conversion and source history are in [the photo record](../kaiyukan-image-sources.md). Responsive WebP sizes retain the real subjects without generative changes. Desktop/mobile, failure/empty-response and production verification belong to the PR release record; no indexing or income outcome is inferred.
