import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IntentViatorCards } from "@/components/IntentViatorCards";
import { PortDayFit } from "@/components/PortDayFit";
import { PortHeroImage } from "@/components/PortHeroImage";
import { YokohamaTerminalArticle } from "@/components/YokohamaTerminalArticle";
import { portPhotos, portPhotoUrl } from "@/lib/port-photos";
import { intentGuide, intentGuidePath, intentGuidesForPort, portIntentGuides } from "@/lib/port-intent-guides";
import { portPath, siteUrl } from "@/lib/seo";
import { profilesBySlug, type PortSlug } from "@/lib/shorepath";

export function generateStaticParams() {
  return portIntentGuides.map((guide) => ({ slug: guide.urlPortSlug, topic: guide.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; topic: string }> }): Promise<Metadata> {
  const { slug, topic } = await params;
  const guide = intentGuide(slug, topic);
  if (!guide) return {};
  const image = portPhotos[guide.sourcePortSlug];
  const canonical = `${siteUrl}${intentGuidePath(guide)}`;
  const metadataTitle = guide.seoTitle.length > 45 ? { absolute: guide.seoTitle } : guide.seoTitle;
  return {
    title: metadataTitle,
    description: guide.description,
    alternates: { canonical },
    openGraph: { title: `${guide.seoTitle} | PortdayGuide`, description: guide.description, url: canonical, type: "article", images: [{ url: portPhotoUrl(guide.sourcePortSlug), alt: image.alt }] },
    twitter: { card: "summary_large_image", title: guide.seoTitle, description: guide.description, images: [portPhotoUrl(guide.sourcePortSlug)] },
  };
}

export default async function PortIntentPage({ params }: { params: Promise<{ slug: string; topic: string }> }) {
  const { slug, topic } = await params;
  const guide = intentGuide(slug, topic);
  if (!guide) notFound();
  const profile = profilesBySlug[guide.sourcePortSlug as PortSlug];
  if (!profile) notFound();
  const url = `${siteUrl}${intentGuidePath(guide)}`;
  const hub = portPath(profile.slug);
  const siblings = intentGuidesForPort(guide.sourcePortSlug).filter((candidate) => candidate.topic !== guide.topic);
  const isYokohamaTerminalArticle = guide.template === "yokohama-terminal-editorial";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Cruise port guides", item: `${siteUrl}/ports` },
      { "@type": "ListItem", position: 3, name: `${profile.name} cruise port guide`, item: `${siteUrl}${hub}` },
      { "@type": "ListItem", position: 4, name: guide.title, item: url },
    ],
  };
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.published || "2026-07-21",
    dateModified: guide.modified || "2026-07-21",
    mainEntityOfPage: url,
    image: portPhotoUrl(guide.sourcePortSlug),
    inLanguage: "en-US",
    isAccessibleForFree: true,
    articleSection: `${profile.name} cruise planning`,
    about: [{ "@type": "Place", name: profile.name }, { "@type": "Thing", name: guide.eyebrow }],
    author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/about` },
    publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "PortdayGuide", url: `${siteUrl}/` },
  };
  const faqSchema = guide.faqs ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
  } : null;

  return <main className="intent-guide-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href={hub}>{profile.name} guide</Link><Link href="/ports">All ports</Link><Link href="/blog">Blog</Link><Link href="/planner">Planner</Link></nav></header>

    <section className="intent-hero">
      <PortHeroImage slug={profile.slug} name={profile.name} />
      <div className="intent-hero-overlay" />
      <div className="intent-hero-copy">
        <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/ports">Port guides</Link><span>/</span><Link href={hub}>{profile.name}</Link><span>/</span><span aria-current="page">{guide.topic.replaceAll("-", " ")}</span></nav>
        <p className="eyebrow"><span /> {guide.eyebrow}</p>
        <h1>{guide.title}</h1>
        <p>{guide.lede}</p>
      </div>
    </section>

    <div className="intent-meta"><span>Reviewed {guide.reviewed}</span><span>By PortdayGuide editorial</span><Link href="/about">About PortdayGuide</Link></div>

    <article className={`intent-article${isYokohamaTerminalArticle ? " intent-editorial-article" : ""}`}>
      {isYokohamaTerminalArticle ? <YokohamaTerminalArticle guide={guide} hub={hub} /> : <>
        <section className="intent-answer" aria-labelledby="quick-answer-title"><span>Quick answer</span><h2 id="quick-answer-title">{guide.quickAnswerHeading || "The decision in one minute"}</h2><p>{guide.quickAnswer}</p><div>{guide.facts.map((fact) => <dl key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></dl>)}</div></section>

        <PortDayFit fit={guide.fit} />

        {guide.sections.map((section) => <section className="intent-copy-section" key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}

        {guide.comparison && <section className="intent-comparison"><h2>{guide.comparison.heading}</h2><div className="intent-table-wrap"><table><thead><tr>{guide.comparison.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{guide.comparison.rows.map((row) => <tr key={row.join("-")}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>}

        <section className="intent-steps"><div><span>Use this on the day</span><h2>A cruise-safe sequence</h2></div><ol>{guide.steps.map((step, index) => <li key={step.title}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol></section>

        <section className="intent-verdict"><span>PortdayGuide verdict</span><h2>Who should choose this plan?</h2><p>{guide.decision}</p></section>

        <IntentViatorCards portSlug={guide.sourcePortSlug} topic={guide.topic} portName={profile.name} heading={guide.viator.heading} />

        <section className="intent-sources"><span>Sources & verification</span><h2>What this guide is based on</h2><p>PortdayGuide compares current destination or port references with cruise-day timing. Prices, operations, sea conditions, and terminal assignments can change; the cruise line and same-day posted information control.</p><ul>{guide.sources.map((source) => <li key={source.url}>{source.url.startsWith("/") ? <Link href={source.url}>{source.label}</Link> : <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>}<span>{source.note}</span></li>)}</ul></section>

        <section className="intent-next"><div><span>Finish the decision</span><h2>Put this route on your ship&apos;s clock.</h2><p>Use your actual arrival, all-aboard time, pace, mobility, and budget. The planner keeps the return margin before suggesting what fits.</p></div><Link href={`/planner?port=${encodeURIComponent(guide.sourcePortSlug)}&from=${encodeURIComponent(guide.topic)}`}>Build my {profile.name} port day <span aria-hidden="true">→</span></Link></section>

        <section className="intent-cluster"><div><span>{profile.name} topic cluster</span><h2>Continue planning this port</h2></div><div>{siblings.map((candidate) => <Link href={intentGuidePath(candidate)} key={candidate.topic}><span>{candidate.eyebrow}</span><h3>{candidate.title}</h3><p>{candidate.description}</p></Link>)}<Link href={hub}><span>Complete port hub</span><h3>{profile.name} Cruise Port Guide</h3><p>See terminal facts, top activities, 6- and 8-hour plans, weather fallback, and live excursion matches.</p></Link></div></section>
      </>}
    </article>

    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/planner">Planner</Link><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/disclosure">Affiliate disclosure</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify current ship times and booking details.</small></footer>
  </main>;
}
