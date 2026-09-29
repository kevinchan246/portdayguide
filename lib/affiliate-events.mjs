export const AFFILIATE_STORE = "affiliate-clicks-v1";
const token = /^[a-zA-Z0-9_-]{1,120}$/;
const pagePath = /^\/(?:ports(?:\/[a-z0-9-]+){0,2}|blog(?:\/[a-z0-9-]+){0,2}|planner)?$/;
const acquisitionSources = new Set(["pinterest", "checklist", "ai-search"]);
const sourceTags = new Map([["pinterest", "pinterest"], ["checklist", "checklist"], ["chatgpt.com", "ai-search"]]);

export function normalizeAffiliateSource(value) {
  return acquisitionSources.has(value) ? value : "unspecified";
}

function sourceFromReferrer(referrer) {
  if (typeof referrer !== "string" || referrer.length > 4096 || !referrer) return "unspecified";
  try {
    const url = new URL(referrer);
    return url.protocol === "https:" && (url.hostname === "chatgpt.com" || url.hostname.endsWith(".chatgpt.com")) ? "ai-search" : "unspecified";
  } catch { return "unspecified"; }
}

/** Use only allowlisted current-page tags or a coarse recognized host; never retain raw inputs. */
export function affiliateSourceFromSearch(search, referrer = "") {
  if (typeof search !== "string" || search.length > 4096) return "unspecified";
  const values = new URLSearchParams(search).getAll("utm_source");
  if (values.length) return values.length === 1 ? sourceTags.get(values[0]) || "unspecified" : "unspecified";
  return sourceFromReferrer(referrer);
}

/** Keep only bounded, non-identifying dimensions. Never store raw URLs or query strings. */
export function validateAffiliateEvent(value) {
  if (!value || typeof value !== "object" || value.type !== "click") return null;
  if (typeof value.page !== "string" || value.page.length > 240 || !pagePath.test(value.page)) return null;
  if (![value.product, value.campaign, value.placement].every(item => typeof item === "string" && token.test(item))) return null;
  return { type: "click", page: value.page, product: value.product, campaign: value.campaign, placement: value.placement, source: normalizeAffiliateSource(value.source) };
}

export function affiliateLinkEvent(href, page, placement, productCode, source) {
  try {
    const url = new URL(href);
    if (url.protocol !== "https:" || !/(^|\.)viator\.com$/.test(url.hostname)) return null;
    if (!url.searchParams.get("pid")) return null;
    const code = url.pathname.startsWith("/tours/") ? url.pathname.match(/\/d\d+-([a-zA-Z0-9_-]+)\/?$/)?.[1] : null;
    return validateAffiliateEvent({ type: "click", page, product: productCode || code || "destination", campaign: url.searchParams.get("campaign") || "unspecified", placement, source });
  } catch { return null; }
}

export function summarizeAffiliateEvents(events) {
  const groups = new Map();
  for (const raw of events) {
    const event = validateAffiliateEvent(raw);
    if (!event) continue;
    const key = JSON.stringify([event.page, event.product, event.campaign, event.placement, event.source]);
    const row = groups.get(key) || { ...event, clicks: 0 };
    row.clicks += 1;
    groups.set(key, row);
  }
  return [...groups.values()].sort((a, b) => b.clicks - a.clicks);
}
