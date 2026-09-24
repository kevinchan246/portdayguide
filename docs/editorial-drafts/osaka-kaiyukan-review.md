# September 24, 2026 — Osaka aquarium article handoff

Status: complete English editorial draft; NOT a published site page and NOT ready to merge. Preserve this branch/PR for the next eligible article run. No existing article, feed or production route is changed. Do not create a second article to catch up.

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
