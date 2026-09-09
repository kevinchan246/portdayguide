"use client";

import { useEffect } from "react";
import { affiliateLinkEvent } from "@/lib/affiliate-events.mjs";

// Event delegation also covers cards loaded after hydration and client-side navigation.
export function AffiliateClickTracker() {
  useEffect(() => {
    if (window.location.hostname !== "portdayguide.com") return;
    let lastKey = "";
    let lastTime = 0;
    const track = (event: MouseEvent) => {
      if (navigator.doNotTrack === "1" || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return;
      if ((event.type === "click" && event.button !== 0) || (event.type === "auxclick" && event.button !== 1)) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[rel~="sponsored"]') : null;
      if (!link) return;
      const card = link.closest<HTMLElement>("[data-affiliate-placement]");
      const payload = affiliateLinkEvent(link.href, window.location.pathname.replace(/\/$/, "") || "/", card?.dataset.affiliatePlacement || "other-link", card?.dataset.affiliateProduct);
      if (!payload) return;
      const key = JSON.stringify(payload);
      const now = Date.now();
      if (lastKey === key && now - lastTime < 750) return;
      lastKey = key;
      lastTime = now;
      // Never intercept navigation or wait for analytics. No cookies or visitor IDs.
      void fetch("/.netlify/functions/affiliate-click", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: key,
        keepalive: true, credentials: "omit", referrerPolicy: "origin",
      }).catch(() => {});
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
