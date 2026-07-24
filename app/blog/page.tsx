import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPost, blogPostPath } from "@/lib/blog";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cruise Planning Blog",
  description: "Cruise-port analysis, terminal trends, practical planning ideas, and the changes shaping future days ashore.",
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: "Cruise Planning Blog | PortdayGuide",
    description: "Cruise-port analysis, terminal trends, and practical ideas for better days ashore.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [{ url: blogPost.image, alt: blogPost.imageAlt }],
  },
  twitter: { card: "summary_large_image", images: [blogPost.image] },
};

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function BlogPage() {
  const pageUrl = `${siteUrl}/blog`;
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "PortdayGuide Cruise Planning Blog",
    description: "Cruise-port analysis, terminal trends, practical planning ideas, and the changes shaping future days ashore.",
    url: pageUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: 1,
      itemListElement: [{
        "@type": "ListItem",
        position: 1,
        name: blogPost.title,
        url: `${siteUrl}${blogPostPath}`,
      }],
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
        <p className="eyebrow"><span /> Cruise planning journal</p>
        <h1>Ideas for better ports—and better days ashore.</h1>
        <p>Terminal trends, cruise-port technology, and practical planning context for travelers who want to understand what is changing beyond the gangway.</p>
      </div>
    </section>

    <section className="section blog-index-content" aria-labelledby="latest-blog-title">
      <div className="section-heading discovery-heading"><p className="eyebrow"><span /> Latest article</p><h2 id="latest-blog-title">Cruise-port insights.</h2><p>Long-form analysis that complements PortdayGuide&apos;s destination guides and return-aware planning tools.</p></div>
      <article className="blog-feature-card">
        <Link className="blog-feature-image" href={blogPostPath} aria-label={`Read ${blogPost.title}`}><Image src={blogPost.image} alt={blogPost.imageAlt} width={blogPost.imageWidth} height={blogPost.imageHeight} sizes="(max-width: 800px) 100vw, 55vw" /></Link>
        <div>
          <p className="blog-card-meta"><span>{blogPost.category}</span><span>{blogPost.publishedLabel}</span><span>{blogPost.readTime}</span></p>
          <h2><Link href={blogPostPath}>{blogPost.title}</Link></h2>
          <p>{blogPost.excerpt}</p>
          <Link className="blog-read-link" href={blogPostPath}>Read the article <ArrowIcon /></Link>
        </div>
      </article>
    </section>

    <section className="blog-index-bridge">
      <div><p className="eyebrow"><span /> Planning a specific stop?</p><h2>Turn the wider trends into a workable port day.</h2><p>Use the port directory for terminal details, transfer assumptions, return timing, and current excursion options.</p></div>
      <Link href="/ports">Browse all port guides <ArrowIcon /></Link>
    </section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
