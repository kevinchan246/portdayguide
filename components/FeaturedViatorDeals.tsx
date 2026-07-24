"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { viatorPriceUnitLabel, type FeaturedViatorProductsPayload, type ViatorApiErrorPayload } from "@/lib/viator";

function currency(value: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}

export function FeaturedViatorDeals() {
  const [data, setData] = useState<FeaturedViatorProductsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/viator/products?featured=home", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw await response.json() as ViatorApiErrorPayload;
        return response.json() as Promise<FeaturedViatorProductsPayload>;
      })
      .then(setData)
      .catch((error) => { if (error?.name !== "AbortError") setFailed(true); });
    return () => controller.abort();
  }, []);

  if (!data && !failed) return <div className="viator-product-grid" aria-label="Loading current best-value Viator cruise excursions">{[0, 1, 2, 3].map((item) => <div className="viator-card-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}</div>;

  if (failed || !data?.products.length) return <div className="featured-deals-fallback"><p>Live deals are temporarily unavailable.</p><Link href="/ports">Choose a port to compare current excursions →</Link></div>;

  return <div className="viator-product-grid featured-viator-grid">
    {data.products.map((product) => {
      const priceUnit = viatorPriceUnitLabel(product.pricingPackageType);
      return <a className="viator-product-card" href={product.productUrl} target="_blank" rel="sponsored nofollow noopener" key={product.productCode} aria-label={`${product.title} in ${product.portName}, opens on Viator`}>
      <div className="viator-card-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
        <b className="featured-value-badge">Best value</b>
        {product.likelyToSellOut && <span>Likely to sell out</span>}
      </div>
      <div className="viator-card-body"><span className="featured-port-link">{product.portName}</span><h3>{product.title}</h3><div className="viator-card-features"><span>◷ {product.duration}</span>{product.freeCancellation && <span className="free-cancel">✓ Free cancellation</span>}</div><div className="viator-card-rating">{product.rating !== null ? <><b>{product.rating.toFixed(1)}</b><span aria-hidden="true">★</span><small>({product.reviewCount.toLocaleString()})</small></> : <small>New on Viator</small>}</div><div className="viator-card-price"><span>from</span>{product.priceBeforeDiscount && <del>{currency(product.priceBeforeDiscount, product.currency)}</del>}<strong>{currency(product.price, product.currency)}</strong>{priceUnit && <small>{priceUnit}</small>}</div></div>
    </a>;
    })}
  </div>;
}
