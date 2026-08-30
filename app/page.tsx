import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FeaturedViatorDeals } from "@/components/FeaturedViatorDeals";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import { alaskaCruisePortsPath, alaskaCruisePortsPost } from "@/lib/alaska-blog";
import { guideReadMinutes, guideTitle, guideUpdatedLabel } from "@/lib/editorial";
import { portPath, siteUrl } from "@/lib/seo";
import { portProfiles } from "@/lib/shorepath";

export const metadata: Metadata = {
  title: "Cruise Port Guides & Shore Excursions | PortdayGuide",
  description: "Plan a safer cruise port day with terminal details, realistic return-time guidance, and live shore excursions for popular ports worldwide.",
  alternates: { canonical: siteUrl },
};

const latestPorts = ["Cozumel", "Juneau", "Barcelona", "Yokohama (Tokyo)", "Singapore", "Nassau"] as const;

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function Home() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PortdayGuide",
    alternateName: "Port Day Guide",
    url: `${siteUrl}/`,
    publisher: { "@id": `${siteUrl}/#organization` },
  };
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "PortdayGuide",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/icon-512.png`,
    description: "Independent cruise-port planning guides with terminal-first return timing and live excursion comparisons.",
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
    <header className="site-header home-header">
      <Link className="brand" href="/" aria-label="PortdayGuide home">PortdayGuide<span>.</span></Link>
      <nav aria-label="Main navigation"><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav>
    </header>

    <section className="commercial-hero" id="top">
      <div className="commercial-hero-copy">
        <p className="eyebrow"><span /> Cruise port planning</p>
        <h1>Cruise port guides & shore excursions.</h1>
        <p className="hero-lede">Terminal details, return-time guidance, and live Viator tours for your day ashore.</p>
        <form className="hero-port-search" action="/ports" method="get">
          <label htmlFor="home-port-search">Search your cruise port</label>
          <input id="home-port-search" name="q" placeholder="Try Cozumel, Barcelona, Singapore…" />
          <button type="submit">Search ports <ArrowIcon /></button>
        </form>
        <div className="hero-popular"><span>Popular:</span><Link href="/ports/cozumel">Cozumel</Link><Link href="/ports/nassau">Nassau</Link><Link href="/ports/barcelona">Barcelona</Link><Link href="/ports/singapore">Singapore</Link></div>
      </div>
    </section>

    <section className="section latest-guides" id="latest">
      <div className="section-heading discovery-heading"><p className="eyebrow"><span /> Recently updated</p><h2>Latest cruise port guides.</h2><p>Terminal-first guides with realistic return timing and live excursion options.</p></div>
      <div className="latest-guide-grid">{latestPorts.map((name) => {
        const profile = portProfiles[name];
        return <Link className="latest-guide-card" href={portPath(profile.slug)} key={name}>
          <PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} priority={name === "Cozumel"} />
          <div>
            <p><span>{profile.region}</span><span>{guideReadMinutes(profile)} min read</span></p>
            <h3>{guideTitle(profile)}</h3>
            <small>Updated {guideUpdatedLabel}</small>
          </div>
        </Link>;
      })}</div>
      <div className="directory-link"><Link href="/ports">Browse all cruise port guides <ArrowIcon /></Link></div>
    </section>

    <section className="section home-blog-feature" aria-labelledby="home-blog-title">
      <div className="section-heading discovery-heading"><p className="eyebrow"><span /> From the blog</p><h2 id="home-blog-title">Compare the top Alaska cruise ports.</h2><p>Understand the main routes and departure cities, then explore the highlights at Alaska&apos;s most popular ports of call.</p></div>
      <article className="blog-feature-card">
        <Link className="blog-feature-image" href={alaskaCruisePortsPath} aria-label={`Read ${alaskaCruisePortsPost.title}`}><Image src={alaskaCruisePortsPost.image} alt={alaskaCruisePortsPost.imageAlt} width={alaskaCruisePortsPost.imageWidth} height={alaskaCruisePortsPost.imageHeight} sizes="(max-width: 800px) 100vw, 55vw" unoptimized /></Link>
        <div><p className="blog-card-meta"><span>{alaskaCruisePortsPost.category}</span><span>{alaskaCruisePortsPost.publishedLabel}</span><span>{alaskaCruisePortsPost.readTime}</span></p><h2><Link href={alaskaCruisePortsPath}>{alaskaCruisePortsPost.title}</Link></h2><p>{alaskaCruisePortsPost.excerpt}</p><Link className="blog-read-link" href={alaskaCruisePortsPath}>Read the article <ArrowIcon /></Link></div>
      </article>
      <div className="directory-link"><Link href="/blog">Visit the PortdayGuide blog <ArrowIcon /></Link></div>
    </section>

    <section className="section home-planning-guide" aria-labelledby="home-planning-title">
      <div className="section-heading discovery-heading"><p className="eyebrow"><span /> A safer planning order</p><h2 id="home-planning-title">Build the port day from the ship backward.</h2><p>A good cruise day is not the longest list of attractions. It is a route that starts at the correct terminal, fits the usable hours ashore, and still has a comfortable way back.</p></div>
      <div className="home-planning-grid">
        <article><span>01</span><h3>Confirm the berth, not only the city</h3><p>A port name can cover several terminals, a tender landing, or a gateway port far from the famous destination. Read the cruise document for the exact berth before comparing taxis, trains, pickups, or walking routes. If a tour voucher and the ship itinerary use different terminal names, ask the operator to confirm the meeting point using the ship name and sailing date.</p></article>
        <article><span>02</span><h3>Price the complete round trip</h3><p>Admission is only one part of a shore day. Include the terminal exit, outbound transfer, waiting time, local transport, the return transfer, and any walk through port security. A place that looks close on a map may still be a poor fit when tenders, traffic, mobility needs, or a fixed pickup add friction. Keep one main experience and make the final stop easy to drop.</p></article>
        <article><span>03</span><h3>Protect the return before booking</h3><p>Work from official all-aboard time rather than ship departure. Reserve the realistic trip back and a ship-side margin first; the remaining block is the time available for activities. Then compare an independent plan with a current excursion. A tour title alone is not enough—check the exact terminal, meeting point, duration, cancellation terms, accessibility, and return arrangement on the booking page.</p></article>
      </div>
      <div className="home-planning-faq"><div className="section-heading compact"><h2>First-time cruise port questions.</h2></div><div className="faq-list"><details open><summary>Should I use arrival time or all-aboard time to plan?</summary><p>Use both, but treat them differently. Arrival is the scheduled beginning and may be followed by clearance, tender, or terminal-exit time. All-aboard is the hard end of the usable window. Reserve the complete return journey and a ship-side margin before filling the hours between them.</p></details><details><summary>Is a shore excursion automatically safer than going independently?</summary><p>No booking label removes the need to verify details. A relevant excursion may simplify transport or pickup, but the product page still needs to name the meeting point, duration, accessibility, cancellation terms, and return arrangement. For an independent plan, confirm transport both ways and leave extra options in the schedule.</p></details><details><summary>How many attractions fit in one port day?</summary><p>Usually fewer than a city-break itinerary suggests. One main experience plus one nearby, flexible stop is easier to protect than several fixed commitments. Gateway transfers, tenders, traffic, heat, mobility, and port security all use time that does not appear in an attraction list.</p></details></div></div>
    </section>

    <section className="home-viator-deals" id="deals">
      <div className="section home-viator-deals-inner">
        <div className="section-heading discovery-heading"><p className="eyebrow"><span /> Live Viator picks</p><h2>4 best-value cruise excursions right now.</h2><p>Current options ranked by price, traveler rating, review volume, and free cancellation. Final availability and date-specific prices can change.</p></div>
        <FeaturedViatorDeals />
        <p className="affiliate-inline">PortdayGuide may earn a commission if you book, at no extra cost to you. <Link href="/disclosure">Affiliate disclosure</Link></p>
      </div>
    </section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
