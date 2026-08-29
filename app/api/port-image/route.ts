import { portCoordinates, profilesBySlug, type PortSlug } from "@/lib/shorepath";
import type { PortImagePayload } from "@/lib/port-image";

type MetadataValue = { value?: string };
type CommonsImageInfo = {
  thumburl?: string;
  descriptionurl?: string;
  mime?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, MetadataValue>;
};
type CommonsPage = { title?: string; imageinfo?: CommonsImageInfo[] };

const imageCache = new Map<string, { expiresAt: number; payload: PortImagePayload }>();
const CACHE_MS = 7 * 24 * 60 * 60 * 1000;

function clean(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}

function scenicScore(page: CommonsPage, profile: (typeof profilesBySlug)[PortSlug]) {
  const info = page.imageinfo?.[0];
  if (!info?.thumburl || !info.descriptionurl || info.mime !== "image/jpeg" || !info.width || !info.height) return -Infinity;
  const ratio = info.width / info.height;
  if (info.width < 1200 || info.height < 650 || ratio < 1.28 || ratio > 2.65) return -Infinity;
  const metadata = info.extmetadata || {};
  const text = clean(`${page.title || ""} ${metadata.ImageDescription?.value || ""} ${metadata.Categories?.value || ""}`).toLowerCase();
  if (/\b(flag|logo|icon|map|diagram|drawing|poster|advert|menu|ticket|passport|document|screenshot|coat of arms|crest|seal|plaque|signage|floor plan|route map)\b/.test(text)) return -Infinity;
  const scenicWords = ["view", "panorama", "panoramic", "waterfront", "harbour", "harbor", "skyline", "beach", "bay", "coast", "seafront", "cityscape", "landscape", "old town", "aerial"];
  const placeWords = [profile.name, profile.country, ...profile.highlights].join(" ").toLowerCase().split(/[^a-z0-9]+/).filter((word) => word.length >= 5);
  const scenic = scenicWords.reduce((score, word) => score + (text.includes(word) ? 8 : 0), 0);
  const local = placeWords.reduce((score, word) => score + (text.includes(word) ? 3 : 0), 0);
  const resolution = Math.min(12, Math.log2((info.width * info.height) / 1_000_000 + 1) * 4);
  const aspect = Math.max(0, 10 - Math.abs(ratio - 1.7) * 8);
  return scenic + Math.min(local, 24) + resolution + aspect;
}

async function loadPortImage(slug: PortSlug) {
  const cached = imageCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) return cached.payload;
  const profile = profilesBySlug[slug];
  const [lat, lon] = portCoordinates[slug];
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    formatversion: "2",
    generator: "geosearch",
    ggsprimary: "all",
    ggsnamespace: "6",
    ggsradius: "10000",
    ggscoord: `${lat}|${lon}`,
    ggslimit: "50",
    prop: "imageinfo",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1800",
    origin: "*",
  });
  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params.toString()}`, {
    headers: { "Api-User-Agent": "PortdayGuide/1.0 (https://portdayguide.com/disclosure)" },
    signal: AbortSignal.timeout(9000),
  });
  if (!response.ok) throw new Error(`Commons request failed with status ${response.status}`);
  const data = await response.json() as { query?: { pages?: CommonsPage[] } };
  const page = [...(data.query?.pages || [])].sort((a, b) => scenicScore(b, profile) - scenicScore(a, profile))[0];
  const info = page?.imageinfo?.[0];
  if (!page || scenicScore(page, profile) === -Infinity || !info?.thumburl || !info.descriptionurl) throw new Error("No suitable local landscape photo found");
  const metadata = info.extmetadata || {};
  const description = clean(metadata.ImageDescription?.value || "");
  const artist = clean(metadata.Artist?.value || metadata.Credit?.value || "Wikimedia Commons contributor").slice(0, 100);
  const license = clean(metadata.LicenseShortName?.value || metadata.UsageTerms?.value || "Wikimedia Commons license");
  const payload: PortImagePayload = {
    imageUrl: info.thumburl,
    imagePageUrl: info.descriptionurl,
    alt: description && description.length <= 180 ? description : `Local scenery near ${profile.name}, ${profile.country}`,
    artist,
    license,
    licenseUrl: clean(metadata.LicenseUrl?.value || info.descriptionurl),
    source: "Wikimedia Commons",
  };
  imageCache.set(slug, { expiresAt: Date.now() + CACHE_MS, payload });
  return payload;
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("port") as PortSlug | null;
  if (!slug || !profilesBySlug[slug]) return Response.json({ error: "port_not_found" }, { status: 404 });
  try {
    const payload = await loadPortImage(slug);
    return Response.json(payload, { headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000", "Netlify-Vary": "query" } });
  } catch (error) {
    console.error("Port image lookup failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "temporarily_unavailable" }, { status: 503, headers: { "Retry-After": "60" } });
  }
}
