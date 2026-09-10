import type { Metadata } from "next";
import Link from "next/link";
import { CruisePlanner } from "@/components/CruisePlanner";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Cruise Port Day Planner",
  description: "Build a multi-port cruise itinerary with ship times, realistic return buffers, mobility preferences, weather checks, and shore excursion ideas.",
  alternates: { canonical: `${siteUrl}/planner` },
};

export default function PlannerPage() {
  const pageUrl = `${siteUrl}/planner`;
  const applicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "PortdayGuide Cruise Port Day Planner",
    description: "Build a multi-port cruise itinerary with ship times, realistic return buffers, mobility preferences, weather checks, and shore excursion ideas.",
    url: pageUrl,
    applicationCategory: "TravelApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern web browser",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Multi-port cruise itinerary planning",
      "Return-to-ship time buffers",
      "Mobility and pace preferences",
      "Weather-aware port-day guidance",
      "Shore excursion ideas",
    ],
    provider: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PortdayGuide",
      url: `${siteUrl}/`,
    },
    inLanguage: "en-US",
  };

  return <main className="planner-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }} />
    <header className="simple-header planner-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner" aria-current="page">Free planner</Link></nav><Link className="header-cta" href="/ports">Find a port</Link></header>
    <section className="planner-page-intro"><p className="eyebrow"><span /> Free cruise planner</p><h1>Plan every port day.</h1><p>Add your ship times and preferences. PortdayGuide protects the return trip before suggesting what fits.</p></section>
    <CruisePlanner />
    <section className="section planner-explainer" aria-labelledby="planner-explainer-title">
      <div className="section-heading compact"><p className="eyebrow"><span /> How the planner works</p><h2 id="planner-explainer-title">The schedule begins with all-aboard.</h2><p>The planner is intentionally conservative. It separates the trip back from the ship-side margin, then uses the remaining time for activities.</p></div>
      <div className="planner-explainer-grid">
        <article><h3>Arrival is not always the usable start</h3><p>A scheduled arrival does not mean every passenger can immediately leave the terminal. Tender boarding, ship clearance, gangways, port shuttles, and walking through a cruise complex can delay the independent start. Use your best realistic estimate and leave room to simplify the plan when the ship clears late.</p></article>
        <article><h3>All-aboard is the hard deadline</h3><p>Enter the cruise line’s local all-aboard time, not departure time. PortdayGuide first reserves the typical return transfer and a separate ship-side margin. Traffic, weather, tenders, mobility needs, or a distant pickup can justify leaving earlier than the generated structure suggests.</p></article>
        <article><h3>Preferences change the route, not the clock</h3><p>Pace, walking tolerance, party type, interest, and budget help choose between nearby activities. They do not shorten the trip back. If the usable window cannot hold the selected port’s transfer assumptions, the planner asks for more time rather than hiding the conflict.</p></article>
        <article><h3>Saved and shared plans stay under your control</h3><p>Plans saved with the Save button remain in this browser on this device. A shared link contains the preferences needed to reconstruct the plan, so treat it like any itinerary link and send it only to people who should see those details. Recheck every ship time and booking before using the plan ashore.</p></article>
      </div>
      <div className="planner-explainer-links"><Link href="/ports">Check your port guide first →</Link><Link href="/about">About PortdayGuide →</Link></div>
    </section>
    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
