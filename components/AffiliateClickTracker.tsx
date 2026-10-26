"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { affiliateLinkEvent, affiliateSourceFromSearch } from "@/lib/affiliate-events.mjs";
import { trackMeasurement } from "@/lib/measurement-client.mjs";

// Event delegation also covers cards loaded after hydration and client-side navigation.
export function AffiliateClickTracker() {
  const pathname = usePathname();
  useEffect(() => { trackMeasurement({ type: "page_arrival" }); }, [pathname]);
  useEffect(() => {
    if (window.location.hostname !== "portdayguide.com") return;
    const track = (event: MouseEvent) => {
      if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
      if ((event.type === "click" && event.button !== 0) || (event.type === "auxclick" && event.button !== 1)) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[rel~="sponsored"]') : null;
      if (!link) return;
      const card = link.closest<HTMLElement>("[data-affiliate-placement]");
      const payload = affiliateLinkEvent(link.href, window.location.pathname.replace(/\/$/, "") || "/", card?.dataset.affiliatePlacement || "other-link", card?.dataset.affiliateProduct, affiliateSourceFromSearch(window.location.search, document.referrer));
      if (!payload) return;
      trackMeasurement(payload);
    };
    document.addEventListener("click", track, true);
    document.addEventListener("auxclick", track, true);
    return () => {
      document.removeEventListener("click", track, true);
      document.removeEventListener("auxclick", track, true);
    };
  }, []);
  return null;
}
