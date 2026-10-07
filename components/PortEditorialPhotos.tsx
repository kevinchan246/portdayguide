import photos from "@/lib/editorial-photos.json";
import Link from "next/link";
import { localPhotoSrcSet } from "@/lib/local-photos";
import styles from "./PortEditorialPhotos.module.css";

export function PortEditorialPhotos({ slug, photoSlug }: { slug: string; photoSlug?: string }) {
  const all = photos[slug as keyof typeof photos];
  const entries = photoSlug ? all?.filter((photo) => photo.slug === photoSlug) : all;
  if (!entries?.length) return null;
  return <div className={photoSlug ? styles.single : styles.grid} aria-label="Featured places in this guide">
    {entries.map((photo) => <figure key={photo.slug} className={styles.photo} data-editorial-photo={photo.slug}>
      {/* Local, licensed photographs remain available without a Viator response. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/media/editorial/${photo.slug}.webp`} srcSet={localPhotoSrcSet(`/media/editorial/${photo.slug}.webp`)} sizes={photoSlug ? "(max-width: 800px) calc(100vw - 48px), 760px" : "(max-width: 640px) calc(100vw - 48px), (max-width: 1000px) calc((100vw - 72px) / 2), 480px"} alt={photo.alt} width={960} height={640} loading="lazy" decoding="async" />
      <figcaption>
        <span>{photo.caption}</span>
        <small><Link href={`/photo-credits#${photo.slug}`}>{photo.author}</Link></small>
      </figcaption>
    </figure>)}
  </div>;
}
