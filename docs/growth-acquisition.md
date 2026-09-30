# Organic acquisition operating instructions

Owner request, September 22, 2026: automate the work that improves revenue efficiency, including acquisition. The owner will export Viator reports manually when asked. Keep acquisition truthful, useful, bounded and compatible with the project's existing maintenance budget.

## Active paths

1. Search discovery for existing focused guides: preserve useful URLs and improve a specific unanswered traveler decision with official sources. Priorities are the Cozumel taxi guide, Tokyo hotel-to-Yokohama embarkation guide, Osaka cruise-call fit, and then the existing Seven Mile Beach and Roatan terminal guides when evidence warrants work.
2. Owned shareable resources: the Tokyo guide contains `#tokyo-transfer-checklist`, with copy and print controls. Cozumel already contains a whole-party comparison tool. Improve usefulness before adding another page.
3. Pinterest native RSS: `/feeds/pinterest.xml` contains a small editorially selected set of distinct resources with owned informative PNG images. Pinterest publication requires an actual business account, a claimed `portdayguide.com` domain and a connected feed. At initial release that account connection is **not verified**. Do not describe prepared feed items as published Pins or acquired customers.

## Source-backed distribution

- Official native RSS instructions: <https://help.pinterest.com/en/business/article/auto-publish-pins-from-your-rss-feed>.
- Domain claim instructions: <https://help.pinterest.com/en/business/article/claim-your-website>.
- Creative reference: <https://business.pinterest.com/creative-best-practices/>.
- Platform rules: <https://policy.pinterest.com/en/community-guidelines>.
- Use the native RSS connection, not unofficial posting bots. Do not register accounts, accept new terms, invent domain claim tokens, buy advertising, or change DNS under this runbook. An actual personalized verification meta tag/file supplied by the owner can be implemented as a separate scoped task.
- Feed links point to the corresponding owned guide and carry `utm_source=pinterest`. They do not redirect straight to affiliate checkout. Keep each GUID stable and its publication date factual. Never rotate IDs/dates or republish near-identical cards to manufacture frequency.
- Every image must explain a useful decision. Use owned original diagrams or properly licensed assets; do not fabricate photographs, fares, reviews, maps or travel guarantees. Check legibility at mobile size and verify destination anchors and images before merging.
- The initial feed has only two distinct resources. There is no posting quota; add at most one new useful resource in seven days after demand/source review, within the combined two-improvement weekly budget. Do not automatically feed all port pages.

## Opportunity research run

Read current main, this file, `automated-operations.md`, the operations log and open PRs before editing. Check recent work to avoid duplication. Required tools are the verified GitHub connection and public web/HTTP access. Social account access is not a dependency for this preparation task.

Perform a bounded public search for current questions about the active paths: terminal ambiguity, group taxi costs, luggage, pickup and call-length fit. Use at most three focused searches; retain only directly read, dated and relevant evidence. A question is a demand signal, not a customer list. Do not store traveler identities or collect contact details.

Read the destination's current rules before proposing any posting. Cruise Critic's guidelines prohibit AI-generated contributions and commercial promotion: <https://boards.cruisecritic.com/guidelines/>. r/Cruise also restricts self-promotion: <https://www.reddit.com/r/Cruise/>. These are research inputs, not automatic posting destinations. Do not pretend to be a traveler, send unsolicited private messages, post repetitive links or bypass moderation.

Use a strong repeated question to improve an existing guide/checklist or prepare one distinct feed resource. If the question is already answered, record the opportunity without creating duplicate content. A no-op is valid when evidence is weak. Commit only public source URLs and technical changes; private traffic, click counts, exports and earnings stay out of GitHub.

Follow the existing branch -> lint/tests -> PR -> required checks -> exact-head merge -> production verification flow. The operating and acquisition tasks share a maximum of two substantive improvements per seven days and must not churn the same landing page inside its observation window. Priority bug fixes may proceed when necessary.

## Measurement and owner requests

### Fixed question sample and editorial handoff

Keep at most five directly read, dated traveler questions. Review actual AI-product citations monthly or at the existing milestones; record platform, observation date, language/region, original question and the exact cited site URL. Search-engine results and generated answers are not evidence of a ChatGPT Search, Google AI or Copilot citation. Never record unavailable access as no citations.

