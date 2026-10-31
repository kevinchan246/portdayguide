export const PINTEREST_ORIGIN = "https://portdayguide.com";

// An editorial list, not the site's entire article inventory. Keep GUIDs and
// publishedAt stable after publication: changing a date is not a new resource.
export const PINTEREST_ITEMS = Object.freeze([
  Object.freeze({
    id: "osaka-castle-from-port-v1",
    title: "Osaka cruise port to Osaka Castle: the walk matters",
    description: "From a confirmed Tempozan berth, plan the Chuo Line, the park walk and the decision to enter the keep before your ship's return deadline. Osaka Castle photograph by Takipoint123 (August 2024); full source, changes and CC BY-SA 4.0 license, also applying to this Pin composition, linked from the guide. Includes an optional affiliate guided-walk link, not port pickup.",
    path: "/blog/osaka-cruise-port-to-castle",
    anchor: "castle-approach",
    imagePath: "/media/share/osaka-castle-from-port.png",
    publishedAt: "2026-10-20T13:46:33Z",
  }),
  Object.freeze({
    id: "lgb-correct-cruise-port-v1",
    title: "Long Beach Airport to your cruise: Long Beach or San Pedro?",
    description: "Flying into LGB? Match Carnival Long Beach or San Pedro to the correct address before comparing taxi, rideshare and reserved transfers. Airport photograph by Melikamp (2009); source, changes and CC BY-SA 3.0 license, also applying to this Pin composition, linked from the guide. The guide includes affiliate transfer links.",
    path: "/blog/long-beach-airport-to-cruise-port",
    anchor: "correct-port",
    imagePath: "/media/share/lgb-correct-cruise-port.png",
    publishedAt: "2026-10-15T14:00:23Z",
  }),
  Object.freeze({
    id: "tokyo-yokohama-transfer-checklist-v1",
    title: "Tokyo hotel to Yokohama cruise port: departure checklist",
    description: "Check your exact Yokohama terminal, count travelers and bags, and confirm your hotel pickup and cruise check-in time. Open the free departure checklist before comparing train, taxi or private transfer options. PortdayGuide's guide includes affiliate booking links.",
    path: "/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal",
    anchor: "tokyo-transfer-checklist",
    imagePath: "/media/share/tokyo-yokohama-transfer-checklist.png",
    publishedAt: "2026-09-22T03:45:00Z",
  }),
  Object.freeze({
    id: "cozumel-whole-party-taxi-budget-v1",
    title: "Cozumel taxi budget: compare the cost for your whole group",
    description: "Budget both rides, every vehicle and any admission or waiting charges. Use the free calculator to compare your confirmed taxi quotes with a private-driver quote for the same people and route. It does not fetch live fares. PortdayGuide's guide includes affiliate booking links.",
    path: "/ports/cozumel/taxi-rates",
    anchor: "transport-budget-title",
    imagePath: "/media/share/cozumel-whole-party-taxi-budget.png",
    publishedAt: "2026-09-22T03:45:00Z",
  }),
  Object.freeze({
    id: "cozumel-scenic-taxi-budget-v1",
    title: "Cozumel cruise port taxi costs: plan your beach day budget",
    description: "Planning a Cozumel beach day? Compare return taxi costs for your whole group, vehicle count and admission with our free budget tool. Enter confirmed quotes; it does not fetch live fares. Photo-based illustration. PortdayGuide's guide includes affiliate booking links.",
    path: "/ports/cozumel/taxi-rates",
    anchor: "transport-budget-title",
    imagePath: "/media/share/cozumel-scenic-taxi-budget.png",
    publishedAt: "2026-09-30T22:54:43Z",
  }),
  Object.freeze({
    id: "tokyo-yokohama-scenic-transfer-v1",
    title: "Tokyo to Yokohama cruise terminal: plan your hotel transfer",
    description: "Getting from a Tokyo hotel to Yokohama cruise port? Check your exact terminal, travelers, luggage, pickup and cruise check-in time with our free departure checklist, then compare transport options. Photo-based illustration. PortdayGuide's guide includes affiliate booking links.",
    path: "/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal",
    anchor: "tokyo-transfer-checklist",
    imagePath: "/media/share/tokyo-yokohama-scenic-transfer.png",
    publishedAt: "2026-09-30T22:54:43Z",
  }),
  Object.freeze({
    id: "alaska-one-way-vs-round-trip-v1",
    title: "Alaska cruise: one way or round trip?",
    description: "Compare the airports, Whittier or Seward connection and whole-party cost before choosing your Alaska cruise. Includes an illustrative break-even calculation, not live fares. Whittier photograph by Laura Alier; source and license linked from the guide. The guide includes an affiliate transfer link.",
    path: "/blog/alaska-one-way-vs-round-trip",
    anchor: "whole-party-cost",
    imagePath: "/media/share/alaska-one-way-vs-round-trip.png",
    publishedAt: "2026-10-08T13:30:07Z",
  }),
  Object.freeze({
    id: "hobby-galveston-three-rides-v1",
    title: "Hobby airport to Galveston: plan all three cruise transfers",
    description: "Flying into HOU before your cruise? Plan the airport-to-hotel ride, hotel-to-terminal transfer and airport ride home. Compare four-person shuttle costs with complete vehicle quotes. Terminal 10 photograph by Larry D. Moore; source and license linked from the guide. The guide includes an affiliate transfer link.",
    path: "/blog/hobby-airport-to-galveston-cruise",
    anchor: "three-rides",
    imagePath: "/media/share/hobby-galveston-three-rides.png",
    publishedAt: "2026-10-13T13:53:00Z",
  }),
]);

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
  })[character]);
}

