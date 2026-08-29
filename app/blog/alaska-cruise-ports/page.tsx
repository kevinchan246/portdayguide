import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  alaskaCruisePortGuides,
  alaskaCruisePortsFaq,
  alaskaCruisePortsHtml,
  alaskaCruisePortsPath,
  alaskaCruisePortsPost,
} from "@/lib/alaska-blog";
import { AlaskaViatorPicks } from "@/components/AlaskaViatorPicks";
import { portPhotos, portPhotoPath } from "@/lib/port-photos";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: alaskaCruisePortsPost.seoTitle,
  description: alaskaCruisePortsPost.description,
  alternates: { canonical: `${siteUrl}${alaskaCruisePortsPath}` },
  openGraph: {
    title: alaskaCruisePortsPost.title,
    description: alaskaCruisePortsPost.description,
    url: `${siteUrl}${alaskaCruisePortsPath}`,
    type: "article",
    publishedTime: alaskaCruisePortsPost.published,
    modifiedTime: alaskaCruisePortsPost.modified,
    section: alaskaCruisePortsPost.category,
    images: [{
      url: alaskaCruisePortsPost.image,
      width: alaskaCruisePortsPost.imageWidth,
      height: alaskaCruisePortsPost.imageHeight,
      alt: alaskaCruisePortsPost.imageAlt,
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: alaskaCruisePortsPost.title,
    description: alaskaCruisePortsPost.description,
    images: [alaskaCruisePortsPost.image],
  },
};

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default function AlaskaCruisePortsPage() {
  const pageUrl = `${siteUrl}${alaskaCruisePortsPath}`;
  const viatorInsertionAnchor = '<h2 id="juneau">';
  const viatorInsertionIndex = alaskaCruisePortsHtml.indexOf(viatorInsertionAnchor);
  const articleBeforeViator = viatorInsertionIndex >= 0 ? alaskaCruisePortsHtml.slice(0, viatorInsertionIndex) : alaskaCruisePortsHtml;
  const articleAfterViator = viatorInsertionIndex >= 0 ? alaskaCruisePortsHtml.slice(viatorInsertionIndex) : "";
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: alaskaCruisePortsPost.title,
    description: alaskaCruisePortsPost.description,
    image: `${siteUrl}${alaskaCruisePortsPost.image}`,
    datePublished: alaskaCruisePortsPost.published,
    dateModified: alaskaCruisePortsPost.modified,
    mainEntityOfPage: pageUrl,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    articleSection: alaskaCruisePortsPost.category,
    keywords: alaskaCruisePortsPost.targetKeywords.join(", "),
    about: alaskaCruisePortGuides.map((guide) => ({
      "@type": "TouristDestination",
      name: guide.title.replace(" Cruise Port Guide", ""),
      url: `${siteUrl}/ports/${guide.slug}`,
    })),
    author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/about` },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PortdayGuide",
      url: `${siteUrl}/`,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png` },
    },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: alaskaCruisePortsFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: alaskaCruisePortsPost.title, item: pageUrl },
    ],
  };

  return <main className="blog-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>

    <header className="blog-article-hero">
      <div className="blog-article-heading">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span aria-current="page">{alaskaCruisePortsPost.title}</span></nav>
        <p className="eyebrow"><span /> {alaskaCruisePortsPost.category}</p>
        <h1>{alaskaCruisePortsPost.title}</h1>
        <p className="blog-article-deck">{alaskaCruisePortsPost.excerpt}</p>
        <div className="blog-article-meta"><span>{alaskaCruisePortsPost.publishedLabel}</span><span>{alaskaCruisePortsPost.readTime}</span><span>By {alaskaCruisePortsPost.author}</span></div>
      </div>
      <figure className="blog-article-cover"><Image src={alaskaCruisePortsPost.image} alt={alaskaCruisePortsPost.imageAlt} width={alaskaCruisePortsPost.imageWidth} height={alaskaCruisePortsPost.imageHeight} sizes="(max-width: 800px) 100vw, 42vw" priority unoptimized /></figure>
    </header>

    <div className="blog-article-layout">
      <aside className="blog-toc" aria-label="Article contents"><span>In this article</span><ol>{alaskaCruisePortsPost.toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></aside>
      <article className="blog-article-body">
        <div dangerouslySetInnerHTML={{ __html: articleBeforeViator }} />
        <AlaskaViatorPicks />
        {articleAfterViator && <div dangerouslySetInnerHTML={{ __html: articleAfterViator }} />}
        <aside className="blog-editorial-note"><strong>PortdayGuide planning note</strong><p>Cruise routes, ports of call, berth assignments, excursions, access conditions, and wildlife sightings vary by sailing. Confirm the current itinerary and every port-day booking with the cruise line and operator before travel.</p></aside>

        <section className="blog-child-guides" aria-labelledby="alaska-port-guides-title">
          <div className="blog-child-guides-heading">
            <p className="eyebrow"><span /> Alaska port guides</p>
            <h2 id="alaska-port-guides-title">Turn the route overview into a port-day plan.</h2>
            <p>Use the detailed guides for terminal context, transport, realistic return timing, and current excursion options at Alaska&apos;s most popular cruise stops.</p>
          </div>
          <div className="blog-child-guide-grid">
            {alaskaCruisePortGuides.map((guide) => (
              <Link className="blog-child-guide-card" data-alaska-port-card="true" href={`/ports/${guide.slug}`} key={guide.slug} aria-label={`Read ${guide.title}`}>
                <figure className="blog-child-guide-image">
                  <Image
                    src={portPhotoPath(guide.slug)}
                    alt={portPhotos[guide.slug].alt}
                    width={guide.slug === "skagway" ? 1280 : 1600}
                    height={guide.slug === "skagway" ? 870 : guide.slug === "juneau" || guide.slug === "ketchikan" ? 1067 : 1071}
                    sizes="(max-width: 700px) calc(100vw - 34px), 360px"
                    unoptimized
                  />
                </figure>
                <div className="blog-child-guide-content">
                  <span>Alaska cruise port</span>
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <b>Read port guide <ArrowIcon /></b>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="blog-article-cta"><span>Build the port days</span><h2>Plan each Alaska stop from the ship backward.</h2><p>Start with the correct berth, reserve the realistic return trip and ship-side margin, then choose the experience that fits the time left ashore.</p><div><Link href="/ports/regions/alaska-pacific-northwest">Explore Alaska port guides <ArrowIcon /></Link><Link href="/planner">Open the free planner</Link></div></section>
      </article>
    </div>

    <section className="blog-back-link"><Link href="/blog">← Back to the PortdayGuide blog</Link></section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
