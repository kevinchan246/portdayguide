import { portMapTileLayout } from "@/lib/editorial";

export function PortHeroMap({ slug, name }: { slug: string; name: string }) {
  const layout = portMapTileLayout(slug, 12, 5, 3);
  return <div className="port-hero-map" aria-label={`${name} port area map`}>
    <div className="port-hero-map-tiles" style={{ gridTemplateColumns: `repeat(${layout.columns},1fr)`, gridTemplateRows: `repeat(${layout.rows},1fr)` }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {layout.tiles.map((src) => <img src={src} alt="" key={src} />)}
    </div>
    <span className="port-hero-map-marker" style={{ left: layout.markerLeft, top: layout.markerTop }} aria-hidden="true" />
  </div>;
}
