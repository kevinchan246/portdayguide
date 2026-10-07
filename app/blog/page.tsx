import type { Metadata } from "next";
import Link from "next/link";
import { PlanningArticleCards } from "@/components/PlanningArticleCards";
import { alaskaCruisePortsPost } from "@/lib/alaska-blog";
import { planningArticles } from "@/lib/planning-articles";
import { siteUrl, websiteMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...websiteMetadata("Cruise Planning Guides: Transport & Itineraries", "Find detailed cruise planning articles on port taxis, airport transfers, beach trips, short shore days and Alaska cruise routes.", "/blog"),
  openGraph: {
    title: "Cruise Planning Guides | PortdayGuide",
    description: "Port transport, complete trip costs, shore-day decisions and cruise routes.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [{ url: alaskaCruisePortsPost.image, alt: alaskaCruisePortsPost.imageAlt }],
  },
  twitter: { card: "summary_large_image", images: [alaskaCruisePortsPost.image] },
};

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function BlogPage() {
  const pageUrl = `${siteUrl}/blog`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PortdayGuide Cruise Planning Guides",
    description: "Detailed port transport, cost, shore-day and cruise-route articles.",
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: planningArticles.length,
      itemListElement: planningArticles.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: `${siteUrl}${post.path}`,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl },
    ],
  };

  return <main className="blog-index-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog" aria-current="page">Blog</Link><Link href="/planner">Free planner</Link></nav></header>

    <section className="blog-index-hero">
      <div>
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">Blog</span></nav>
        <p className="eyebrow"><span /> Cruise planning guides</p>
        <h1>Port transport, costs and days ashore.</h1>
        <p>Find the correct terminal, compare the complete journey, and choose a shore plan that fits your time. These detailed articles complement the destination guides.</p>
      </div>
    </section>

    <section className="section blog-index-content" aria-labelledby="latest-blog-title">
      <div className="section-heading discovery-heading"><p className="eyebrow"><span /> Detailed articles</p><h2 id="latest-blog-title">Choose your planning question.</h2><p>Terminal comparisons, taxi budgets, beach trips, airport transfers and cruise-route choices.</p></div>
      <PlanningArticleCards articles={planningArticles} />
    </section>

    <section className="blog-index-bridge">
      <div><p className="eyebrow"><span /> Planning a specific stop?</p><h2>Start with your complete port guide.</h2><p>Use the port directory for berth information, destination choices, transport assumptions and excursion options.</p></div>
      <Link href="/ports">Browse all port guides <ArrowIcon /></Link>
    </section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
