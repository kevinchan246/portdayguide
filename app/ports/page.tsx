import type { Metadata } from "next";
import Link from "next/link";
import { PortDirectory } from "@/components/PortDirectory";
import { intentGuidePath, portIntentGuides } from "@/lib/port-intent-guides";
import { portPath, siteUrl } from "@/lib/seo";
import { portNames, portProfiles } from "@/lib/shorepath";

export const metadata: Metadata = {
  title: `${portNames.length} Cruise Port Guides`,
  description: "Browse return-aware cruise-port guides across the Caribbean, Alaska, Mexico, Europe, and Asia.",
  alternates: { canonical: `${siteUrl}/ports` },
};

export default async function PortsDirectoryPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const pageUrl = `${siteUrl}/ports`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${portNames.length} Cruise Port Guides`,
    description: "Browse return-aware cruise-port guides across the Caribbean, Alaska, Mexico, Europe, and Asia.",
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: portNames.length,
      itemListElement: portNames.map((name, index) => {
        const profile = portProfiles[name];
        return {
          "@type": "ListItem",
          position: index + 1,
          name: `${profile.name} Cruise Port Guide`,
          url: `${siteUrl}${portPath(profile.slug)}`,
        };
      }),
    },
  };

  return <main className="ports-directory-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Cruise planner</Link></nav></header>

    <section className="ports-directory-hero">
      <p className="eyebrow"><span /> Cruise-port guides & excursions</p>
      <h1>Find the right shore day in {portNames.length} ports.</h1>
      <p>Search by port, country, pier, or attraction.</p>
    </section>

    <PortDirectory initialQuery={q.slice(0, 100)} />

    <section className="section directory-intent-guides" aria-labelledby="decision-guides-title">
      <div className="section-heading compact"><p className="eyebrow"><span /> Detailed planning decisions</p><h2 id="decision-guides-title">Terminal, taxi, tender, and beach guides.</h2><p>These focused guides answer the choices that can change an otherwise simple port day. Each page links back to the complete port hub and uses the same return-aware planning method.</p></div>
      <div className="directory-intent-grid">{portIntentGuides.map((guide) => <Link href={intentGuidePath(guide)} key={`${guide.sourcePortSlug}-${guide.topic}`}><span>{guide.eyebrow}</span><h3>{guide.title}</h3><p>{guide.description}</p><b>Read decision guide →</b></Link>)}</div>
    </section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><p>Return-aware cruise planning with bookable shore options.</p><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify all current port and cruise-line details independently.</small></footer>
  </main>;
}
