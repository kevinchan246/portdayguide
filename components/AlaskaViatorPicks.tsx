"use client";

import { useEffect, useState } from "react";
import { viatorPriceUnitLabel, type AlaskaViatorProductsPayload } from "@/lib/viator";

function currency(value: number, code: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: value % 1 ? 2 : 0,
  }).format(value);
}

export function AlaskaViatorPicks() {
  const [data, setData] = useState<AlaskaViatorProductsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/viator/products?featured=alaska", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Alaska Viator collection failed");
        setData(await response.json() as AlaskaViatorProductsPayload);
      })
      .catch((error) => { if (error instanceof Error && error.name !== "AbortError") setFailed(true); });
    return () => controller.abort();
  }, []);

  if (failed || (data && data.products.length < 3)) return null;

  const cards = data ? <div className="intent-viator-grid" data-alaska-viator-count={data.products.length}>
    {data.products.map((product) => {
      const priceUnit = viatorPriceUnitLabel(product.pricingPackageType);
      return <a
        className="intent-viator-card"
        href={product.productUrl}
        target="_blank"
        rel="sponsored nofollow noopener"
        key={`${product.portSlug}-${product.productCode}`}
        aria-label={`${product.title} in ${product.portName}, opens on Viator`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
        <div>
          <span>{product.portName} · {product.highlight} · {product.duration}{product.freeCancellation ? " · Free cancellation" : ""}</span>
          <h3>{product.title}</h3>
          <p>{product.rating !== null ? `${product.rating.toFixed(1)} ★ · ${product.reviewCount.toLocaleString()} reviews` : "New on Viator"}</p>
          <strong>From {currency(product.price, product.currency)} {priceUnit || ""}</strong>
          <b>View excursion ↗</b>
        </div>
      </a>;
    })}
  </div> : <div className="intent-viator-grid" aria-label="Loading direct Viator matches for featured Alaska cruise ports">
    {[0, 1, 2, 3].map((item) => <div className="viator-card-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}
  </div>;

  return <section className="intent-booking" aria-labelledby="alaska-viator-title">
    <div className="section-heading compact">
      <p className="eyebrow"><span /> Live booking options</p>
      <h2 id="alaska-viator-title">Compare excursions at Alaska&apos;s featured cruise ports.</h2>
    </div>
    <p className="affiliate-notice"><b>Affiliate disclosure:</b> PortdayGuide may earn a commission if you book through these sponsored links, at no extra cost to you. Viator supplies the live price, unit, rating, availability, and booking terms.</p>
    {cards}
    <p className="booking-check">Before booking, confirm the exact cruise berth or meeting point, pickup instructions, duration, accessibility, cancellation terms, and enough return time for your ship.</p>
  </section>;
}
