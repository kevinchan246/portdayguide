import Link from "next/link";
import { LocalPhotoImage } from "@/components/LocalPhotoImage";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import { articleCover } from "@/lib/article-covers";
import type { PlanningArticle } from "@/lib/planning-articles";
import scenicPhotoCredits from "@/lib/scenic-photo-credits.json";
import { profilesBySlug } from "@/lib/shorepath";
import styles from "./PlanningArticleCards.module.css";

export function PlanningArticleCards({ articles, linkedCredits = false }: { articles: PlanningArticle[]; linkedCredits?: boolean }) {
  return <div className="planning-article-grid">{articles.map((article) => {
    const profile = article.portSlug ? profilesBySlug[article.portSlug] : undefined;
    // Destination photography is illustrative; only an article's own image is
    // described as its specific attraction or terminal.
    const destinationPhoto = profile && !article.image;
    let credit: { author: string; href: string } | undefined;
    if (linkedCredits) {
      if (article.image) {
        const cover = articleCover(article.path);
        if (cover) credit = { author: cover.author, href: cover.creditHref };
      } else if (profile) {
        const portCredit = scenicPhotoCredits[profile.slug as keyof typeof scenicPhotoCredits];
        if (portCredit) credit = { author: portCredit.author, href: `/photo-credits#${profile.slug}` };
      }
    }
    const image = <>
      {destinationPhoto
        ? <PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} showCardCredit={!credit} />
        : article.image && <LocalPhotoImage src={article.image.src} alt={article.image.alt} width={article.image.width} height={article.image.height} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) 45vw, 380px" />}
      {!credit && article.image?.author && <small className="port-card-photo-credit">{article.image.author}</small>}
    </>;
    return <article className="planning-article-card" key={article.path}>
      {credit ? <div className={`planning-article-image ${styles.linkedImage}`}>
        <Link className={styles.imageLink} href={article.path} aria-label={`Read ${article.title}`}>{image}</Link>
        <small className={`port-card-photo-credit ${styles.credit}`}><Link href={credit.href}>{credit.author}</Link></small>
      </div> : <Link className="planning-article-image" href={article.path} aria-label={`Read ${article.title}`}>{image}</Link>}
      <div className="planning-article-copy">
        <p className="planning-article-category">{article.category}</p>
        <h3><Link href={article.path}>{article.title}</Link></h3>
        <p>{article.description}</p>
        <Link className="planning-article-read" href={article.path}>Read the guide <span aria-hidden="true">→</span></Link>
      </div>
    </article>;
  })}</div>;
}
