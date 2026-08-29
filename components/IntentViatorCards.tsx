"use client";

import { useEffect, useState } from "react";
import { viatorPriceUnitLabel, type ViatorProductsPayload } from "@/lib/viator";

function currency(value: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}

export function IntentViatorCards({ portSlug, topic, portName, heading }: { portSlug: string; topic: string; portName: string; heading: string }) {
  const [data, setData] = useState<ViatorProductsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/viator/products?port=${encodeURIComponent(portSlug)}&intent=${encodeURIComponent(topic)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Viator intent search failed");
        setData(await response.json() as ViatorProductsPayload);
      })
      .catch((error) => { if (error instanceof Error && error.name !== "AbortError") setFailed(true); });
    return () => controller.abort();
  }, [portSlug, topic]);

  if (failed) return null;
  if (data && !data.products.length) return null;

  const cards = data ? <div className="intent-viator-grid">
    {data.products.map((product) => {
      const priceUnit = viatorPriceUnitLabel(product.pricingPackageType);
      return <a className="intent-viator-card" href={product.productUrl} target="_blank" rel="sponsored nofollow noopener" key={product.productCode}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
        <div><span>{product.duration}{product.freeCancellation ? " · Free cancellation" : ""}</span><h3>{product.title}</h3><p>{product.rating !== null ? `${product.rating.toFixed(1)} ★ · ${product.reviewCount.toLocaleString()} reviews` : "New on Viator"}</p><strong>From {currency(product.price, product.currency)} {priceUnit || ""}</strong><b>View excursion ↗</b></div>
      </a>;
    })}
  </div> : <div className="intent-viator-grid" aria-label={`Loading relevant ${portName} excursions`}>{[0, 1, 2].map((item) => <div className="viator-card-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}</div>;

  return <section className="intent-booking" aria-labelledby="intent-booking-title"><div className="section-heading compact"><p className="eyebrow"><span /> Live booking options</p><h2 id="intent-booking-title">{heading}</h2></div><p className="affiliate-notice"><b>Affiliate disclosure:</b> PortdayGuide may earn a commission if you book through these sponsored links, at no extra cost to you. Viator supplies the live price, unit, rating, availability, and booking terms.</p>{cards}<p className="booking-check">Check the exact meeting point, terminal, duration, accessibility, cancellation terms, and return timing on Viator before booking.</p></section>;
}
