import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortHeroImage } from "@/components/PortHeroImage";
import { PortEditorialPhotos } from "@/components/PortEditorialPhotos";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import { PortTravelerPulse } from "@/components/PortTravelerPulse";
import { TopThingsExcursions } from "@/components/TopThingsExcursions";
import { ViatorDestinationLink } from "@/components/ViatorDestinationLink";
import { alaskaCruisePortsPath, alaskaCruisePortsPost } from "@/lib/alaska-blog";
import { guideReadMinutes, guideTitle, guideUpdatedIso, guideUpdatedLabel, highlightPlanningNote } from "@/lib/editorial";
import { intentGuidePath, intentGuidesForPort } from "@/lib/port-intent-guides";
import { portInsight } from "@/lib/port-insights";
import { portPhotos, portPhotoUrl } from "@/lib/port-photos";
import { canonicalPortSlug, portFaq, portGuideDescription, portGuideTitle, portPath, portQuickAnswer, regionPath, relatedPorts, siteUrl, sourcePortSlug } from "@/lib/seo";
import { portCoordinates, profilesBySlug, type PortRegion, type PortSlug } from "@/lib/shorepath";

const slugs = Object.keys(profilesBySlug) as PortSlug[];

function formatOffset(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h${mins ? ` ${mins}m` : ""}`;
}

function mapEmbedUrl(slug: string) {
  const [lat, lon] = portCoordinates[slug];
  const params = new URLSearchParams({
    bbox: `${lon - .08},${lat - .055},${lon + .08},${lat + .055}`,
    layer: "mapnik",
    marker: `${lat},${lon}`,
  });
  return `https://www.openstreetmap.org/export/embed.html?${params.toString()}`;
}

function terminalNote(slug: string, pier: string) {
  const notes: Record<string, string> = {
    "hong-kong": "Kai Tak and Ocean Terminal are on different sides of Victoria Harbour; their first-mile transport plans are not interchangeable.",
    "yokohama-tokyo": "Osanbashi, Shinko, and Daikoku have different access patterns. Daikoku is not a walk-out city-centre berth.",
    singapore: "Marina Bay Cruise Centre and Singapore Cruise Centre at HarbourFront use different MRT stations and pickup points.",
    phuket: "Deep Sea Port calls and Patong tender calls begin in different parts of the island.",
  };
  return notes[slug] || `Your cruise documents should name the exact berth within “${pier}.” Use that berth—not only the city name—for directions and pickup.`;
}

function marketFit(region: PortRegion) {
  switch (region) {
    case "Asia": return { label: "Asia port-day fit", items: ["Private port pickup", "Guided city tour with a stated language", "Culture and local-food experience"], transportCta: "Compare private port transfers", experienceCta: "Browse guided city & food experiences", transportQuery: "cruise port private transfer", experienceQuery: "guided city food tour" };
    case "Alaska & Pacific Northwest": return { label: "Alaska port-day fit", items: ["Glacier or wildlife route", "Small-group nature tour", "Flightseeing when timing and weather allow"], transportCta: "Compare port pickup tours", experienceCta: "Browse nature & flightseeing experiences", transportQuery: "cruise port pickup shore excursion", experienceQuery: "wildlife glacier flightseeing shore excursion" };
    case "Mediterranean & Atlantic": return { label: "Europe port-day fit", items: ["Port pickup with timed return", "Guided heritage route", "Reserved-entry cultural experience"], transportCta: "Compare private port transfers", experienceCta: "Browse guided & reserved-entry experiences", transportQuery: "cruise port private transfer", experienceQuery: "guided shore excursion skip the line" };
    case "Caribbean & Bahamas":
    case "Mexican Pacific": return { label: "Americas port-day fit", items: ["Snorkel or water experience", "Private driver or island tour", "All-inclusive beach day"], transportCta: "Compare port transfers", experienceCta: "Browse water & beach experiences", transportQuery: "cruise port private transfer", experienceQuery: "snorkeling all inclusive beach shore excursion" };
  }
}

