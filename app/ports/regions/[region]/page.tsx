import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import { guideReadMinutes, guideUpdatedLabel } from "@/lib/editorial";
import { intentGuidePath, portIntentGuides } from "@/lib/port-intent-guides";
import { portPath, regionBySlug, regionPath, regionSeo, siteUrl } from "@/lib/seo";
import { portProfiles, portRegions, portsByRegion, type PortRegion } from "@/lib/shorepath";

const regionPlanning: Record<PortRegion, Array<{ title: string; text: string }>> = {
  "Caribbean & Bahamas": [
    { title: "Dock, tender, or private terminal", text: "The first decision is how the ship reaches land. A tender changes the usable start time; a private cruise complex can add a long walk before the public road; and one island may have several terminals with different taxi queues. Save the exact pier and operator meeting instructions before leaving ship Wi-Fi." },
    { title: "Choose one side of the island", text: "Beach clubs, reefs, historic centers, and island loops often point in different directions. Combining them can turn a relaxed day into repeated transfers. Pick one geographic anchor, keep lunch or a waterfront stop nearby, and treat a second distant attraction as a replacement rather than an automatic addition." },
    { title: "Plan for water and weather changes", text: "Wind, swell, rain, heat, and seaweed can alter a beach or boat day after it has been booked. Compare cancellation terms, identify a sheltered or town-based fallback, and avoid a final activity that depends on another boat transfer. Same-day port and operator instructions matter more than an old itinerary screenshot." },
    { title: "Keep the return independent of optimism", text: "A short map distance does not include waiting for a taxi, loading a boat, port security, or the pier walk. Start back while alternative transport is still available. For independent plans, carry the terminal name, local currency or a working card, and enough margin to absorb a missed connection without racing the ship." },
  ],
  "Alaska & Pacific Northwest": [
    { title: "Start with the named dock", text: "A downtown berth, remote dock, shuttle stop, and tender landing create different first miles even within the same port. Match the ship to the dock schedule and read whether an excursion collects beside the gangway, at a visitor center, or after a shuttle. That pickup detail can matter more than the attraction distance." },
    { title: "Let weather shape the primary plan", text: "Glacier views, wildlife boats, flightseeing, rail trips, and mountain routes are all sensitive to conditions in different ways. Choose the experience that matters most, understand its operator cancellation process, and keep a town, museum, food, or waterfront alternative that still feels worthwhile if visibility or sea conditions deteriorate." },
    { title: "Do not compress transfer time", text: "Road construction, shuttle lines, tender boarding, and tour dispatch can consume a meaningful part of a short call. A published drive time is not a complete ship-to-attraction estimate. Include the walk from the berth, check-in, loading, the full ride back, and a ship-side margin before deciding that a second stop fits." },
    { title: "Dress and book for flexibility", text: "Layered clothing and rain protection make a changing day easier to salvage. When comparing excursions, check the pickup dock, minimum mobility, vessel or aircraft type, cancellation terms, and what happens when weather interrupts the route. Keep confirmations available offline because service can be uneven away from town." },
  ],
  "Mexican Pacific": [
    { title: "Separate marina, tender, and town", text: "Some calls begin with a tender or marina transfer before the independent day starts. Others dock near transport but not near the beach or historic center shown in search results. Confirm the landing, the official taxi area, and where a private operator is permitted to meet before judging any destination by map distance." },
    { title: "Choose coast, center, or inland route", text: "A beach day, old-town walk, coastal boat, and inland food or nature trip can require different roads and return plans. Build around one direction. Put the flexible meal or shopping stop on the return route and avoid crossing the same congested zone twice simply to add another headline attraction." },
    { title: "Agree on transport details early", text: "For taxis or private drivers, confirm whether a fare is per person or per vehicle, the currency, included waiting time, and the exact return point. Photograph the terminal entrance and save the ship name. A clear round-trip agreement is more useful than relying on a generic cruise-port pin or an unverified social post." },
    { title: "Protect time for heat and queues", text: "Heat, tender boarding, traffic near the marina, and port-entry checks can slow the final hour. Leave the most optional activity until last, keep small bills or a reliable card, and begin the return before transport becomes scarce. The safe plan reaches the terminal calmly rather than using ship departure as the target." },
  ],
  "Mediterranean & Atlantic": [
    { title: "Know whether the port is the destination", text: "Barcelona, Naples, Lisbon, and Valletta can support a city-focused day, while Civitavecchia, Livorno, and Piraeus may be used as gateways to a different headline city. The famous place name in the itinerary does not erase the transfer. Confirm terminal shuttles and the true ship-to-center time first." },
    { title: "Use one timed-entry anchor", text: "Reserved museums, landmarks, trains, and guided entries can improve a port day, but stacking several fixed appointments removes the ability to recover from a late clearance or slow transfer. Choose one time-critical anchor, surround it with walkable or flexible stops, and place the final block toward the port or return station." },
    { title: "Build a complete return chain", text: "A gateway-city day may require a walk, metro or taxi, intercity train, port shuttle, and terminal security. Test that chain in reverse before booking. Check the last practical train rather than the theoretical last train, allow for platform or station changes, and keep an earlier fallback that still protects all-aboard." },
    { title: "Check local operating details", text: "Opening days, strikes, seasonal timetables, ticket rules, and terminal procedures can change after a guide is published. Recheck official attraction and transport information close to sailing. Download tickets and addresses, use the local place name where useful, and avoid depending on a mobile connection for the only copy of the route." },
  ],
  Asia: [
    { title: "Save the terminal in the local language", text: "A gateway port can have several cruise terminals far apart, and a taxi driver may recognize the local terminal name more reliably than an English itinerary label. Save the address, map pin, ship name, and a screenshot of the terminal before leaving Wi-Fi. Do the same for any private pickup point outside a controlled port area." },
    { title: "Compare city ambition with transfer reality", text: "Yokohama versus Tokyo, Laem Chabang versus Bangkok, and Phu My versus Ho Chi Minh City are not simple neighborhood choices. Long gateway transfers can dominate the day. Compare the headline city with a closer regional plan and choose the one that still leaves a dependable return after traffic and terminal access are included." },
    { title: "Reduce payment and communication friction", text: "Check whether transit needs a stored-value card, local app, cash, or a specific ticket. Save addresses and essential instructions offline, confirm the stated tour language, and use official taxi or ride-hailing pickup zones. A private transfer is most useful when the driver, vehicle, terminal, waiting policy, and return time are explicit." },
    { title: "Keep the route simple near all-aboard", text: "Efficient transit does not remove the risk of a missed connection, wrong station exit, or port gate delay. Use the final part of the day close to a direct return line, and begin back before the last comfortable option. Recheck holiday schedules, weather disruptions, and same-day terminal notices rather than relying only on a normal timetable." },
  ],
};

