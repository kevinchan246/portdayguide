import type { Metadata } from "next";
import Link from "next/link";
import scenicCredits from "@/lib/scenic-photo-credits.json";
import supplementalCredits from "@/lib/supplemental-photo-credits.json";
import editorialPhotos from "@/lib/editorial-photos.json";
import { commonsFilePageUrl } from "@/lib/port-photos";
import { websiteMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export const metadata: Metadata = {
  ...websiteMetadata("Photo credits", "Photographers, original sources, licenses and image adjustments for PortdayGuide photographs.", "/photo-credits"),
  robots: { index: false, follow: true },
};

type Credit = {
  author: string;
  file: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  changes: string;
  creditLine?: string;
  authorUrl?: string;
};

const editorialCredits: [string, Credit][] = Object.values(editorialPhotos).flat().map((photo) => [photo.slug, {
  author: photo.author,
  file: photo.file,
  sourceUrl: commonsFilePageUrl(photo.file),
  license: photo.license,
  licenseUrl: photo.licenseUrl,
  changes: "Resized, cropped to a 3:2 display frame and compressed as WebP. The photographed scene is unchanged.",
}]);
const credits: [string, Credit][] = [...Object.entries(scenicCredits), ...editorialCredits, ...Object.entries(supplementalCredits)];

export default function PhotoCreditsPage() {
  return <main className="legal-page">
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>
    <article>
      <p className="eyebrow"><span /> Photography</p>
      <h1>Photo credits</h1>
      <p>Each guide keeps its photo credit short. This directory provides the original title, photographer, source, license and web adjustments. Destination photographs can be archival; they do not confirm current terminal arrangements or attraction conditions.</p>
      <p>Photographs under a share-alike license, including our resized versions, remain available under that same license. A photographer&apos;s inclusion does not imply an endorsement of PortdayGuide.</p>
      <div className={styles.credits}>
        {credits.map(([id, photo]) => <section id={id} key={id} className={styles.credit}>
          <h2>{photo.author}</h2>
          <p><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.file}</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></p>
          {photo.creditLine && <p>{photo.creditLine}{photo.authorUrl && <> · <a href={photo.authorUrl} target="_blank" rel="noopener noreferrer">Photographer website</a></>}</p>}
          <p>{photo.changes}</p>
        </section>)}
      </div>
    </article>
    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide.</small></footer>
  </main>;
}
