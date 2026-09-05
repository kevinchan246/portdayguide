import { profilesBySlug, type PortSlug } from "@/lib/shorepath";
import { portIntentGuides, type PortIntentGuide } from "@/lib/port-intent-guides";
import type { AlaskaViatorProductCard, AlaskaViatorProductsPayload, FeaturedViatorProductCard, FeaturedViatorProductsPayload, ViatorHighlightRecommendation, ViatorPricingPackageType, ViatorProductCard, ViatorProductsPayload } from "@/lib/viator";

const PRODUCTION_API_ROOT = "https://api.viator.com/partner";
const SANDBOX_API_ROOT = "https://api.sandbox.viator.com/partner";
const DESTINATION_CACHE_MS = 7 * 24 * 60 * 60 * 1000;
const PRODUCT_CACHE_MS = 30 * 60 * 1000;

type Destination = {
  destinationId: number;
  name: string;
  type?: string;
  parentDestinationId?: number;
  destinationUrl?: string;
};

type ViatorImage = {
  caption?: string;
  isCover?: boolean;
  variants?: Array<{ width: number; height: number; url: string }>;
};

type ViatorProduct = {
  productCode: string;
  title?: string;
  description?: string;
  images?: ViatorImage[];
  reviews?: { totalReviews?: number; combinedAverageRating?: number };
  duration?: {
    fixedDurationInMinutes?: number;
    variableDurationFromMinutes?: number;
    variableDurationToMinutes?: number;
    unstructuredDuration?: string;
  };
  pricing?: {
    currency?: string;
    summary?: { fromPrice?: number; fromPriceBeforeDiscount?: number };
  };
  pricingPackageType?: string;
  flags?: string[];
  productUrl?: string;
};

function pricingPackageTypeFromValue(value: unknown): ViatorPricingPackageType | null {
  const packageTypes = new Set<ViatorPricingPackageType>();
  const visit = (value: unknown, depth = 0) => {
    if (depth > 8 || value === null || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }
    Object.entries(value as Record<string, unknown>).forEach(([key, nested]) => {
      if (key === "pricingPackageType" && (nested === "PER_PERSON" || nested === "UNIT")) packageTypes.add(nested);
      else visit(nested, depth + 1);
    });
  };
  visit(value);
  return packageTypes.size === 1 ? [...packageTypes][0] : null;
}

function pricingPackageTypeFromProduct(product: ViatorProduct): ViatorPricingPackageType | null {
  return pricingPackageTypeFromValue(product);
}

let destinationCache: { expiresAt: number; items: Destination[] } | null = null;
const productCache = new Map<string, { expiresAt: number; payload: ViatorProductsPayload }>();
let featuredCache: { expiresAt: number; payload: FeaturedViatorProductsPayload } | null = null;
let alaskaPillarCache: { expiresAt: number; payload: AlaskaViatorProductsPayload } | null = null;

function configuredViator() {
  const requestedRoot = process.env.VIATOR_API_ROOT?.trim();
  return {
    apiKey: process.env.VIATOR_API_KEY?.trim(),
    apiRoot: requestedRoot === SANDBOX_API_ROOT ? SANDBOX_API_ROOT : PRODUCTION_API_ROOT,
  };
}

const destinationAliases: Record<string, string[]> = {
  philipsburg: ["St Maarten", "Philipsburg"],
  "george-town-grand-cayman": ["Grand Cayman", "George Town"],
  "amber-cove": ["Puerto Plata", "Amber Cove"],
  "oranjestad-aruba": ["Aruba", "Oranjestad"],
  "willemstad-curacao": ["Curacao", "Willemstad"],
  "kralendijk-bonaire": ["Bonaire", "Kralendijk"],
  castries: ["St Lucia", "Castries"],
  "st-johns-antigua": ["Antigua", "St John's"],
  basseterre: ["St Kitts", "Basseterre"],
  "road-town-tortola": ["Tortola", "Road Town"],
  "st-georges-grenada": ["Grenada", "St George's"],
  "roseau-dominica": ["Dominica", "Roseau"],
  "icy-strait-point": ["Hoonah", "Icy Strait Point"],
  "victoria-bc": ["Victoria", "British Columbia"],
  "civitavecchia-rome": ["Civitavecchia", "Rome"],
  "livorno-florence": ["Livorno", "Florence"],
  "piraeus-athens": ["Piraeus", "Athens"],
  "yokohama-tokyo": ["Yokohama", "Tokyo"],
  "keelung-taipei": ["Keelung", "Taipei"],
  "laem-chabang-bangkok": ["Laem Chabang", "Bangkok"],
  "phu-my-ho-chi-minh-city": ["Phu My", "Ho Chi Minh City"],
  "chan-may-hue-da-nang": ["Chan May", "Da Nang", "Hue"],
  "benoa-bali": ["Benoa", "Bali"],
};

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