function claimedUrl(path) {
  const url = new URL(path, PINTEREST_ORIGIN);
  if (url.origin !== PINTEREST_ORIGIN || url.username || url.password || url.search || url.hash) {
    throw new Error("Pinterest feed resources must use clean URLs on the claimed domain.");
  }
  return url;
}

export function pinterestDestination(item) {
  const url = claimedUrl(item.path);
  url.searchParams.set("utm_source", "pinterest");
  url.searchParams.set("utm_medium", "organic_social");
  url.searchParams.set("utm_campaign", "portdayguide_guides");
  url.searchParams.set("utm_content", item.id);
  url.hash = item.anchor;
  return url.toString();
}

export function buildPinterestFeed(items = PINTEREST_ITEMS) {
  const ids = new Set();
  const entries = items.map((item) => {
    if (!/^[a-z0-9-]+$/.test(item.id) || ids.has(item.id)) throw new Error("Pinterest item IDs must be unique and stable.");
    ids.add(item.id);
    if (!item.title || item.title.length > 100 || !item.description || item.description.length > 500) {
      throw new Error("Pinterest items need a title of at most 100 and a description of at most 500 characters.");
    }
    if (!/^[a-z0-9-]+$/.test(item.anchor)) throw new Error("Pinterest items need an explicit section anchor.");
    const published = new Date(item.publishedAt);
    if (!Number.isFinite(published.valueOf())) throw new Error("Pinterest items need a valid publication date.");
    const image = claimedUrl(item.imagePath);
    if (!image.pathname.startsWith("/media/share/") || !image.pathname.endsWith(".png")) throw new Error("Pinterest items require an owned share image.");
    return `    <item>
      <guid isPermaLink="false">${escapeXml(`${PINTEREST_ORIGIN}/pins/${item.id}`)}</guid>
      <title>${escapeXml(item.title)}</title>
      <description>${escapeXml(item.description)}</description>
      <link>${escapeXml(pinterestDestination(item))}</link>
      <pubDate>${published.toUTCString()}</pubDate>
      <media:content url="${escapeXml(image.toString())}" type="image/png" medium="image" width="1000" height="1500" />
    </item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>PortdayGuide cruise transport checklists</title>
    <link>${PINTEREST_ORIGIN}</link>
    <description>Useful cruise transport checklists and budget tools from PortdayGuide.</description>
    <language>en-US</language>
${entries.join("\n")}
  </channel>
</rss>\n`;
}
