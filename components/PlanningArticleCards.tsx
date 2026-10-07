import Link from "next/link";
import { LocalPhotoImage } from "@/components/LocalPhotoImage";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import type { PlanningArticle } from "@/lib/planning-articles";
import { profilesBySlug } from "@/lib/shorepath";

export function PlanningArticleCards({ articles }: { articles: PlanningArticle[] }) {
  return <div className="planning-article-grid">{articles.map((article) => {
    const profile = article.portSlug ? profilesBySlug[article.portSlug] : undefined;
    // Destination photography is illustrative; only an article's own image is
    // described as its specific attraction or terminal.
    const destinationPhoto = profile && (!article.image || article.path === "/blog/alaska-cruise-ports");
    return <article className="planning-article-card" key={article.path}>
      <Link className="planning-article-image" href={article.path} aria-label={`Read ${article.title}`}>
        {destinationPhoto
          ? <PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} />
          : article.image && <LocalPhotoImage src={article.image.src} alt={article.image.alt} width={article.image.width} height={article.image.height} sizes="(max-width: 700px) calc(100vw - 40px), (max-width: 1000px) 45vw, 380px" />}
        {article.image?.author && <small className="port-card-photo-credit">{article.image.author}</small>}
      </Link>
      <div className="planning-article-copy">
        <p className="planning-article-category">{article.category}</p>
        <h3><Link href={article.path}>{article.title}</Link></h3>
        <p>{article.description}</p>
        <Link className="planning-article-read" href={article.path}>Read the guide <span aria-hidden="true">→</span></Link>
      </div>
    </article>;
  })}</div>;
}
