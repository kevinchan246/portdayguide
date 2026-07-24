"use client";

import { useEffect, useMemo, useState } from "react";
import { loadViatorProducts } from "@/lib/viator-client";
import type { ViatorProductsPayload } from "@/lib/viator";

export function PortTravelerPulse({ portSlug, portName }: { portSlug: string; portName: string }) {
  const [data, setData] = useState<ViatorProductsPayload | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadViatorProducts(portSlug)
      .then(setData)
      .catch(() => setFailed(true));
  }, [portSlug]);

  const pulse = useMemo(() => {
    const reviewed = (data?.products || []).slice(0, 4).filter((product) => product.rating !== null && product.reviewCount > 0);
    const reviewCount = reviewed.reduce((sum, product) => sum + product.reviewCount, 0);
    if (!reviewed.length || !reviewCount) return null;
    const weightedRating = reviewed.reduce((sum, product) => sum + (product.rating || 0) * product.reviewCount, 0) / reviewCount;
    const deepest = [...reviewed].sort((a, b) => b.reviewCount - a.reviewCount)[0];
    return { weightedRating, reviewCount, deepest };
  }, [data]);

  if (failed || (data && !pulse)) return null;
  if (!pulse) return <div className="traveler-pulse is-loading"><span>Live traveler signal</span><p>Loading current review data for shortlisted {portName} experiences…</p></div>;

  return <div className="traveler-pulse">
    <div><span>Live traveler signal</span><strong>{pulse.weightedRating.toFixed(1)}<small>/5</small></strong></div>
    <p>Weighted across <b>{pulse.reviewCount.toLocaleString()} Viator reviews</b> on the current four shortlisted experiences. <em>{pulse.deepest.title}</em> has the deepest review base.</p>
    <small>Tour ratings describe those listings—not the port as a whole. Verify the most recent reviews, pickup details, and date-specific terms on Viator.</small>
  </div>;
}