export function generateStaticParams() {
  return portRegions.map((region) => ({ region: regionSeo[region].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ region: string }> }): Promise<Metadata> {
  const { region: slug } = await params;
  const region = regionBySlug[slug];
  if (!region) return {};
  const seo = regionSeo[region];
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `${siteUrl}${regionPath(region)}` },
    openGraph: { title: `${seo.title} | PortdayGuide`, description: seo.description, url: `${siteUrl}${regionPath(region)}`, type: "website" },
  };
}

export default async function RegionGuidePage({ params }: { params: Promise<{ region: string }> }) {
  const { region: slug } = await params;
  const region = regionBySlug[slug];
  if (!region) notFound();
  const seo = regionSeo[region];
  const profiles = portsByRegion[region].map((name) => portProfiles[name]);
  const portSlugs = new Set<string>(profiles.map((profile) => profile.slug));
  const decisionGuides = portIntentGuides.filter((guide) => portSlugs.has(guide.sourcePortSlug));
  const planning = regionPlanning[region];
  const pageUrl = `${siteUrl}${regionPath(region)}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Cruise port guides", item: `${siteUrl}/ports` },
      { "@type": "ListItem", position: 3, name: seo.title, item: pageUrl },
    ],
  };
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: profiles.map((profile, index) => ({ "@type": "ListItem", position: index + 1, name: `${profile.name} Cruise Port Guide`, url: `${siteUrl}${portPath(profile.slug)}` })),
    },
  };

  return <main className="region-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">All port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Cruise planner</Link></nav></header>

    <section className="region-hero section">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/ports">Port guides</Link><span>/</span><span aria-current="page">{region}</span></nav>
      <p className="eyebrow"><span /> Regional cruise planning</p>
      <h1>{seo.title}</h1>
      <p>{seo.intro}</p>
      <ul>{seo.planningFocus.map((item) => <li key={item}>{item}</li>)}</ul>
      <div><b>{profiles.length}</b><span> detailed port guides</span></div>
    </section>

    <section className="section region-directory" aria-labelledby="region-guides-heading">
      <div className="section-heading compact"><p className="eyebrow"><span /> Choose a port</p><h2 id="region-guides-heading">{region} port guides</h2><p>Each guide covers the terminal, practical transport choices, a return-aware itinerary, weather fallback, and live shore excursions.</p></div>
      <div className="related-guide-grid region-guide-grid">{profiles.map((profile) => <Link href={portPath(profile.slug)} key={profile.slug} className="related-guide-card"><PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} /><div><span>{profile.country} · {guideReadMinutes(profile)} min read</span><h3>{profile.name} cruise port guide</h3><p>{profile.highlights.slice(0, 3).join(" · ")}</p><small>Updated {guideUpdatedLabel}</small></div></Link>)}</div>
    </section>

    {decisionGuides.length > 0 && <section className="section directory-intent-guides" aria-labelledby="region-decision-guides-title">
      <div className="section-heading compact"><p className="eyebrow"><span /> Answer a specific port-day question</p><h2 id="region-decision-guides-title">{region} terminal, taxi, tender, and beach guides</h2><p>Use these focused guides when the pier, first transfer, or return route changes the day more than the attraction list.</p></div>
      <div className="directory-intent-grid">{decisionGuides.map((guide) => <Link href={intentGuidePath(guide)} key={`${guide.sourcePortSlug}-${guide.topic}`}><span>{guide.eyebrow}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Read decision guide →</b></Link>)}</div>
    </section>}

    <section className="section region-playbook" aria-labelledby="region-playbook-title">
      <div className="section-heading compact"><p className="eyebrow"><span /> Regional planning playbook</p><h2 id="region-playbook-title">What changes across {region} port days.</h2><p>Use these checks before comparing individual attractions. They describe the recurring logistics that make two ports in the same region require very different plans.</p></div>
      <div className="region-playbook-grid">{planning.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      <div className="region-planning-faq"><div className="section-heading compact"><h2>{region} cruise-planning questions</h2></div><div className="faq-list"><details open><summary>What should I confirm before choosing an activity?</summary><p>Start with the exact berth or tender landing in the cruise documents, then identify how the public route or operator pickup begins there. The destination name alone cannot tell you the terminal-exit walk, first transport connection, or where an independent provider is allowed to meet.</p></details><details><summary>How many stops should a regional port plan include?</summary><p>Use one main geographic direction and keep the second stop flexible. A nearby meal, waterfront walk, or market can fill spare time without weakening the return. A distant attraction should usually replace the main anchor rather than become another fixed appointment in the same call.</p></details><details><summary>Is there one return buffer for every port in this region?</summary><p>No. Tendering, terminal layout, transfer distance, traffic, weather, and mobility can all change the margin. Open the individual port guide for its planning assumptions, compare them with current cruise-line and operator instructions, and leave earlier whenever same-day conditions add uncertainty.</p></details></div><p className="region-final-check">Before sailing, reopen the selected port page and compare its terminal, transfer, and return assumptions with the latest cruise documents. Save the berth, all-aboard time, operator contact, booking terms, and a workable return route offline. If the live details disagree with the editorial structure, use the current operational information and simplify the day.</p></div>
    </section>

    <section className="section region-method">
      <div><p className="eyebrow"><span /> How to use these guides</p><h2>Choose the berth first, then the experience.</h2></div>
      <p>Port names often hide multiple terminals, tender landings, or a gateway city far from the ship. PortdayGuide separates the terminal decision from the sightseeing decision and preserves a return margin before suggesting live tours.</p>
      <Link href="/about">Learn about PortdayGuide →</Link>
    </section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and terminal details.</small></footer>
  </main>;
}