function apiHeaders(apiKey: string, includeContentType = false) {
  return {
    "Accept-Language": "en-US",
    Accept: "application/json;version=2.0",
    "exp-api-key": apiKey,
    ...(includeContentType ? { "Content-Type": "application/json;version=2.0" } : {}),
  };
}

async function viatorFetch(url: string, init: RequestInit) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(9000) });
  if (!response.ok) throw new Error(`Viator request failed with status ${response.status}`);
  return response;
}

async function getDestinations(apiRoot: string, apiKey: string) {
  if (destinationCache && destinationCache.expiresAt > Date.now()) return destinationCache.items;
  const response = await viatorFetch(`${apiRoot}/destinations`, { headers: apiHeaders(apiKey) });
  const data = await response.json() as { destinations?: Destination[] };
  const items = Array.isArray(data.destinations) ? data.destinations : [];
  if (!items.length) throw new Error("Viator returned no destinations");
  destinationCache = { expiresAt: Date.now() + DESTINATION_CACHE_MS, items };
  return items;
}

function destinationForPort(destinations: Destination[], slug: string, name: string, country: string) {
  const byId = new Map(destinations.map((item) => [item.destinationId, item]));
  const aliases = destinationAliases[slug] || [name.replace(/\s*\(.+\)\s*$/, ""), name];
  const countryName = normalize(country);
  const ancestorNames = (item: Destination) => {
    const names: string[] = [];
    let parent = item.parentDestinationId ? byId.get(item.parentDestinationId) : undefined;
    for (let depth = 0; parent && depth < 8; depth += 1) {
      names.push(normalize(parent.name));
      parent = parent.parentDestinationId ? byId.get(parent.parentDestinationId) : undefined;
    }
    return names;
  };

  const scored = destinations.map((item) => {
    const itemName = normalize(item.name);
    let score = 0;
    aliases.forEach((alias, index) => {
      const candidate = normalize(alias);
      if (itemName === candidate) score = Math.max(score, 1000 - index * 60);
      else if (itemName.startsWith(candidate) || candidate.startsWith(itemName)) score = Math.max(score, 720 - index * 40);
      else if (itemName.includes(candidate) || candidate.includes(itemName)) score = Math.max(score, 520 - index * 30);
    });
    if (countryName && ancestorNames(item).some((ancestor) => ancestor === countryName || ancestor.includes(countryName))) score += 120;
    if (["CITY", "TOWN", "ISLAND", "VILLAGE"].includes(item.type || "")) score += 15;
    return { item, score };
  }).filter(({ score }) => score >= 500).sort((a, b) => b.score - a.score);

  return scored[0]?.item;
}

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours} hr${hours === 1 ? "" : "s"}${remainder ? ` ${remainder} min` : ""}`;
}

function durationLabel(duration: ViatorProduct["duration"]) {
  if (!duration) return "Duration varies";
  if (duration.fixedDurationInMinutes) return formatMinutes(duration.fixedDurationInMinutes);
  if (duration.variableDurationFromMinutes && duration.variableDurationToMinutes) {
    if (duration.variableDurationFromMinutes === duration.variableDurationToMinutes) return formatMinutes(duration.variableDurationFromMinutes);
    return `${formatMinutes(duration.variableDurationFromMinutes)}–${formatMinutes(duration.variableDurationToMinutes)}`;
  }
  return duration.unstructuredDuration || "Duration varies";
}

function bestImage(images: ViatorImage[] | undefined) {
  const image = images?.find((candidate) => candidate.isCover) || images?.[0];
  const variants = [...(image?.variants || [])].sort((a, b) => Math.abs(a.width - 720) - Math.abs(b.width - 720));
  return { url: variants[0]?.url || "", alt: image?.caption || "Viator shore excursion" };
}

function toCard(product: ViatorProduct): ViatorProductCard | null {
  const summary = product.pricing?.summary;
  const image = bestImage(product.images);
  if (!product.title || !product.productUrl || !image.url || typeof summary?.fromPrice !== "number" || !product.pricing?.currency) return null;
  const flags = product.flags || [];
  return {
    productCode: product.productCode,
    title: product.title,
    description: product.description || "",
    imageUrl: image.url,
    imageAlt: image.alt,
    duration: durationLabel(product.duration),
    freeCancellation: flags.includes("FREE_CANCELLATION"),
    likelyToSellOut: flags.includes("LIKELY_TO_SELL_OUT"),
    rating: typeof product.reviews?.combinedAverageRating === "number" ? product.reviews.combinedAverageRating : null,
    reviewCount: product.reviews?.totalReviews || 0,
    price: summary.fromPrice,
    priceBeforeDiscount: typeof summary.fromPriceBeforeDiscount === "number" && summary.fromPriceBeforeDiscount > summary.fromPrice ? summary.fromPriceBeforeDiscount : null,
    currency: product.pricing.currency,
    pricingPackageType: pricingPackageTypeFromProduct(product),
    productUrl: product.productUrl,
  };
}

const genericHighlightWords = new Set([
  "and", "bay", "city", "district", "downtown", "garden", "gardens", "historic", "island", "market", "mount", "old", "park", "point", "san", "saint", "st", "the", "town", "viewpoint", "viewpoints", "waterfront",
]);

function highlightRelevance(highlight: string, product: ViatorProductCard, searchPosition = 0) {
  const phrase = normalize(highlight);
  const title = normalize(product.title);
  const description = normalize(product.description);
  const combined = `${title} ${description}`;
  const words = phrase.split(" ").filter((word) => word.length >= 3 && !genericHighlightWords.has(word));
  const phraseInTitle = phrase.length >= 4 && title.includes(phrase);
  const phraseInDescription = phrase.length >= 4 && description.includes(phrase);
  const allWordsInTitle = words.length > 0 && words.every((word) => title.includes(word));
  const allWordsInCombined = words.length > 0 && words.every((word) => combined.includes(word));
  const direct = phraseInTitle || phraseInDescription || allWordsInTitle || allWordsInCombined;
  if (!direct) return null;

  let score = 0;
  if (phraseInTitle) score += 1200;
  else if (phraseInDescription) score += 850;
  if (allWordsInTitle) score += 500;
  else if (allWordsInCombined) score += 300;
  score += Math.max(0, 30 - searchPosition * 2);
  score += (product.rating || 0) * 8 + Math.log10(product.reviewCount + 1) * 10;
  return score;
}

async function searchHighlightProducts(apiRoot: string, apiKey: string, destinationId: number, campaign: string, highlight: string) {
  const response = await viatorFetch(`${apiRoot}/search/freetext?campaign-value=${encodeURIComponent(campaign)}`, {
    method: "POST",
    headers: apiHeaders(apiKey, true),
    body: JSON.stringify({
      searchTerm: highlight,
      productFiltering: {
        destination: String(destinationId),
        durationInMinutes: { from: 30, to: 480 },
        includeAutomaticTranslations: true,
      },
      productSorting: { sort: "DEFAULT" },
      searchTypes: [{ searchType: "PRODUCTS", pagination: { start: 1, count: 12 } }],
      currency: "USD",
    }),
  });
  const data = await response.json() as { products?: { results?: ViatorProduct[] } };
  return (data.products?.results || []).map(toCard).filter((product): product is ViatorProductCard => Boolean(product));
}

function chooseHighlightRecommendations(highlights: string[], searched: ViatorProductCard[][], fallbackProducts: ViatorProductCard[]) {
  const pairs = highlights.flatMap((highlight, highlightIndex) => {
    const candidates = [...searched[highlightIndex], ...fallbackProducts.filter((fallback) => !searched[highlightIndex].some((product) => product.productCode === fallback.productCode))];
    return candidates.flatMap((product, searchPosition) => {
      const score = highlightRelevance(highlight, product, searchPosition);
      return score === null ? [] : [{ highlight, highlightIndex, product, score }];
    });
  }).sort((a, b) => b.score - a.score);

  const assignedHighlights = new Set<number>();
  const assignedProducts = new Set<string>();
  const recommendations: ViatorHighlightRecommendation[] = [];
  for (const pair of pairs) {
    if (assignedHighlights.has(pair.highlightIndex) || assignedProducts.has(pair.product.productCode)) continue;
    assignedHighlights.add(pair.highlightIndex);
    assignedProducts.add(pair.product.productCode);
    recommendations.push({ highlight: pair.highlight, kind: "direct", product: pair.product });
  }
  return recommendations.sort((a, b) => highlights.indexOf(a.highlight) - highlights.indexOf(b.highlight));
}

async function addOfficialPricingUnits(apiRoot: string, apiKey: string, products: ViatorProductCard[]) {
  const uniqueProducts = [...new Map(products.map((product) => [product.productCode, product])).values()];
  const unresolved = uniqueProducts.filter((product) => product.pricingPackageType === null);
  if (!unresolved.length) return uniqueProducts;
  try {
    const response = await viatorFetch(`${apiRoot}/availability/schedules/bulk`, {
      method: "POST",
      headers: apiHeaders(apiKey, true),
      body: JSON.stringify({ productCodes: unresolved.map((product) => product.productCode) }),
    });
    const data = await response.json() as { availabilitySchedules?: Array<{ productCode?: string } & Record<string, unknown>> };
    const units = new Map((data.availabilitySchedules || []).flatMap((schedule) => {
      if (!schedule.productCode) return [];
      return [[schedule.productCode, pricingPackageTypeFromValue(schedule)] as const];
    }));
    return uniqueProducts.map((product) => ({ ...product, pricingPackageType: product.pricingPackageType ?? units.get(product.productCode) ?? null }));
  } catch {
    return uniqueProducts;
  }
}

function portDayScore(product: ViatorProduct, profile: (typeof profilesBySlug)[PortSlug]) {
  const text = normalize(`${product.title || ""} ${product.description || ""}`);
  const cruiseMatch = /\b(shore|cruise|port|terminal|pier|pickup|pick up)\b/.test(text);
  const highlightMatches = profile.highlights.reduce((total, highlight) => {
    const words = normalize(highlight).split(" ").filter((word) => word.length >= 4);
    return total + (words.some((word) => text.includes(word)) ? 1 : 0);
  }, 0);
  const rating = product.reviews?.combinedAverageRating || 0;
  const reviews = product.reviews?.totalReviews || 0;
  return (cruiseMatch ? 180 : 0) + highlightMatches * 35 + rating * 12 + Math.log10(reviews + 1) * 12 + ((product.flags || []).includes("FREE_CANCELLATION") ? 8 : 0);
}

async function loadProducts(apiRoot: string, apiKey: string, slug: string) {
  const cached = productCache.get(slug);
  if (cached && cached.expiresAt > Date.now()) return cached.payload;
  const profile = profilesBySlug[slug as PortSlug];
  if (!profile) return null;
  const destinations = await getDestinations(apiRoot, apiKey);
  const destination = destinationForPort(destinations, slug, profile.name, profile.country);
  if (!destination) return null;
  const campaign = `portdayguide-${slug}`.slice(0, 200);
  const responsePromise = viatorFetch(`${apiRoot}/products/search?campaign-value=${encodeURIComponent(campaign)}`, {
    method: "POST",
    headers: apiHeaders(apiKey, true),
    body: JSON.stringify({
      filtering: { destination: String(destination.destinationId), flags: ["FREE_CANCELLATION"], durationInMinutes: { from: 30, to: 480 } },
      sorting: { sort: "TRAVELER_RATING", order: "DESCENDING" },
      pagination: { start: 1, count: 30 },
      currency: "USD",
    }),
  });
  const highlightSearchesPromise = Promise.allSettled(profile.highlights.map((highlight) => searchHighlightProducts(apiRoot, apiKey, destination.destinationId, campaign, highlight)));
  const response = await responsePromise;
  const data = await response.json() as { products?: ViatorProduct[] };
  const baseProducts = [...(data.products || [])]
    .sort((a, b) => portDayScore(b, profile) - portDayScore(a, profile))
    .map(toCard)
    .filter((product): product is ViatorProductCard => Boolean(product))
    .slice(0, 12);
  const highlightSearches = (await highlightSearchesPromise).map((result) => result.status === "fulfilled" ? result.value : []);
  const recommendations = chooseHighlightRecommendations(profile.highlights, highlightSearches, baseProducts);
  const enriched = await addOfficialPricingUnits(apiRoot, apiKey, [...baseProducts, ...recommendations.map((item) => item.product)]);
  const enrichedByCode = new Map(enriched.map((product) => [product.productCode, product]));
  const products = baseProducts.map((product) => enrichedByCode.get(product.productCode) || product);
  const pricedRecommendations = recommendations.map((recommendation) => ({
    ...recommendation,
    product: enrichedByCode.get(recommendation.product.productCode) || recommendation.product,
  }));
  const payload: ViatorProductsPayload = {
    products,
    recommendations: pricedRecommendations,
    destinationName: destination.name,
    destinationUrl: destination.destinationUrl || "",
    campaign,
    updatedAt: new Date().toISOString(),
  };
  productCache.set(slug, { expiresAt: Date.now() + PRODUCT_CACHE_MS, payload });
  return payload;
}

async function loadIntentProducts(apiRoot: string, apiKey: string, guide: PortIntentGuide) {
  const cacheKey = `intent:${guide.urlPortSlug}:${guide.topic}`;
  const cached = productCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.payload;
  const profile = profilesBySlug[guide.sourcePortSlug as PortSlug];
  if (!profile) return null;
  const destinations = await getDestinations(apiRoot, apiKey);
  const destination = destinationForPort(destinations, guide.sourcePortSlug, profile.name, profile.country);
  if (!destination) return null;
  const searchQueries = guide.viator.searchQueries?.length ? guide.viator.searchQueries : [guide.viator.query];
  const searchResults = await Promise.allSettled(searchQueries.map((query) => searchHighlightProducts(apiRoot, apiKey, destination.destinationId, guide.viator.campaign, query)));
  const searched = [...new Map(searchResults
    .flatMap((result) => result.status === "fulfilled" ? result.value : [])
    .map((product) => [product.productCode, product])).values()];
  const queryWords = normalize(searchQueries.join(" ")).split(" ").filter((word) => word.length >= 3 && !genericHighlightWords.has(word));
  const matchTerms = (guide.viator.matchTerms || []).map(normalize);
  const excludeTerms = (guide.viator.excludeTerms || []).map(normalize);
  const urlTerms = (guide.viator.urlTerms || []).map(normalize);
  const intentRelevance = (product: ViatorProductCard) => {
    const title = normalize(product.title);
    const description = normalize(product.description);
    const productUrl = normalize(product.productUrl);
    if (urlTerms.length && !urlTerms.some((term) => productUrl.includes(term))) return null;
    if (excludeTerms.some((term) => title.includes(term))) return null;
    const titleMatches = matchTerms.filter((term) => title.includes(term));
    if (matchTerms.length && !titleMatches.length) return null;
    const queryTitleMatches = queryWords.filter((word) => title.includes(word)).length;
    const queryDescriptionMatches = queryWords.filter((word) => description.includes(word)).length;
    return bestValueScore(product) + titleMatches.length * 45 + queryTitleMatches * 16 + queryDescriptionMatches * 4;
  };
  const ranked = searched
    .flatMap((product) => {
      const score = intentRelevance(product);
      return score === null ? [] : [{ product, score }];
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
  const products = await addOfficialPricingUnits(apiRoot, apiKey, ranked.map(({ product }) => product));
  const payload: ViatorProductsPayload = {
    products,
    recommendations: [],
    destinationName: destination.name,
    destinationUrl: destination.destinationUrl || "",
    campaign: guide.viator.campaign,
    updatedAt: new Date().toISOString(),
  };
  productCache.set(cacheKey, { expiresAt: Date.now() + PRODUCT_CACHE_MS, payload });
  return payload;
}

function bestValueScore(product: ViatorProductCard) {
  const rating = product.rating || 0;
  const reviewConfidence = Math.min(4, Math.log10(product.reviewCount + 1));
  const discount = product.priceBeforeDiscount ? Math.min(.5, 1 - product.price / product.priceBeforeDiscount) : 0;
  return rating * 22 + reviewConfidence * 9 + (product.freeCancellation ? 7 : 0) + discount * 25 - Math.log2(product.price + 1) * 4.5;
}

async function loadFeaturedProducts(apiRoot: string, apiKey: string) {
  if (featuredCache && featuredCache.expiresAt > Date.now()) return featuredCache.payload;
  const slugs = ["cozumel", "nassau", "barcelona", "juneau", "singapore", "yokohama-tokyo"];
  await getDestinations(apiRoot, apiKey);
  const results = await Promise.allSettled(slugs.map((slug) => loadProducts(apiRoot, apiKey, slug)));
  const candidates = results.flatMap((result, index) => {
    if (result.status !== "fulfilled" || !result.value) return [];
    const profile = profilesBySlug[slugs[index] as PortSlug];
    return result.value.products.map((product) => ({ ...product, portName: profile.name, portSlug: profile.slug }));
  });
  const eligible = candidates.filter((product) => (product.rating || 0) >= 4.5 && product.reviewCount >= 20 && product.price <= 250);
  const pool = eligible.length >= 4 ? eligible : candidates;
  const bestPerPort = new Map<string, FeaturedViatorProductCard>();
  [...pool].sort((a, b) => bestValueScore(b) - bestValueScore(a)).forEach((product) => {
    if (!bestPerPort.has(product.portSlug)) bestPerPort.set(product.portSlug, product);
  });
  const products = [...bestPerPort.values()].sort((a, b) => bestValueScore(b) - bestValueScore(a)).slice(0, 4);
  const payload: FeaturedViatorProductsPayload = { products, updatedAt: new Date().toISOString() };
  featuredCache = { expiresAt: Date.now() + PRODUCT_CACHE_MS, payload };
  return payload;
}

const alaskaPillarTargets = [
  { portSlug: "juneau", portName: "Juneau", highlight: "Mendenhall Glacier" },
  { portSlug: "ketchikan", portName: "Ketchikan", highlight: "Misty Fjords" },
  { portSlug: "skagway", portName: "Skagway", highlight: "White Pass Railway" },
  { portSlug: "sitka", portName: "Sitka", highlight: "Fortress of the Bear" },
  { portSlug: "icy-strait-point", portName: "Icy Strait Point", highlight: "Whale watching" },
  { portSlug: "ketchikan", portName: "Ketchikan", highlight: "Totem Bight" },
] as const;

async function loadAlaskaPillarProducts(apiRoot: string, apiKey: string) {
  if (alaskaPillarCache && alaskaPillarCache.expiresAt > Date.now()) return alaskaPillarCache.payload;
  const destinations = await getDestinations(apiRoot, apiKey);
  const campaign = "portdayguide-alaska-cruise-ports";
  const searches = await Promise.allSettled(alaskaPillarTargets.map(async (target) => {
    const profile = profilesBySlug[target.portSlug as PortSlug];
    if (!profile) return null;
    const destination = destinationForPort(destinations, target.portSlug, profile.name, profile.country);
    if (!destination) return null;
    const products = await searchHighlightProducts(apiRoot, apiKey, destination.destinationId, campaign, target.highlight);
    const ranked = products
      .flatMap((product, searchPosition) => {
        const relevance = highlightRelevance(target.highlight, product, searchPosition);
        return relevance === null ? [] : [{ product, score: relevance + bestValueScore(product) }];
      })
      .sort((a, b) => b.score - a.score);
    if (!ranked[0]) return null;
    return { ...target, product: ranked[0].product, score: ranked[0].score };
  }));

  const candidates = searches
    .flatMap((result) => result.status === "fulfilled" && result.value ? [result.value] : [])
    .sort((a, b) => b.score - a.score);
  const uniqueCandidates = [...new Map(candidates.map((candidate) => [candidate.product.productCode, candidate])).values()];
  const selected: typeof uniqueCandidates = [];
  const selectedPorts = new Set<string>();

  for (const candidate of uniqueCandidates) {
    if (selectedPorts.has(candidate.portSlug)) continue;
    selected.push(candidate);
    selectedPorts.add(candidate.portSlug);
    if (selected.length === 4) break;
  }
  for (const candidate of uniqueCandidates) {
    if (selected.length === 4) break;
    if (selected.some((item) => item.product.productCode === candidate.product.productCode)) continue;
    selected.push(candidate);
  }

  const enriched = await addOfficialPricingUnits(apiRoot, apiKey, selected.map(({ product }) => product));
  const enrichedByCode = new Map(enriched.map((product) => [product.productCode, product]));
  const products: AlaskaViatorProductCard[] = selected.map((candidate) => ({
    ...(enrichedByCode.get(candidate.product.productCode) || candidate.product),
    portName: candidate.portName,
    portSlug: candidate.portSlug,
    highlight: candidate.highlight,
  }));
  const payload: AlaskaViatorProductsPayload = { products, updatedAt: new Date().toISOString() };
  alaskaPillarCache = { expiresAt: Date.now() + PRODUCT_CACHE_MS, payload };
  return payload;
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const slug = params.get("port") || "";
  const intent = params.get("intent") || "";
  const featured = params.get("featured") || "";
  if (!featured && !profilesBySlug[slug as PortSlug]) return Response.json({ error: "destination_not_found", message: "This port is not supported." }, { status: 404 });
  const { apiKey, apiRoot } = await configuredViator();
  if (!apiKey) return Response.json({ error: "not_configured", message: "Live Viator tours are not configured yet." }, { status: 503 });
  try {
    if (featured === "home") {
      const payload = await loadFeaturedProducts(apiRoot, apiKey);
      return Response.json(payload, { headers: { "Cache-Control": "public, max-age=900, s-maxage=1800, stale-while-revalidate=86400", "Netlify-Vary": "query" } });
    }
    if (featured === "alaska") {
      const payload = await loadAlaskaPillarProducts(apiRoot, apiKey);
      return Response.json(payload, { headers: { "Cache-Control": "public, max-age=900, s-maxage=1800, stale-while-revalidate=86400", "Netlify-Vary": "query" } });
    }
    if (featured) return Response.json({ error: "destination_not_found", message: "This featured collection is not supported." }, { status: 404 });
    if (intent) {
      const guide = portIntentGuides.find((candidate) => candidate.sourcePortSlug === slug && candidate.topic === intent);
      if (!guide) return Response.json({ error: "destination_not_found", message: "This intent guide is not supported." }, { status: 404 });
      const payload = await loadIntentProducts(apiRoot, apiKey, guide);
      if (!payload) return Response.json({ error: "destination_not_found", message: "Viator has no matching destination for this guide." }, { status: 404 });
      return Response.json(payload, { headers: { "Cache-Control": "public, max-age=900, s-maxage=1800, stale-while-revalidate=86400", "Netlify-Vary": "query" } });
    }
    const payload = await loadProducts(apiRoot, apiKey, slug);
    if (!payload) return Response.json({ error: "destination_not_found", message: "Viator has no matching destination for this port." }, { status: 404 });
    return Response.json(payload, { headers: { "Cache-Control": "public, max-age=900, s-maxage=1800, stale-while-revalidate=86400", "Netlify-Vary": "query" } });
  } catch (error) {
    console.error("Viator product lookup failed", error instanceof Error ? error.message : "Unknown error");
    return Response.json({ error: "temporarily_unavailable", message: "Live Viator tours are temporarily unavailable." }, { status: 503, headers: { "Retry-After": "60" } });
  }
}
