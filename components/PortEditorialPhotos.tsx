import photos from "@/lib/editorial-photos.json";
import { commonsFilePageUrl } from "@/lib/port-photos";
import styles from "./PortEditorialPhotos.module.css";

export function PortEditorialPhotos({ slug }: { slug: string }) {
  const entries = photos[slug as keyof typeof photos];
  if (!entries) return null;
  return <div className={styles.grid} aria-label="Featured places in this guide">
    {entries.map((photo) => <figure key={photo.slug} className={styles.photo} data-editorial-photo={photo.slug}>
      {/* Local, licensed photographs remain available without a Viator response. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/media/editorial/${photo.slug}.webp`} alt={photo.alt} width={960} height={640} loading="lazy" decoding="async" />
      <figcaption>
        <span>{photo.caption}</span>
        <small>Photo: <a href={commonsFilePageUrl(photo.file)} target="_blank" rel="noopener noreferrer">{photo.author} / Wikimedia Commons</a> · {photo.year} · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a> · Resized and cropped.</small>
      </figcaption>
    </figure>)}
  </div>;
}
