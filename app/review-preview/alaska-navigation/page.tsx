import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Alaska navigation review", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function NavigationReview({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "overview-desktop" } = await searchParams;
  const phone = view.endsWith("-phone");
  const comparison = view.startsWith("comparison-");
  const width = phone ? 390 : 1440;
  const height = phone ? 2100 : 1000;
  const scale = phone ? 1 : .7;
  const src = comparison
    ? "/blog/alaska-one-way-vs-round-trip#alaska-shore-day-guides"
    : "/blog/alaska-cruise-ports#alaska-route-comparison";
  return <main style={{ padding: 24 }}>
    <h1 style={{ fontSize: 24 }}>Alaska navigation review</h1>
    <p>Temporary deployment-preview inspection. This route is removed before merging.</p>
    <nav style={{ display: "flex", gap: 18, flexWrap: "wrap", margin: "16px 0" }}>
      <Link href="?view=overview-desktop">Overview desktop</Link>
      <Link href="?view=overview-phone">Overview phone</Link>
      <Link href="?view=comparison-desktop">Comparison desktop</Link>
      <Link href="?view=comparison-phone">Comparison phone</Link>
    </nav>
    <p>Content viewport: {width}px × {height}px</p>
    <div style={{ width: width * scale, height: height * scale, overflow: "hidden", border: "1px solid #aaa" }}>
      <iframe title={`${comparison ? "Comparison" : "Overview"} ${phone ? "phone" : "desktop"}`} src={src} width={width} height={height} style={{ display: "block", border: 0, transform: `scale(${scale})`, transformOrigin: "top left" }} />
    </div>
  </main>;
}