function itinerary(profile: (typeof profilesBySlug)[PortSlug], hours: 6 | 8) {
  const total = hours * 60;
  const returnLead = Math.max(120, profile.buffer + profile.transfer);
  const leaveFinalStop = total - returnLead;
  const backAtTerminal = leaveFinalStop + profile.transfer;
  const shipSideMargin = total - backAtTerminal;
  const mainStart = profile.transfer;
  if (leaveFinalStop - mainStart < 90) return [
    { time: "0:00", title: "Confirm the correct terminal", text: `This short window cannot safely absorb the typical ${profile.transfer}-minute trip in each direction plus the protected return lead.` },
    { time: `0:30–${formatOffset(Math.max(30, backAtTerminal))}`, title: "Terminal-area plan only", text: "Use a flexible nearby meal, waterfront walk, or terminal facility. Do not commit to the distant headline sights." },
    { time: formatOffset(backAtTerminal), title: "Back at the terminal", text: `Be ship-side with ${shipSideMargin} minutes still protected before all-aboard.` },
  ];
  const mainEnd = Math.max(mainStart + 60, leaveFinalStop - (hours === 8 ? 90 : 60));
  return [
    { time: `0:00–${formatOffset(mainStart)}`, title: "Outbound transfer", text: `Leave the confirmed terminal and allow about ${profile.transfer} minutes to the main area.` },
    { time: `${formatOffset(mainStart)}–${formatOffset(mainEnd)}`, title: profile.highlights[0], text: hours === 6 ? "Keep this as the one main experience." : `Add ${profile.highlights[1]} only when it is genuinely nearby and transport is running comfortably.` },
    { time: `${formatOffset(mainEnd)}–${formatOffset(leaveFinalStop)}`, title: "Flexible final stop on the return route", text: "Use a short food or waterfront stop only when it does not require a detour." },
    { time: `${formatOffset(leaveFinalStop)}–${formatOffset(backAtTerminal)}`, title: "Return transfer", text: `Leave the final stop by this time and allow about ${profile.transfer} minutes back.` },
    { time: formatOffset(backAtTerminal), title: "Back at the terminal", text: `Arrive ship-side with ${shipSideMargin} minutes still protected before all-aboard.` },
  ];
}

function localHacks(region: string) {
  if (region === "Asia") return ["Save the terminal name and address in the local language before leaving Wi-Fi.", "Use a bank ATM or card in local currency; decline dynamic currency conversion.", "For taxis or ride-hailing, match the plate and use the terminal’s official pickup zone."];
  return ["Confirm the fare or app estimate before leaving the official taxi or pickup area.", "Use a bank ATM or card in local currency; decline dynamic currency conversion.", "Download confirmations and the terminal name before relying on port or venue Wi-Fi."];
}

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug: canonicalPortSlug(slug) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const profile = profilesBySlug[sourcePortSlug(slug) as PortSlug];
  if (!profile) return {};
  const isCozumel = profile.slug === "cozumel";
  return {
    title: isCozumel ? { absolute: portGuideTitle(profile) } : portGuideTitle(profile),
    description: portGuideDescription(profile),
    alternates: { canonical: `${siteUrl}${portPath(profile.slug)}` },
    openGraph: {
      title: `${portGuideTitle(profile)} | PortdayGuide`,
      description: portGuideDescription(profile),
      url: `${siteUrl}${portPath(profile.slug)}`,
      type: "article",
      images: [{ url: portPhotoUrl(profile.slug), alt: portPhotos[profile.slug].alt }],
    },
    twitter: { card: "summary_large_image", title: portGuideTitle(profile), description: portGuideDescription(profile), images: [portPhotoUrl(profile.slug)] },
  };
}

