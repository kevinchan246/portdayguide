import { portPhotoPath, portPhotos } from "@/lib/port-photos";
import credits from "@/lib/scenic-photo-credits.json";
import { localPhoto, localPhotoSrcSet, scenicCardSizes } from "@/lib/local-photos";
import Link from "next/link";
import type { PortSlug } from "@/lib/shorepath";

type PortScenicPhotoProps = {
  slug: PortSlug;
  name: string;
  country?: string;
  variant?: "card" | "hero";
  priority?: boolean;
  sizes?: string;
};

export function PortScenicPhoto({ slug, name, country, variant = "card", priority = false, sizes }: PortScenicPhotoProps) {
  const photo = portPhotos[slug];
  const src = portPhotoPath(slug);
  const asset = localPhoto(src);
  const credit = credits[slug as keyof typeof credits];
  // A narrow, tall hero uses object-fit:cover. Account for its source aspect
  // ratio so a 390px viewport does not choose a blurry 480px panorama.
  const heroWidth = Math.min(asset?.width ?? 1600, Math.ceil(((asset?.width ?? 1600) / (asset?.height ?? 900)) * 600));
  const responsiveSizes = sizes ?? (variant === "hero" ? `(max-width: 640px) ${heroWidth}px, 100vw` : scenicCardSizes);
  const image = <picture style={{ display: "block", width: "100%", height: "100%" }}>
    {/* Curated, licensed Commons photography is stored with the deployment so images never depend on a runtime proxy. */}
    <source type="image/webp" srcSet={localPhotoSrcSet(src)} sizes={responsiveSizes} />
    <img src={src} alt={photo.alt} width={asset?.width ?? 1600} height={asset?.height ?? 900} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" style={variant === "hero" ? { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" } : undefined} />
  </picture>;

  // Keep the clickable credit above the hero overlay, outside the background's
  // negative/zero stacking context.
  if (variant === "hero") return <><div className="port-hero-photo" data-photo-source="Wikimedia Commons" aria-label={`Local scenery in ${name}${country ? `, ${country}` : ""}`}>{image}</div><small className="port-photo-caption"><Link href={`/photo-credits#${slug}`}>{credit.author}</Link></small></>;
  // Cards are often inside one linked guide. Keep the author as plain text to
  // avoid nested links; the shared footer opens the credit directory.
  return <figure className="guide-card-image port-scenic-photo" data-photo-source="Wikimedia Commons">{image}<small className="port-card-photo-credit">{credit.author}</small></figure>;
}
