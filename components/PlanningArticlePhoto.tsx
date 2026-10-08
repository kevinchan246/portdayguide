import { LocalPhotoImage } from "@/components/LocalPhotoImage";
import { planningArticles } from "@/lib/planning-articles";

export function PlanningArticlePhoto({ path, sizes = "(max-width: 700px) calc(100vw - 40px), 460px" }: { path: string; sizes?: string }) {
  const image = planningArticles.find((article) => article.path === path)?.image;
  if (!image) return null;
  return <figure className="guide-card-image port-scenic-photo" data-photo-source="Wikimedia Commons">
    <LocalPhotoImage src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} />
    {image.author && <small className="port-card-photo-credit">{image.author}</small>}
  </figure>;
}