- **AQ-01 (retained September 28, 2026):** "How plentiful/accessible are taxis normally at the port in Cozumel?" Source: [DISboards, September 7, 2026](https://www.disboards.com/threads/kuza-theme-park-on-your-own-taxis-in-cozumel.3986265/), with follow-up discussion through September 11. Context: a family comparing independently purchased KUZÁ admission plus taxis with a cruise-line package also struggled to match ticket inclusions. This is one qualitative question, not measured search volume or evidence of general taxi availability. No traveler identity is retained.
- Existing `/ports/cozumel/taxi-rates` already covers exact pier, whole-vehicle costs and a return plan. The narrower potential gap is matching admission inclusions before comparing package totals. [KUZÁ's own ticket catalogue](https://kuzapark.com/tickets/), read September 28, distinguishes Escape and Full Experience; the latter lists water-park and zipline access. Do not copy forum prices or infer that cruise-line packages are equivalent. The linked Disney package page could not be read because of a redirect loop. Its sailing-specific inclusions, availability and price therefore remain unverified.
- Handoff to revenue/content work: after the observation window and weekly allowance permit, consider a small comparison checklist within the existing guide only if the package comparison can be sourced on both sides. No new article or Pin is authorized by this single observation. PR #19 remains the separate Osaka article in progress.
- AI citation baseline, September 28: ChatGPT Search, Google AI Overviews/AI Mode and Bing/Copilot **not checked**; no actual product-result surface was read. Language/region and cited URL are unavailable. Retain this question for the October 14 review; do not fill the sample with invented questions.

### September 30 question-sample addition

- **AQ-02 (retained September 30, 2026):** "Does anyone know if there are taxis that fit 2 adults and 3 kids? If so, about how much per way?" Source: [DISboards, July 14, 2026](https://www.disboards.com/threads/paradise-beach-cozumel.3984400/), about Paradise Beach, with replies through July 16. This is one dated family-transport question, not measured demand volume. No traveler identity or reply prices are retained.
- [Paradise Beach's official FAQ](https://www.paradisebeachcozumel.com/faqs), re-read September 30, gives a USD estimate for only 1–4 people and does not name the origin pier or fare effective date. It does not verify a five-person fare, child-seat provision, van availability or a guaranteed return pickup. Do not extend the four-person estimate to this family or treat community replies as an official tariff.
- Coverage decision: the existing Cozumel taxi guide already distinguishes passenger bands, exact pier, vehicle totals and a separate return plan, while its calculator accepts multiple vehicles. Retain AQ-02 for the fixed AI-question sample, but do not create a duplicate article or Pin. Any later five-person example needs a current first-party quote with pier, passenger count, vehicle capacity, currency and both directions, plus the existing observation/quota gates.
- AI-result observation for AQ-02: ChatGPT Search, Google AI Overviews/AI Mode and Bing/Copilot **not checked**; no actual AI-product result was read. Source question language is English; test language/region and cited URLs are unavailable. The sample now contains two questions; next scheduled evidence review remains October 14.

### New-page indexing handoff

Follow the September 27 owner rule in `automated-operations.md`: after production verification, batch new indexable canonical URLs into one Chinese GSC Request indexing reminder. Deduplicate against the operations log; drafts and existing-URL edits do not trigger a reminder. This task never submits indexing requests itself.

- Existing affiliate events can label a current-page entry as `pinterest`, `checklist`, or `unspecified`. No visitor ID, source persistence or pageview counter is introduced. Events are not visits or bookings; do not infer a conversion rate without a valid denominator.
- For a missing or stale source, write unavailable, not zero. Netlify connector project/deploy access does not prove private Blobs read access. Public product API success is not Viator financial reporting access.
- The owner manually supplies Viator CSV files. For the baseline, request the last 60 days of Performance Trends split by campaign and the Gross Bookings Report with booking date, travel date, status, campaign/product when available, and commission. Customer names, email addresses and payment details are unnecessary. Do not request credentials.
- After baseline, request an updated matching export when a concrete decision requires it, ordinarily no more than once every 14 days. Do not repeat the same outstanding request on every run. Later reconcile completed and paid commission separately from gross/pending bookings. Manual report availability does not block useful public checks, repairs or content work.
- Initial report request is part of the September 22 owner handoff. Until received, treat revenue evidence as unavailable and avoid repeating that request before October 6 unless the owner supplies a report or asks to review it.
- First review the real Pinterest import after account setup: correct board, exact item count, linked guide, image and source parameters. Native publication timing is controlled by Pinterest; feed availability alone does not establish a successful import.

## Review and stop rules

Preserve the existing October 14, November 13 and December 13 operating review dates. Compare complete periods and unchanged definitions. Allow 14–28 complete days after substantive SEO changes. Evaluate referrals, useful outbound clicks, attributed bookings and cancellations when available, alongside operator effort. A small sample cannot establish a stable conversion rate or causal uplift. If the acquisition path remains unconnected or has no usable evidence, stop expanding it and name the concrete dependency. Do not buy traffic to compensate for missing evidence.

Notify the owner in concise Chinese after an actual improvement, a meaningful verified change, or a specific one-time setup requirement. Keep healthy no-change runs quiet. Distinguish code published, feed connected, Pins published, visitors acquired, bookings attributed, commission completed and cash received.
