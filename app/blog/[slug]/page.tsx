import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPost,
  blogPostHtml,
  blogPostPath,
  terminalTransferGuides,
} from "@/lib/blog";
import { siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return [{ slug: blogPost.slug }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== blogPost.slug) return {};
  const canonical = `${siteUrl}${blogPostPath}`;
  return {
    title: blogPost.seoTitle,
    description: blogPost.description,
    alternates: { canonical },
    openGraph: {
      title: blogPost.title,
      description: blogPost.description,
      url: canonical,
      type: "article",
      publishedTime: blogPost.published,
      modifiedTime: blogPost.modified,
      section: blogPost.category,
      images: [{ url: blogPost.image, width: blogPost.imageWidth, height: blogPost.imageHeight, alt: blogPost.imageAlt }],
    },
    twitter: { card: "summary_large_image", title: blogPost.title, description: blogPost.description, images: [blogPost.image] },
  };
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== blogPost.slug) notFound();
  const pageUrl = `${siteUrl}${blogPostPath}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogPost.title,
    description: blogPost.description,
    image: `${siteUrl}${blogPost.image}`,
    datePublished: blogPost.published,
    dateModified: blogPost.modified,
    mainEntityOfPage: pageUrl,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    articleSection: blogPost.category,
    keywords: blogPost.targetKeywords.join(", "),
    hasPart: terminalTransferGuides.map((guide) => ({
      "@type": "BlogPosting",
      "@id": `${siteUrl}${guide.path}`,
      name: guide.title,
      url: `${siteUrl}${guide.path}`,
    })),
    author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/about` },
    publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/`, logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png` } },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: blogPost.title, item: pageUrl },
    ],
  };

  return <main className="blog-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>

    <header className="blog-article-hero">
      <div className="blog-article-heading">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span aria-current="page">{blogPost.title}</span></nav>
        <p className="eyebrow"><span /> {blogPost.category}</p>
        <h1>{blogPost.title}</h1>
        <p className="blog-article-deck">{blogPost.excerpt}</p>
        <div className="blog-article-meta"><span>{blogPost.publishedLabel}</span><span>{blogPost.readTime}</span><span>By {blogPost.author}</span></div>
      </div>
      <figure className="blog-article-cover"><Image src={blogPost.image} alt={blogPost.imageAlt} width={blogPost.imageWidth} height={blogPost.imageHeight} sizes="(max-width: 800px) 100vw, 42vw" priority unoptimized /></figure>
    </header>

    <div className="blog-article-layout">
      <aside className="blog-toc" aria-label="Article contents"><span>In this article</span><ol>{blogPost.toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></aside>
      <article className="blog-article-body">
        <div dangerouslySetInnerHTML={{ __html: blogPostHtml }} />
        <aside className="blog-editorial-note"><strong>PortdayGuide editorial note</strong><p>This article examines industry direction rather than the operating details of one sailing. Terminal assignments, technology, access rules, and shore-power availability can change. Check your cruise line and port authority before travel.</p></aside>
        <section className="blog-child-guides" aria-labelledby="related-guides-title">
          <div className="blog-child-guides-heading">
            <p className="eyebrow"><span /> Terminal &amp; transfer guides</p>
            <h2 id="related-guides-title">Plan the journey around the terminal.</h2>
            <p>Use these practical guides to turn the terminal trends above into a smoother cruise-day plan.</p>
          </div>
          <div className="blog-child-guide-grid">
            {terminalTransferGuides.map((guide) => (
              <Link
                className="blog-child-guide-card"
                data-blog-child-card="true"
                href={guide.path}
                key={guide.path}
                aria-label={`Read ${guide.title}`}
              >
                <figure className="blog-child-guide-image">
                  <Image
                    src={guide.image}
                    alt={guide.imageAlt}
                    width={guide.imageWidth}
                    height={guide.imageHeight}
                    sizes="(max-width: 700px) calc(100vw - 34px), 360px"
                    unoptimized
                  />
                </figure>
                <div className="blog-child-guide-content">
                  <span>{guide.category} · {guide.readTime}</span>
                  <h3>{guide.cardTitle}</h3>
                  <p>{guide.excerpt}</p>
                  <b>Read guide <ArrowIcon /></b>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="blog-article-cta"><span>Plan the practical side</span><h2>Build your next port day around the correct terminal.</h2><p>Compare 64 cruise-port guides, then use your real ship times to protect the return before choosing activities.</p><div><Link href="/ports">Explore port guides <ArrowIcon /></Link><Link href="/planner">Open the free planner</Link></div></section>
      </article>
    </div>

    <section className="blog-back-link"><Link href="/blog">← Back to the PortdayGuide blog</Link></section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
