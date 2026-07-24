import type { Metadata } from "next";
import Link from "next/link";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About PortdayGuide",
  description: "Learn how PortdayGuide helps cruise travelers compare ports, terminals, transport, shore excursions, and return-aware plans for a better day ashore.",
  alternates: { canonical: `${siteUrl}/about` },
};

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About PortdayGuide",
    description: "PortdayGuide helps cruise travelers plan better days ashore with practical port guides, shore excursion comparisons, and a free cruise port day planner.",
    url: `${siteUrl}/about`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PortdayGuide",
      url: `${siteUrl}/`,
      description: "Cruise port guides, shore excursion comparisons, and return-aware port day planning.",
      knowsAbout: ["Cruise ports", "Shore excursions", "Cruise terminals", "Port transportation", "Cruise itinerary planning"],
    },
  };
  return <main className="legal-page editorial-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>
    <article className="section legal-article">
      <p className="eyebrow"><span /> About PortdayGuide</p>
      <h1>Plan a better day at every cruise port.</h1>
      <p className="legal-lede">PortdayGuide is a cruise travel planning website built to make days ashore easier to understand. It brings cruise terminal details, transportation options, shore excursion ideas, realistic itineraries, and return-time guidance into one practical place.</p>

      <h2>Why PortdayGuide exists</h2>
      <p>A cruise itinerary may list a famous city, but the ship can dock at a distant gateway port, use more than one terminal, or require a tender to reach shore. That difference can change the entire day. PortdayGuide helps travelers begin with the correct port and terminal, understand the journey from ship to destination, and choose activities that fit the time actually available.</p>
      <p>The goal is simple: help you spend less time piecing together port logistics and more time enjoying the destination—without losing sight of the trip back to the ship.</p>

      <h2>What you will find on PortdayGuide</h2>
      <ul>
        <li><strong>Cruise port guides</strong> covering terminals, tender situations, local transportation, popular attractions, practical tips, and realistic 6- or 8-hour port-day ideas.</li>
        <li><strong>Shore excursion comparisons</strong> that place independent activities beside relevant live tour options, so you can compare convenience, duration, price, and cancellation terms.</li>
        <li><strong>Return-aware planning</strong> that starts with official all-aboard time, reserves the trip back and a ship-side margin, then shows what can fit in the remaining hours.</li>
        <li><strong>Regional cruise guides</strong> for the Caribbean, Alaska, Europe, the Mediterranean, Mexico, Asia, and other popular cruise destinations.</li>
        <li><strong>A free cruise port day planner</strong> for organizing multiple stops around your ship times, pace, mobility preferences, interests, and budget.</li>
      </ul>

      <h2>How to plan your cruise port day</h2>
      <p>Start in the <Link href="/ports">cruise port guide directory</Link> and search for the destination shown on your itinerary. Confirm the exact berth, terminal, or tender landing in your cruise documents, because two ships visiting the same city may begin their days in different places.</p>
      <p>Next, compare the main attractions with the complete round trip. Include the terminal exit, transfer time, pickup location, local transportation, and the walk back through port security. A simple plan with one main experience and one flexible nearby stop is often more enjoyable than an itinerary crowded with fixed commitments.</p>
      <p>Finally, use the <Link href="/planner">free cruise port day planner</Link> with the cruise line&apos;s local arrival and all-aboard times. Protect the return journey first, then use the remaining window for sightseeing, beaches, food, culture, or a shore excursion.</p>

      <h2>Explore popular cruise destinations</h2>
      <p>PortdayGuide covers major cruise stops and gateway ports around the world. You can plan a beach day in <Link href="/ports/cozumel">Cozumel</Link>, compare tender timing in <Link href="/ports/grand-cayman">Grand Cayman</Link>, organize an Alaska excursion from <Link href="/ports/juneau">Juneau</Link>, navigate a Mediterranean city day from <Link href="/ports/barcelona">Barcelona</Link>, or decide how far to travel from Asian ports such as <Link href="/ports/yokohama-tokyo">Yokohama</Link> and <Link href="/ports/singapore">Singapore</Link>.</p>
      <p>For broader cruise travel ideas and destination trends, visit the <Link href="/blog">PortdayGuide blog</Link>.</p>

      <h2>Independent planning with bookable options</h2>
      <p>PortdayGuide is not a cruise line or tour operator. The site can show live Viator shore excursions alongside independent planning ideas so travelers can compare both approaches. PortdayGuide may earn a commission when a traveler books through an eligible affiliate link, at no extra cost to the traveler. Read the full <Link href="/disclosure">affiliate disclosure</Link> for details.</p>

      <h2>Always confirm the details for your sailing</h2>
      <p>Port operations, berth assignments, tender procedures, opening hours, prices, weather, traffic, and tour availability can change. Before leaving the ship or booking an excursion, confirm the current terminal, meeting point, duration, accessibility, cancellation terms, and return arrangement with the cruise line and provider.</p>
      <p>PortdayGuide is designed to help you make a clearer plan, but your cruise line&apos;s instructions and same-day local information always control.</p>

      <div className="planner-explainer-links"><Link href="/ports">Browse cruise port guides →</Link><Link href="/planner">Build a free port-day plan →</Link></div>
    </article>
    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide.</small></footer>
  </main>;
}
