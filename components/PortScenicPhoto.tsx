import { commonsFilePageUrl, portPhotoPath, portPhotos } from "@/lib/port-photos";
import type { PortSlug } from "@/lib/shorepath";

type PortScenicPhotoProps = {
  slug: PortSlug;
  name: string;
  country?: string;
  variant?: "card" | "hero";
  priority?: boolean;
};

export function PortScenicPhoto({ slug, name, country, variant = "card", priority = false }: PortScenicPhotoProps) {
  const photo = portPhotos[slug];
  const sourceUrl = commonsFilePageUrl(photo.file);
  const image = <>
    {/* Curated, licensed Commons photography is stored with the deployment so images never depend on a runtime proxy. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={portPhotoPath(slug)} alt={photo.alt} width={variant === "hero" ? 1600 : 1000} height={variant === "hero" ? 900 : 625} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" />
    {variant === "hero"
      ? <small className="port-photo-caption">Photo: <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Wikimedia Commons</a></small>
      : <small className="port-card-photo-credit">Photo: Wikimedia Commons</small>}
  </>;

  if (variant === "hero") return <div className="port-hero-photo" data-photo-source="Wikimedia Commons" aria-label={`Local scenery in ${name}${country ? `, ${country}` : ""}`}>{image}</div>;
  return <figure className="guide-card-image port-scenic-photo" data-photo-source="Wikimedia Commons">{image}</figure>;
}
