"use client";

import { useEffect, useState } from "react";
import type { ExcursionIdea } from "@/lib/shorepath";
import { viatorPriceUnitLabel, type ViatorProductsPayload } from "@/lib/viator";
import { loadViatorProducts } from "@/lib/viator-client";

function currency(value: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}

export function ViatorProductCards({ portSlug, portName, fallback }: { portSlug: string; portName: string; fallback: ExcursionIdea[] }) {
  const [data, setData] = useState<ViatorProductsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadViatorProducts(portSlug)
      .then(setData)
      .catch(() => setFailed(true));
  }, [portSlug]);

  if (!data && !failed) return <div className="viator-product-grid" aria-label={`Loading live ${portName} Viator tours`}>{[0, 1, 2, 3].map((item) => <div className="viator-card-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}</div>;

  if (failed || !data?.products.length) return <div className="viator-fallback"><p>Live Viator listings are temporarily unavailable. These are planning categories, not live products or prices.</p><div className="guide-excursion-grid">{fallback.map((idea) => <article key={idea.title}><span>{idea.category.toUpperCase()}</span><h3>{idea.title}</h3><p>{idea.description}</p><div><small>◷ {idea.duration}</small><small>{idea.bestFor}</small></div></article>)}</div></div>;

  return <>
    <div className="viator-product-grid">
      {data.products.map((product) => {
        const priceUnit = viatorPriceUnitLabel(product.pricingPackageType);
        return <a className="viator-product-card" href={product.productUrl} target="_blank" rel="sponsored nofollow noopener" key={product.productCode} aria-label={`${product.title}, opens on Viator`}>
        <div className="viator-card-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
          {product.likelyToSellOut && <span>Likely to sell out</span>}
        </div>
        <div className="viator-card-body"><h3>{product.title}</h3><div className="viator-card-features"><span>◷ {product.duration}</span>{product.freeCancellation && <span className="free-cancel">✓ Free cancellation</span>}</div><div className="viator-card-rating">{product.rating !== null ? <><b>{product.rating.toFixed(1)}</b><span aria-hidden="true">★</span><small>({product.reviewCount.toLocaleString()})</small></> : <small>New on Viator</small>}</div><div className="viator-card-price"><span>from</span>{product.priceBeforeDiscount && <del>{currency(product.priceBeforeDiscount, product.currency)}</del>}<strong>{currency(product.price, product.currency)}</strong>{priceUnit && <small>{priceUnit}</small>}</div></div>
      </a>;
      })}
    </div>
    {data.destinationUrl && <div className="viator-all-link"><a href={data.destinationUrl} target="_blank" rel="sponsored nofollow noopener">View all {portName} experiences on Viator ↗</a></div>}
  </>;
}
