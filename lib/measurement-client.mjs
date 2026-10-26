import { affiliateSourceFromSearch } from "./affiliate-events.mjs";
import { validateMeasurementEvent } from "./planning-events.mjs";

/** One in-memory sender per loaded document; no persistent or visitor identifier. */
export function createMeasurementClient({ location, navigator, document, fetch, now = Date.now }) {
  const seen = new Set();
  let lastClick = "";
  let lastClickAt = 0;
  return (value) => {
    if (location.hostname !== "portdayguide.com" || navigator.doNotTrack === "1" || navigator.globalPrivacyControl) return false;
    const payload = validateMeasurementEvent({ ...value,
      page: location.pathname.replace(/\/$/, "") || "/",
      source: affiliateSourceFromSearch(location.search, document.referrer),
    });
    if (!payload) return false;
    const body = JSON.stringify(payload);
    if (payload.type === "click") {
      const time = now();
      if (body === lastClick && time - lastClickAt < 750) return false;
      lastClick = body;
      lastClickAt = time;
    } else {
      // Query changes, React remounts and repeat completion do not inflate a page's count.
      const key = `${payload.type}:${payload.page}`;
      if (seen.has(key)) return false;
      seen.add(key);
    }
    // Best effort, no retry: neither tracking failure nor navigation is blocked.
    try {
      void fetch("/.netlify/functions/affiliate-click", {
        method: "POST", headers: { "Content-Type": "application/json" }, body,
        keepalive: true, credentials: "omit", referrerPolicy: "origin",
      }).catch(() => {});
    } catch { /* Tracking must never break a tool or link. */ }
    return true;
  };
}

let client;
export function trackMeasurement(value) {
  if (typeof window === "undefined") return;
  client ??= createMeasurementClient({ location: window.location, navigator, document, fetch: window.fetch.bind(window) });
  client(value);
}
