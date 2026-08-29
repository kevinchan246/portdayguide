import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  blogPost,
  blogPostPath,
  mcoToPortCanaveralFaq,
  mcoToPortCanaveralHtml,
  mcoToPortCanaveralPath,
  mcoToPortCanaveralPost,
} from "@/lib/blog";
import { siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return [{ slug: blogPost.slug, article: mcoToPortCanaveralPost.slug }];
}

function isMcoArticle(slug: string, article: string) {
  return slug === blogPost.slug && article === mcoToPortCanaveralPost.slug;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}): Promise<Metadata> {
  const { slug, article } = await params;
  if (!isMcoArticle(slug, article)) return {};
  const canonical = `${siteUrl}${mcoToPortCanaveralPath}`;
  return {
    title: mcoToPortCanaveralPost.seoTitle,
    description: mcoToPortCanaveralPost.description,
    alternates: { canonical },
    openGraph: {
      title: mcoToPortCanaveralPost.title,
      description: mcoToPortCanaveralPost.description,
      url: canonical,
      type: "article",
      publishedTime: mcoToPortCanaveralPost.published,
      modifiedTime: mcoToPortCanaveralPost.modified,
      section: mcoToPortCanaveralPost.category,
      images: [{
        url: mcoToPortCanaveralPost.image,
        width: mcoToPortCanaveralPost.imageWidth,
        height: mcoToPortCanaveralPost.imageHeight,
        alt: mcoToPortCanaveralPost.imageAlt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: mcoToPortCanaveralPost.title,
      description: mcoToPortCanaveralPost.description,
      images: [mcoToPortCanaveralPost.image],
    },
  };
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export default async function McoToPortCanaveralPage({
  params,
}: {
  params: Promise<{ slug: string; article: string }>;
}) {
  const { slug, article } = await params;
  if (!isMcoArticle(slug, article)) notFound();

  const pageUrl = `${siteUrl}${mcoToPortCanaveralPath}`;
  const parentUrl = `${siteUrl}${blogPostPath}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: mcoToPortCanaveralPost.title,
    description: mcoToPortCanaveralPost.description,
    image: `${siteUrl}${mcoToPortCanaveralPost.image}`,
    datePublished: mcoToPortCanaveralPost.published,
    dateModified: mcoToPortCanaveralPost.modified,
    mainEntityOfPage: pageUrl,
    inLanguage: "en-US",
    isAccessibleForFree: true,
    articleSection: mcoToPortCanaveralPost.category,
    keywords: mcoToPortCanaveralPost.targetKeywords.join(", "),
    isPartOf: {
      "@type": "BlogPosting",
      "@id": parentUrl,
      name: blogPost.title,
      url: parentUrl,
    },
    author: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PortdayGuide",
      url: `${siteUrl}/about`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "PortdayGuide",
      url: `${siteUrl}/`,
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon-512.png` },
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: blogPost.title, item: parentUrl },
      { "@type": "ListItem", position: 4, name: mcoToPortCanaveralPost.title, item: pageUrl },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: mcoToPortCanaveralFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return <main className="blog-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>

    <header className="blog-article-hero">
      <div className="blog-article-heading">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span>
          <Link href="/blog">Blog</Link><span>/</span>
          <Link href={blogPostPath}>Cruise terminals</Link><span>/</span>
          <span aria-current="page">MCO to Port Canaveral</span>
        </nav>
        <p className="eyebrow"><span /> {mcoToPortCanaveralPost.category}</p>
        <h1>{mcoToPortCanaveralPost.title}</h1>
        <p className="blog-article-deck">{mcoToPortCanaveralPost.excerpt}</p>
        <div className="blog-article-meta"><span>{mcoToPortCanaveralPost.publishedLabel}</span><span>{mcoToPortCanaveralPost.readTime}</span><span>By {mcoToPortCanaveralPost.author}</span></div>
      </div>
      <figure className="blog-article-cover"><Image src={mcoToPortCanaveralPost.image} alt={mcoToPortCanaveralPost.imageAlt} width={mcoToPortCanaveralPost.imageWidth} height={mcoToPortCanaveralPost.imageHeight} sizes="(max-width: 800px) 100vw, 42vw" priority unoptimized /></figure>
    </header>

    <div className="blog-article-layout">
      <aside className="blog-toc" aria-label="Article contents"><span>In this article</span><ol>{mcoToPortCanaveralPost.toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.label}</a></li>)}</ol></aside>
      <article className="blog-article-body">
        <div dangerouslySetInnerHTML={{ __html: mcoToPortCanaveralHtml }} />
        <aside className="blog-editorial-note">
          <strong>Transportation planning note</strong>
          <p>Travel times and price ranges are planning estimates, not live quotes. Confirm the current pickup point, total price, toll treatment, terminal, luggage capacity, accessibility, cancellation policy, and flight-delay terms with the provider before travel.</p>
        </aside>
        <section className="blog-related-guides" aria-labelledby="related-guides-title">
          <Link className="blog-related-guide-card" href={blogPostPath} aria-label={`Read ${blogPost.title}`}>
            <figure className="blog-related-guide-image">
              <Image
                src={blogPost.image}
                alt={blogPost.imageAlt}
                width={blogPost.imageWidth}
                height={blogPost.imageHeight}
                sizes="(max-width: 560px) calc(100vw - 34px), 260px"
                unoptimized
              />
            </figure>
            <div className="blog-related-guide-content">
              <p className="eyebrow"><span /> Related guide</p>
              <h2 id="related-guides-title">Why cruise terminals are changing.</h2>
              <p>See how passenger flow, landside transport, technology, sustainability, and larger ships are reshaping the terminals behind transfers like this one.</p>
              <span className="blog-related-guide-link">Read {blogPost.title} <ArrowIcon /></span>
            </div>
          </Link>
        </section>
        <section className="blog-article-cta">
          <span>Continue planning</span>
          <h2>Build the rest of your cruise around the correct terminal.</h2>
          <p>Compare PortdayGuide&apos;s cruise-port guides, then use your real ship times to protect every return before choosing activities.</p>
          <div><Link href="/ports">Explore port guides <ArrowIcon /></Link><Link href="/planner">Open the free planner</Link></div>
        </section>
      </article>
    </div>

    <section className="blog-back-link"><Link href="/blog">← Back to the PortdayGuide blog</Link></section>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
