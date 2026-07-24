"use client";

import { useEffect, useMemo, useState } from "react";
import { loadViatorProducts } from "@/lib/viator-client";
import { viatorPriceUnitLabel, type ViatorProductsPayload } from "@/lib/viator";

type EditorialPick = {
  name: string;
  note: string;
  priority: string;
};

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

function currency(value: number, code: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: code, maximumFractionDigits: value % 1 ? 2 : 0 }).format(value);
}

export function TopThingsExcursions({ portSlug, portName, items }: { portSlug: string; portName: string; items: EditorialPick[] }) {
  const [data, setData] = useState<ViatorProductsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadViatorProducts(portSlug)
      .then(setData)
      .catch(() => setFailed(true));
  }, [portSlug]);

  const recommendationMap = useMemo(() => new Map((data?.recommendations || []).map((recommendation) => [normalize(recommendation.highlight), recommendation])), [data]);
  const visibleItems = useMemo(() => {
    if (!data || !data.recommendations?.length) return items;
    return items.filter((item) => recommendationMap.has(normalize(item.name)));
  }, [data, items, recommendationMap]);

  return <>
    <div className="activity-excursion-grid">
      {visibleItems.map((item, index) => {
        const match = recommendationMap.get(normalize(item.name));
        const product = match?.product;
        const priceUnit = product ? viatorPriceUnitLabel(product.pricingPackageType) : null;
        return <article className="activity-excursion-card" data-activity-excursion-card key={item.name}>
          <div className="activity-editorial">
            <div className="activity-kicker"><span>0{index + 1}</span><small>{item.priority}</small></div>
            <h3>{item.name}</h3>
            <p>{item.note}</p>
            <a href="#overview">Plan it independently <span aria-hidden="true">→</span></a>
          </div>

          {!data && !failed && <div className="activity-match-skeleton" aria-label={`Loading matched Viator excursion for ${item.name}`}><span /><div><i /><i /><i /></div></div>}

          {product && <div className="activity-live-match" data-live-excursion-match>
            <a className="activity-match-image" href={product.productUrl} target="_blank" rel="sponsored nofollow noopener" aria-label={`${product.title}, opens on Viator`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
              <span>Recommended excursion</span>
            </a>
            <div className="activity-match-copy">
              <small>A close match for {item.name}</small>
              <a href={product.productUrl} target="_blank" rel="sponsored nofollow noopener"><h4>{product.title}</h4></a>
              <div className="activity-match-facts">
                <span>◷ {product.duration}</span>
                {product.freeCancellation && <span className="free-cancel">✓ Free cancellation</span>}
                {product.rating !== null ? <span><b>{product.rating.toFixed(1)} ★</b> ({product.reviewCount.toLocaleString()})</span> : <span>New on Viator</span>}
              </div>
              <div className="activity-match-action"><div><small>From</small><strong>{currency(product.price, product.currency)}</strong>{priceUnit && <span>{priceUnit}</span>}</div><a href={product.productUrl} target="_blank" rel="sponsored nofollow noopener">View excursion <span aria-hidden="true">↗</span></a></div>
            </div>
          </div>}

        </article>;
      })}
    </div>

    {data?.destinationUrl && <div className="combined-excursion-footer"><p>Before booking, check the meeting point, duration, accessibility, cancellation terms, and allow enough time to return to your ship.</p><a href={data.destinationUrl} target="_blank" rel="sponsored nofollow noopener">View more {portName} shore excursions on Viator ↗</a></div>}
  </>;
}
