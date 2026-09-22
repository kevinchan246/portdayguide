"use client";

import { useEffect, useMemo, useState } from "react";
import { loadViatorProducts } from "@/lib/viator-client";
import { viatorPriceUnitLabel, type ViatorProductsPayload } from "@/lib/viator";
import { osakaExcursionTiming, osakaIndependentPlans } from "@/lib/osaka-planning";
import osakaStyles from "./OsakaPlanning.module.css";

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
  const isOsaka = portSlug === "osaka";

  useEffect(() => {
    loadViatorProducts(portSlug)
      .then(setData)
      .catch(() => setFailed(true));
  }, [portSlug]);

  const recommendationMap = useMemo(() => new Map((data?.recommendations || []).map((recommendation) => [normalize(recommendation.highlight), recommendation])), [data]);
  const visibleItems = useMemo(() => {
    // Osaka's independent directions remain useful even when the API has no match.
    if (isOsaka) return items;
    if (!data || !data.recommendations?.length) return items;
    return items.filter((item) => recommendationMap.has(normalize(item.name)));
  }, [data, items, recommendationMap, isOsaka]);

  return <>
    {isOsaka && <aside className={osakaStyles.intro} aria-labelledby="osaka-booking-window">
      <h3 id="osaka-booking-window">Match the activity to your actual time ashore</h3>
      <p>Our 8-hour example allows <strong>3h 40m for activities</strong>: 8 hours minus two 55-minute city-transfer allowances and a 150-minute ship-side margin. The 6-hour version leaves <strong>1h 40m</strong>. These are planning allowances, not measured journey times; check-in, queues and a different meeting point can reduce them.</p>
      <p>A 5–7-hour tour does not fit that 8-hour city example. Choose one shorter city experience, or use a longer call with a separately confirmed return plan. Kyoto needs its own round-trip plan.</p>
      <p><strong>Start at the right berth:</strong> the routes below start at Osakako station for Tempozan. Japan&apos;s official port guide lists Osakako on the Chuo Line as the nearby station. Confirm your terminal exit and walking route with the ship; another berth may need different first-mile transport.</p>
      <div className={osakaStyles.sources}><a href="https://www.mlit.go.jp/kankocho/cruise/detail/029/index.html" target="_blank" rel="noopener noreferrer">Official Osaka port access ↗</a><a href="https://subway.osakametro.co.jp/en/guide/routemap.php" target="_blank" rel="noopener noreferrer">Osaka Metro route map ↗</a><a href="https://subway.osakametro.co.jp/en/station_guide/C/c11/index.php" target="_blank" rel="noopener noreferrer">Osakako station and access ↗</a></div>
    </aside>}
    <div className="activity-excursion-grid">
      {visibleItems.map((item, index) => {
        const match = recommendationMap.get(normalize(item.name));
        const product = match?.product;
        const independent = isOsaka ? osakaIndependentPlans[item.name] : undefined;
        const timing = isOsaka && product ? osakaExcursionTiming(item.name, product.duration) : undefined;
        const priceUnit = product ? viatorPriceUnitLabel(product.pricingPackageType) : null;
        return <article className="activity-excursion-card" data-activity-excursion-card key={item.name}>
          <div className="activity-editorial">
            <div className="activity-kicker"><span>0{index + 1}</span><small>{independent?.priority ?? item.priority}</small></div>
            <h3>{item.name}</h3>
            <p>{independent?.note ?? item.note}</p>
            {independent ? <>
              <details className={osakaStyles.route}><summary>{item.name === "Kyoto" ? "Plan the complete Kyoto round trip" : `How to reach ${item.name} from Tempozan`}</summary><p>{independent.route}</p></details>
              <a href={independent.href} target="_blank" rel="noopener noreferrer">{independent.linkLabel} <span aria-hidden="true">↗</span></a>
            </> : <a href="#overview">Plan it independently <span aria-hidden="true">→</span></a>}
          </div>

          {!data && !failed && <div className="activity-match-skeleton" aria-label={`Loading matched Viator excursion for ${item.name}`}><span /><div><i /><i /><i /></div></div>}

          {product && <div className="activity-live-match" data-live-excursion-match data-affiliate-placement="activity-match" data-affiliate-product={product.productCode}>
            <a className="activity-match-image" href={product.productUrl} target="_blank" rel="sponsored nofollow noopener" aria-label={`${product.title}, opens on Viator`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.imageUrl} alt={product.imageAlt} loading="lazy" />
              <span>{timing?.label ?? "Recommended excursion"}</span>
            </a>
            <div className="activity-match-copy">
              <small>{timing ? `Check the ${item.name} meeting point` : `A close match for ${item.name}`}</small>
              <a href={product.productUrl} target="_blank" rel="sponsored nofollow noopener"><h4>{product.title}</h4></a>
              <div className="activity-match-facts">
                <span>◷ {product.duration}</span>
                {product.freeCancellation && <span className="free-cancel">✓ Free cancellation</span>}
                {product.rating !== null ? <span><b>{product.rating.toFixed(1)} ★</b> ({product.reviewCount.toLocaleString()})</span> : <span>New on Viator</span>}
              </div>
              {timing && <p className={osakaStyles.qualification} data-status={timing.status}>{timing.note}</p>}
              <div className="activity-match-action"><div><small>From</small><strong>{currency(product.price, product.currency)}</strong>{priceUnit && <span>{priceUnit}</span>}</div><a href={product.productUrl} target="_blank" rel="sponsored nofollow noopener">{timing ? "Check tour details" : "View excursion"} <span aria-hidden="true">↗</span></a></div>
            </div>
          </div>}

        </article>;
      })}
    </div>

    {data?.destinationUrl && <div className="combined-excursion-footer"><p>Before booking, check the meeting point, duration, accessibility, cancellation terms, and allow enough time to return to your ship.</p><a href={data.destinationUrl} target="_blank" rel="sponsored nofollow noopener">View more {portName} shore excursions on Viator ↗</a></div>}
  </>;
}
