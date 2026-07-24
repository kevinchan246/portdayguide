import { mapCredit, portMapTileLayout } from "@/lib/editorial";

export function PortMapThumbnail({ slug, name, country }: { slug: string; name: string; country: string }) {
  const layout = portMapTileLayout(slug);
  return <figure className="guide-card-image port-map-thumbnail" aria-label={`${name}, ${country} port area map`}>
    <div className="port-map-tiles" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {layout.tiles.map((src) => <img src={src} alt="" loading="lazy" key={src} />)}
    </div>
    <span className="port-map-marker" style={{ left: layout.markerLeft, top: layout.markerTop }} aria-hidden="true" />
    <figcaption>{mapCredit.label}</figcaption>
  </figure>;
}