export default async function PortGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = profilesBySlug[sourcePortSlug(slug) as PortSlug];
  if (!profile) notFound();
  const fit = marketFit(profile.region);
  const isCozumel = profile.slug === "cozumel";
  const insight = portInsight(profile);
  const faq = portFaq(profile);
  const related = relatedPorts(profile);
  const intentGuides = intentGuidesForPort(profile.slug);
  const regionUrl = `${siteUrl}${regionPath(profile.region)}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Cruise port guides", item: `${siteUrl}/ports` },
      { "@type": "ListItem", position: 3, name: `${profile.region} cruise ports`, item: regionUrl },
      { "@type": "ListItem", position: 4, name: `${profile.name} cruise port guide`, item: `${siteUrl}${portPath(profile.slug)}` },
    ],
  };
  const guideUrl = `${siteUrl}${portPath(profile.slug)}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: isCozumel ? "Cozumel Cruise Port Guide: Terminals, Transport, Map & Top Excursions" : guideTitle(profile),
    description: portGuideDescription(profile),
    datePublished: guideUpdatedIso,
    dateModified: guideUpdatedIso,
    mainEntityOfPage: guideUrl,
    image: portPhotoUrl(profile.slug),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    articleSection: `${profile.region} cruise port guides`,
    about: [{ "@type": "Place", name: profile.name }, { "@type": "Thing", name: "Cruise shore excursions" }],
    author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/about` },
    publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/` },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  };

  return <main className="port-guide-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">All port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Cruise planner</Link></nav></header>

    <section className="port-guide-hero"><PortHeroImage slug={profile.slug} name={profile.name} /><div className="port-guide-hero-copy"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/ports">Port guides</Link><span>/</span><Link href={regionPath(profile.region)}>{profile.region}</Link><span>/</span><span aria-current="page">{profile.name}</span></nav><p className="eyebrow"><span /> {profile.country} cruise-port guide</p><h1>{isCozumel ? "Cozumel Cruise Port Guide: Terminals, Transport, Map & Top Excursions" : `${profile.name} Cruise Port Guide`}</h1><h2>{profile.headline}</h2><p>{profile.intro}</p><div className="guide-facts"><span>{isCozumel ? <><b>120 min</b> return-to-ship buffer</> : <><b>{profile.buffer} min</b> minimum ship-side margin</>}</span><span><b>{profile.cost["$$"]}</b> typical day</span><span><b>{profile.pier}</b> possible berth</span></div></div></section>

    <div className="guide-meta-bar"><span>Updated {guideUpdatedLabel}</span><span>{guideReadMinutes(profile)} min read</span><span>By <Link href="/about">PortdayGuide</Link></span></div>
    <nav className="guide-contents" aria-label="Guide sections"><a href="#overview">Overview</a>{isCozumel && <a href="#terminals">Cruise terminals</a>}<a href="#transport">Transport</a><a href="#top-things">Things to do & excursions</a><a href="#itineraries">6 & 8 hour plans</a><a href="#local-tips">Local tips</a><a href="#faq">FAQ</a></nav>

    <section className="section port-overview" id="overview">
      <div className="overview-copy"><p className="eyebrow"><span /> Port overview</p><h2>{profile.name} cruise port overview</h2>
        <p className="quick-answer"><strong>Quick answer:</strong> {isCozumel ? "Cozumel is a relatively compact cruise stop with three different cruise terminals. Pick one main anchor—reef or snorkel, a beach club, nature, or heritage—and keep the final stop on the same side of the island as your terminal so the return stays simple." : portQuickAnswer(profile)}</p>
        <p>Your usable day starts when the ship clears and ends at official all-aboard. Begin with the berth: documents may list <strong>{profile.pier}</strong>, and each location can have different walking routes, tender steps, and pickup zones. Use the cruise line&apos;s exact terminal—not a generic city pin.</p>
        <p>{isCozumel ? <>The biggest planning mistake at the <strong>Cozumel cruise port</strong> is building an itinerary before confirming the exact pier. Treat Chankanaab, San Miguel, Punta Sur, and San Gervasio as alternatives rather than a checklist. Allow about 25 minutes for a typical transfer and begin the return at least 120 minutes before official all-aboard.</> : <>The main choices are {profile.highlights.slice(0, 3).join(", ")}, and {profile.highlights[3]}. Treat them as alternatives. A reliable day pairs one anchor with one flexible stop, allows about {profile.transfer} minutes for a typical transfer, and preserves at least {profile.buffer} minutes ship-side.</>}</p>
        <p>{profile.transport} Recheck current opening hours, road or transit conditions, tender procedures, and operator instructions close to sailing.</p>
      </div>
      <aside className="overview-facts" aria-label={`${profile.name} quick facts`}><h3>{profile.name} at a glance</h3><dl><div><dt>Country</dt><dd>{profile.country}</dd></div><div><dt>Terminal to confirm</dt><dd>{profile.pier}</dd></div><div><dt>Planning transfer</dt><dd>About {profile.transfer} minutes each way</dd></div><div><dt>Ship-side margin</dt><dd>At least {profile.buffer} minutes</dd></div><div><dt>Typical mid-range day</dt><dd>{profile.cost["$$"]}</dd></div></dl></aside>
      <figure className="port-map"><iframe title={`${profile.name} cruise port area map`} src={mapEmbedUrl(profile.slug)} loading="lazy" /><figcaption>Orientation map only. Confirm the berth in your cruise documents. Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>.</figcaption></figure>
    </section>

    {isCozumel && <section className="section cozumel-terminal-guide" id="terminals">
      <div className="section-heading compact"><p className="eyebrow"><span /> Confirm the pier first</p><h2>Which Cozumel cruise terminal are you at?</h2><p>The phrase “Cozumel cruise port” can mean three separate docking areas. Check the cruise line app or documents for the terminal name, then use that exact pier for directions, taxi fares, and excursion pickup.</p></div>
      <div className="cozumel-terminal-grid">
        <article><span>Downtown terminal</span><h3>Punta Langosta Cruise Terminal</h3><p>Best for a short walk to downtown San Miguel, shopping, or lunch.</p></article>
        <article><span>Southern cruise corridor</span><h3>International Pier</h3><p>South of downtown. Most plans need a taxi or a specific excursion meeting point.</p></article>
        <article><span>Southern cruise corridor</span><h3>Puerta Maya</h3><p>South of downtown with its own taxi area. It is near International Pier but has a separate pickup location.</p></article>
      </div>
      <p className="cozumel-decision-links">Need more detail? <Link href="/ports/cozumel/which-cruise-terminal">Compare all three Cozumel cruise terminals</Link> and <Link href="/ports/cozumel/taxi-rates">check how Cozumel taxi pricing works from each pier</Link>.</p>
    </section>}

    {intentGuides.length > 0 && <section className="section port-topic-cluster" aria-labelledby="port-topic-cluster-title"><div className="section-heading compact"><p className="eyebrow"><span /> Plan the decision, not only the destination</p><h2 id="port-topic-cluster-title">Detailed {profile.name} cruise-day guides</h2><p>Use these focused guides for the terminal, transport, beach, and return decisions most likely to change this port day.</p></div><div>{intentGuides.map((guide) => guide.template === "yokohama-terminal-editorial"
      ? <Link href={intentGuidePath(guide)} key={guide.topic} className="port-topic-card-featured"><PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} /><div><span>{guide.eyebrow}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Read the Yokohama guide →</b></div></Link>
      : <Link href={intentGuidePath(guide)} key={guide.topic}><span>{guide.eyebrow}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Read the decision guide →</b></Link>)}</div></section>}

    <section className="section port-reality" id="transport">
      <div className="section-heading compact"><p className="eyebrow"><span /> Transport & traveler perspective</p><h2>How to get around {profile.name} cruise port</h2><p>{isCozumel ? "Most visitors walk from Punta Langosta, use an authorized taxi or private transfer, or prebook a shore excursion. Choose based on your exact terminal and the return plan—not only the advertised attraction." : "Terminal facts, traveler feedback, and transport choices—distilled into the decisions that change the day."}</p></div>

      {isCozumel && <div className="cozumel-transport-primer">
        <article><span>Lowest friction</span><h3>Walk or port shuttle</h3><p>Best for San Miguel when docked at Punta Langosta.</p></article>
        <article><span>Most common</span><h3>Taxi or private transfer</h3><p>Best for Chankanaab and beach clubs. Confirm the per-vehicle fare, terminal name, and return point.</p></article>
        <article><span>Highest commitment</span><h3>Prebooked shore excursion</h3><p>Confirm the terminal meeting point, total duration, cancellation terms, and return arrangement.</p></article>
      </div>}

      <div className="reality-layout">
        <article className="reality-verdict"><span>PortdayGuide verdict</span><h3>{insight.mode}</h3><p>{insight.summary}</p><PortTravelerPulse portSlug={profile.slug} portName={profile.name} /></article>
        <aside className="reality-decisions" aria-label={`${profile.name} planning takeaways`}>
          <div><span>Best fit</span><p>{insight.bestFor}</p></div>
          <div><span>Main friction</span><p>{insight.friction}</p></div>
          <div><span>Weather fallback</span><p>{insight.fallback}</p></div>
        </aside>
      </div>

      <div className="terminal-callout"><div><span>Terminal to confirm</span><h3>{profile.pier}</h3><p>{terminalNote(profile.slug, profile.pier)}</p></div><strong>Confirm the berth before booking any pickup.</strong></div>

      <div className="transport-choices"><div className="subsection-heading"><span>Choose by what you want to do</span><h3>Three realistic ways to move through {profile.name}.</h3></div><div className="transport-choice-grid">{insight.transportChoices.map((choice) => <article key={choice.label}><div><span className="transport-icon" aria-hidden="true">{choice.icon}</span><small>{choice.risk}</small></div><h4>{choice.label}</h4><b>Best for: {choice.bestFor}</b><p>{choice.reality}</p></article>)}</div></div>

      <div className="traveler-takeaways"><div><span>Traveler takeaways</span><h3>{insight.sources.length > 0 ? "What traveler feedback and port logistics keep pointing to." : "What the port layout and current review signals point to."}</h3><p>{insight.sources.length > 0 ? "Paraphrased themes—not quotations or a promise that every visit will feel the same." : "A planning synthesis based on terminal, transfer, and route data; live tour review totals appear above when available."}</p></div><ul>{insight.travelerThemes.map((theme) => <li key={theme}>{theme}</li>)}</ul>{insight.sources.length > 0 && <div className="traveler-sources"><span>Sources checked July 2026:</span>{insight.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>)}</div>}</div>

      <div className="return-strip"><div><span>Protect the return</span><p>Start back at least <b>{Math.max(120, profile.buffer + profile.transfer)} minutes before official all-aboard</b>: about {profile.transfer} minutes for travel plus at least {profile.buffer} minutes ship-side.</p></div><div><span>Access check</span><p>{profile.mobility}</p></div></div>

      <div className="native-placement"><div><span>{fit.label}</span><p>{fit.items.join(" · ")}</p></div><ViatorDestinationLink portSlug={profile.slug} portName={profile.name} className="native-link" /></div>
    </section>

    <section className="section top-things" id="top-things"><div className="section-heading"><p className="eyebrow"><span /> Editorial picks + live options</p><h2>Top Things to Do & Shore Excursions in {profile.name}</h2><p>{isCozumel ? "Treat Chankanaab, San Miguel, Punta Sur, and San Gervasio as alternatives rather than a checklist. Chankanaab is the strongest first-time anchor; San Miguel is a flexible add-on; Punta Sur is route-dependent; and San Gervasio is the heritage alternative." : "Choose one main direction, then compare the independent plan with a relevant current excursion. Exact place matches are labeled as recommended excursions; broader alternatives are labeled as similar experiences. When there is no credible match, the independent plan stands on its own."}</p></div><PortEditorialPhotos slug={profile.slug} /><p className="affiliate-notice combined-disclosure"><b>Affiliate disclosure:</b> PortdayGuide may earn a commission when you book through these links, at no extra cost to you. Viator supplies the live product details and completes the booking; PortdayGuide does not operate the tour.</p><TopThingsExcursions portSlug={profile.slug} portName={profile.name} items={profile.highlights.map((highlight, index) => ({ name: highlight, note: highlightPlanningNote(profile, index), priority: index === 0 ? "Best main anchor" : index === 1 ? "Flexible second choice" : index === 2 ? "Route-dependent option" : "Alternative plan" }))} /></section>

    <section className="section time-plans" id="itineraries"><div className="section-heading"><p className="eyebrow"><span /> Time-stitched itineraries</p><h2>{isCozumel ? "Cozumel port-day itineraries: 6 hours vs. 8 hours" : `${profile.name} itinerary for a 6- or 8-hour port call`}</h2><p>A 6- or 8-hour window starts when you can leave the terminal and ends at official all-aboard—not ship departure. Each version separately reserves the typical return transfer and the ship-side margin. These are planning structures, not promises about live traffic, attraction opening, or the time your ship will clear.</p></div><div className="time-plan-grid">{([6, 8] as const).map((hours) => <article key={hours}><div><span>{hours}-HOUR PORT DAY</span><b>{profile.transfer} min return · {Math.max(profile.buffer, 120 - profile.transfer)} min ship-side</b></div><ol>{itinerary(profile, hours).map((step) => <li key={`${hours}-${step.time}`}><time>{step.time}</time><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></article>)}</div><p className="return-warning"><strong>Return rule: begin the return journey at least two hours before official all-aboard, or earlier when this port’s transfer and ship-side margin require it. Add more time for tenders, traffic, weather, mobility needs, or distant pickups.</strong></p></section>

    <section className="section local-hacks" id="local-tips"><div className="section-heading compact"><p className="eyebrow"><span /> Practical tips</p><h2>{profile.name} cruise port tips before you go</h2><p>Small preparation steps matter more on a port call because there is no spare evening to recover from a wrong terminal, failed connection, poor exchange rate, or missed pickup.</p></div><div className="hack-grid">{(isCozumel ? ["Confirm Punta Langosta, International Pier, or Puerta Maya before booking transport or an excursion.", "Use a bank ATM or pay by card in local currency; decline dynamic currency conversion.", "Download tickets, confirmations, pickup details, and the terminal name before relying on port Wi-Fi.", "Confirm the fare before departure and photograph the posted taxi board when one is available."] : localHacks(profile.region)).map((hack, index) => <article key={hack}><span>{String(index + 1).padStart(2, "0")}</span><p>{hack}</p></article>)}</div></section>

    {profile.region === "Alaska & Pacific Northwest" && <section className="section region-pillar-promo" aria-labelledby="alaska-pillar-title">
      <div className="section-heading compact"><p className="eyebrow"><span /> Alaska cruise overview</p><h2 id="alaska-pillar-title">Compare this stop with the top Alaska cruise ports.</h2><p>See the main routes, departure cities, and port-by-port highlights before choosing how this day fits the wider itinerary.</p></div>
      <Link href={alaskaCruisePortsPath} data-alaska-pillar-backlink="true">
        <PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} />
        <div><span>{alaskaCruisePortsPost.category} · {alaskaCruisePortsPost.readTime}</span><h3>{alaskaCruisePortsPost.title}</h3><p>{alaskaCruisePortsPost.excerpt}</p><b>Read the Alaska pillar guide →</b></div>
      </Link>
    </section>}

    <section className="section related-guides" aria-labelledby="related-guides-title"><div className="section-heading compact"><p className="eyebrow"><span /> Continue planning</p><h2 id="related-guides-title">Related {profile.region} cruise port guides</h2><p>Compare ports with similar transfer patterns, regions, or shore-day choices.</p></div><div className="related-guide-grid">{related.map((candidate) => <Link href={portPath(candidate.slug)} key={candidate.slug} className="related-guide-card"><PortScenicPhoto slug={candidate.slug} name={candidate.name} country={candidate.country} /><div><span>{candidate.country}</span><h3>{candidate.name} cruise port guide</h3><p>{candidate.highlights.slice(0, 2).join(" · ")}</p></div></Link>)}</div><p className="region-hub-link"><Link href={regionPath(profile.region)}>Browse all {profile.region} cruise ports →</Link></p></section>

    <section className="section guide-faq" id="faq"><div className="section-heading compact"><p className="eyebrow"><span /> Common questions</p><h2>{profile.name} cruise port FAQ</h2></div><div className="faq-list">{faq.map((item, index) => <details open={index === 0} key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div><aside className="editorial-method"><strong>Plan with current sailing details</strong><p>Terminal assignments, local transport, weather, opening hours, and excursion availability can change. Confirm your ship&apos;s current instructions and every booking detail before travel. <Link href="/about">About PortdayGuide.</Link></p></aside></section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
