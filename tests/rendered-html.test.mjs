import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir, stat } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function render(path = "/") {
  const response = await worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  return response.text();
}

function visibleWordCount(html) {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--.*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text ? text.split(" ").length : 0;
}

test("renders a focused, search-first cruise homepage", async () => {
  const html = await render();
  assert.match(html, /Cruise Port Guides &amp; Shore Excursions \| PortdayGuide/i);
  assert.match(html, /Cruise port guides &amp; shore excursions/i);
  assert.match(html, /Search your cruise port/i);
  assert.match(html, /name="q"/i);
  assert.match(html, /Latest cruise port guides/i);
  assert.match(html, /4 best-value cruise excursions right now/i);
  assert.match(html, /Loading current best-value Viator cruise excursions/i);
  assert.match(html, /min read/i);
  assert.match(html, /\/media\/ports\/cozumel\.jpg/i);
  assert.match(html, /data-photo-source="Wikimedia Commons"/i);
  assert.doesNotMatch(html, /port-map-thumbnail/i);
  assert.match(html, /href="\/ports\/cozumel"/i);
  assert.match(html, /href="\/planner"/i);
  assert.doesNotMatch(html, /What a PortdayGuide page separates/i);
  assert.doesNotMatch(html, /See how the guides are researched/i);
  assert.match(html, /"@type":"WebSite"/i);
  assert.match(html, /"@type":"Organization"/i);
  assert.match(html, /"logo":"https:\/\/portdayguide\.com\/icon-512\.png"/i);
  assert.match(html, /<link rel="shortcut icon" href="https:\/\/portdayguide\.com\/favicon\.ico"/i);
  assert.match(html, /<link rel="apple-touch-icon" href="https:\/\/portdayguide\.com\/apple-touch-icon\.png"/i);
  assert.match(html, /<link rel="manifest" href="https:\/\/portdayguide\.com\/manifest\.webmanifest"/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/portdayguide\.com\/?"/i);
  assert.doesNotMatch(html, /https:\/\/www\.portdayguide\.com/i);
  assert.doesNotMatch(html, /Build my cruise plan/i);
  assert.doesNotMatch(html, /Port date/i);
});

test("renders the planner as a separate page", async () => {
  const html = await render("/planner");
  assert.match(html, /Free Cruise Port Day Planner \| PortdayGuide/i);
  assert.match(html, /Plan every port day/i);
  assert.match(html, /Build my cruise plan/i);
  assert.match(html, /Port date/i);
  assert.match(html, /Ship name/i);
  assert.match(html, /\(optional\)/i);
});

test("renders a search-friendly port guide with booking disclosure", async () => {
  const html = await render("/ports/cozumel");
  assert.match(html, /<title>Cozumel Cruise Port Guide: Terminals, Transport &amp; Excursions<\/title>/i);
  assert.match(html, /Cozumel Cruise Port Guide: Terminals, Transport, Map &amp; Top Excursions/i);
  assert.match(html, /Docking in Cozumel\? Find your cruise terminal/i);
  assert.match(html, /Punta Langosta Cruise Terminal/i);
  assert.match(html, /International Pier/i);
  assert.match(html, /Puerta Maya/i);
  assert.match(html, /href="\/ports\/cozumel\/which-cruise-terminal"/i);
  assert.match(html, /href="\/ports\/cozumel\/taxi-rates"/i);
  assert.match(html, /Top Things to Do &amp; Shore Excursions in (?:<!-- -->)?Cozumel/i);
  assert.match(html, /Affiliate disclosure/i);
  assert.match(html, /"@type":"BreadcrumbList"/i);
  assert.match(html, /"@type":"Article"/i);
  assert.match(html, /"@type":"FAQPage"/i);
  assert.match(html, /"articleSection":"Caribbean & Bahamas cruise port guides"/i);
  assert.match(html, /aria-label="Breadcrumb"/i);
  assert.match(html, /Cozumel(?:<!-- -->)? cruise port overview/i);
  assert.match(html, /Quick answer:/i);
  assert.match(html, /How to get around (?:<!-- -->)?Cozumel(?:<!-- -->)? cruise port/i);
  assert.match(html, /Things to do &amp; excursions/i);
  assert.equal((html.match(/data-activity-excursion-card="true"/gi) || []).length, 4);
  assert.match(html, /Loading matched Viator excursion for Chankanaab/i);
  assert.doesNotMatch(html, /Top (?:<!-- -->)?Cozumel(?:<!-- -->)? excursions to compare/i);
  assert.doesNotMatch(html, /href="#excursions"/i);
  assert.match(html, /Related (?:<!-- -->)?Caribbean &amp; Bahamas(?:<!-- -->)? cruise port guides/i);
  assert.match(html, /Plan with current sailing details/i);
  assert.match(html, /href="\/about"/i);
  assert.match(html, /Traveler takeaways/i);
  assert.match(html, /Loading current review data for shortlisted/i);
  assert.doesNotMatch(html, /Choose transport by return risk/i);
  assert.match(html, /OpenStreetMap contributors/i);
  assert.match(html, /Loading matched Viator excursion for/i);
  assert.match(html, /port-hero-photo/i);
  assert.match(html, /data-photo-source="Wikimedia Commons"/i);
  assert.doesNotMatch(html, />On this page</i);
  assert.match(html, /aria-label="Guide sections"/i);
  assert.doesNotMatch(html, /href="https:\/\/www\.viator\.com\/searchResults\/all\?text=/i);
  assert.match(html, /6(?:<!-- -->)?-HOUR PORT DAY/i);
  assert.match(html, /8(?:<!-- -->)?-HOUR PORT DAY/i);
  assert.match(html, /Return transfer|Terminal-area plan only/i);
  assert.match(html, /Cozumel(?:<!-- -->)? cruise port tips before you go/i);
  assert.match(html, />120 min<\/b> return-to-ship buffer/i);
  assert.match(html, /Is (?:<!-- -->)?Cozumel(?:<!-- -->)? cruise port walkable/i);
  assert.match(html, /href="\/ports\/regions\/caribbean-bahamas"/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/portdayguide\.com\/ports\/cozumel"/i);
});

test("renders the expanded 64-port directory with Alaska and Asia guides", async () => {
  const directory = await render("/ports");
  assert.match(directory, /Find the right shore day in (?:<!-- -->)?64(?:<!-- -->)? ports/i);
  assert.match(directory, /Search port guides/i);
  assert.match(directory, /min read/i);
  assert.match(directory, /Updated[\s\S]{0,30}Jul 21, 2026/i);
  assert.match(directory, /\/media\/ports\/cozumel\.jpg/i);
  assert.match(directory, /data-photo-source="Wikimedia Commons"/i);
  assert.doesNotMatch(directory, /port-map-thumbnail/i);
  assert.match(directory, /All regions/i);
  assert.match(directory, /Caribbean &amp; Bahamas(?:<!-- -->)? cruise ports/i);
  assert.match(directory, /href="\/ports\/regions\/caribbean-bahamas"/i);
  assert.match(directory, /<b>64<\/b>[\s\S]{0,80}port guides[\s\S]{0,80}found/i);
  assert.match(directory, /Alaska &amp; Pacific Northwest/i);
  assert.match(directory, />Asia</i);
  assert.match(directory, /Civitavecchia \(Rome\)/i);
  const searchedDirectory = await render("/ports?q=Japan");
  assert.match(searchedDirectory, /value="Japan"/i);
  assert.match(searchedDirectory, /Yokohama \(Tokyo\)/i);
  const juneau = await render("/ports/juneau");
  assert.match(juneau, /Juneau Cruise Port Guide/i);
  assert.match(juneau, /Mendenhall Glacier/i);
  assert.match(juneau, /Easy downtown, excursion-dependent beyond it/i);
  assert.match(juneau, /Cruise Critic: Juneau member reviews/i);
  assert.match(juneau, /dedicated shuttles or taxis are far more practical/i);
  assert.match(juneau, /Top Things to Do &amp; Shore Excursions in (?:<!-- -->)?Juneau/i);
  assert.match(juneau, /Loading matched Viator excursion for Mendenhall Glacier/i);
  const yokohama = await render("/ports/yokohama-tokyo");
  assert.match(yokohama, /Yokohama \(Tokyo\) Cruise Port Guide/i);
  assert.match(yokohama, /Daikoku is not a walk-out city-centre berth/i);
  assert.match(yokohama, /Guided city tour with a stated language/i);
  assert.doesNotMatch(yokohama, /Kamakura nature experience|Tokyo water or coastal experience/i);
  const rome = await render("/ports/civitavecchia-rome");
  assert.match(rome, /Europe port-day fit/i);
  assert.doesNotMatch(rome, /Colosseum water or coastal experience|Americas port-day fit/i);
  const laemChabang = await render("/ports/laem-chabang-bangkok");
  assert.match(laemChabang, /Terminal-area plan only/i);
});

test("all 64 port articles include a detailed editorial guide, map, and credited imagery", async () => {
  const directory = await render("/ports");
  const slugs = [...directory.matchAll(/href="\/ports\/([^"#?]+)"/g)].map((match) => match[1]);
  const uniqueSlugs = [...new Set(slugs)].filter((slug) => !slug.includes("/"));
  assert.equal(uniqueSlugs.length, 64);
  const titles = new Set();
  for (const slug of uniqueSlugs) {
    const html = await render(`/ports/${slug}`);
    const words = visibleWordCount(html);
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
    assert.ok(title, `${slug}: missing title`);
    assert.ok(!titles.has(title), `${slug}: duplicate title ${title}`);
    const titleText = title.replace(/&#x27;|&#39;/gi, "'").replace(/&amp;/gi, "&");
    assert.ok(titleText.length <= 60, `${slug}: title is too long (${titleText.length} characters)`);
    titles.add(title);
    assert.ok(words >= 1000 && words <= 2100, `${slug}: expected a substantial editorial guide, found ${words}`);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${slug}: expected exactly one h1`);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://portdayguide\\.com/ports/${slug}"`, "i"), `${slug}: wrong canonical`);
    assert.doesNotMatch(html, /https:\/\/www\.portdayguide\.com/i, `${slug}: contains legacy www URL`);
    assert.match(html, /cruise port overview/i, `${slug}: missing overview`);
    assert.match(html, /OpenStreetMap contributors/i, `${slug}: missing credited map`);
    assert.match(html, /Map(?: data)? ©[\s\S]{0,120}OpenStreetMap contributors/i, `${slug}: missing map credit`);
    assert.match(html, /data-photo-source="Wikimedia Commons"/i, `${slug}: missing local photo source`);
    assert.doesNotMatch(html, /port-hero-map/i, `${slug}: hero must not fall back to a map`);
    assert.match(html, /Top Things to Do &amp; Shore Excursions in/i, `${slug}: missing combined activities and excursions section`);
    assert.equal((html.match(/data-activity-excursion-card="true"/gi) || []).length, 4, `${slug}: expected four editorial activity cards`);
    assert.match(html, /Loading matched Viator excursion for/i, `${slug}: missing live excursion matching`);
    assert.doesNotMatch(html, /href="#excursions"/i, `${slug}: contains the removed duplicate excursions anchor`);
    assert.match(html, /Traveler takeaways/i, `${slug}: missing traveler takeaways`);
    assert.match(html, /Three realistic ways to move through/i, `${slug}: missing transport comparison`);
    assert.match(html, /Quick answer:/i, `${slug}: missing answer-first summary`);
    assert.match(html, /Related [\s\S]{0,80} cruise port guides/i, `${slug}: missing contextual internal links`);
    assert.match(html, /Plan with current sailing details/i, `${slug}: missing current-detail reminder`);
  }
});

test("presents About as a visitor-facing cruise planning introduction", async () => {
  const html = await render("/about");
  assert.match(html, /<title>About PortdayGuide \| PortdayGuide<\/title>/i);
  assert.match(html, /Plan a better day at every cruise port/i);
  assert.match(html, /Why PortdayGuide exists/i);
  assert.match(html, /What you will find on PortdayGuide/i);
  assert.match(html, /How to plan your cruise port day/i);
  assert.match(html, /href="\/ports"/i);
  assert.match(html, /href="\/planner"/i);
  assert.match(html, /href="\/blog"/i);
  assert.match(html, /"@type":"AboutPage"/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/portdayguide\.com\/about"/i);
  assert.doesNotMatch(html, /research method|how (?:PortdayGuide|we) research|how this guide is made/i);
});

test("ships a healthy same-origin photo asset for every port", async () => {
  const directory = await render("/ports");
  const imageSlugs = [...directory.matchAll(/src="\/media\/ports\/([^"/]+)\.jpg"/g)].map((match) => match[1]);
  const uniqueSlugs = [...new Set(imageSlugs)];
  assert.equal(uniqueSlugs.length, 64);
  for (const slug of uniqueSlugs) {
    const file = new URL(`../public/media/ports/${slug}.jpg`, import.meta.url);
    const fileStat = await stat(file);
    assert.ok(fileStat.size > 10_000, `${slug}: missing or suspiciously small cached photo`);
  }
});

test("renders crawlable regional topic hubs with canonical metadata", async () => {
  const html = await render("/ports/regions/caribbean-bahamas");
  assert.match(html, /Caribbean &amp; Bahamas Cruise Port Guides \| PortdayGuide/i);
  assert.match(html, /Regional cruise planning/i);
  assert.match(html, /Choose the berth first/i);
  assert.match(html, /href="\/ports\/cozumel"/i);
  assert.match(html, /"@type":"CollectionPage"/i);
  assert.match(html, /"@type":"ItemList"/i);
  assert.match(html, /<link rel="canonical" href="https:\/\/portdayguide\.com\/ports\/regions\/caribbean-bahamas"/i);
});

test("publishes a crawlable blog hub and SEO article with same-origin images", async () => {
  const blog = await render("/blog");
  assert.match(blog, /Cruise Planning Blog \| PortdayGuide/i);
  assert.match(blog, /Ideas for better ports—and better days ashore/i);
  assert.match(blog, /href="\/blog\/future-of-cruise-ship-terminals"/i);
  assert.match(blog, /"@type":"CollectionPage"/i);
  assert.match(blog, /"@type":"ItemList"/i);
  assert.match(blog, /<link rel="canonical" href="https:\/\/portdayguide\.com\/blog"/i);

  const article = await render("/blog/future-of-cruise-ship-terminals");
  assert.match(article, /<title>Future of Cruise Ship Terminals \| PortdayGuide<\/title>/i);
  assert.match(article, /<h1[^>]*>The Future of Cruise Ship Terminals<\/h1>/i);
  assert.equal((article.match(/<h1\b/gi) || []).length, 1);
  assert.ok(visibleWordCount(article) >= 1500, "blog article should retain the complete long-form draft");
  assert.match(article, /The Evolution of Cruise Ship Terminals/i);
  assert.match(article, /Cruise Terminal Trends at a Glance/i);
  assert.match(article, /Sustainability and Environmental Initiatives/i);
  assert.match(article, /Case Studies: Leading Cruise Ship Terminals/i);
  assert.match(article, /"@type":"BlogPosting"/i);
  assert.match(article, /"@type":"BreadcrumbList"/i);
  assert.match(article, /<link rel="canonical" href="https:\/\/portdayguide\.com\/blog\/future-of-cruise-ship-terminals"/i);
  assert.match(article, /href="\/ports\/victoria-bc"/i);
  assert.match(article, /href="\/planner"/i);
  assert.match(article, /src="\/media\/blog\/cruise-terminal-interior\.jpg"/i);
  assert.match(article, /src="\/media\/blog\/victoria-cruise-terminal\.jpg"/i);
  assert.doesNotMatch(article, /<img[^>]+src="https:\/\/(?:static\.semrush\.com|images\.unsplash\.com)/i);

  for (const image of ["cruise-terminal-aerial.jpg", "cruise-terminal-interior.jpg", "cruise-port-technology.jpg", "passenger-terminal-technology.jpg", "victoria-cruise-terminal.jpg"]) {
    const imageStat = await stat(new URL(`../public/media/blog/${image}`, import.meta.url));
    assert.ok(imageStat.size > 10_000, `${image}: missing or suspiciously small blog image`);
  }
});

test("publishes only canonical apex URLs in the sitemap", async () => {
  const response = await worker.fetch(new Request("http://localhost/sitemap.xml", { headers: { accept: "application/xml" } }), env, ctx);
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.match(xml, /https:\/\/portdayguide\.com\/ports\/regions\/asia/i);
  assert.match(xml, /https:\/\/portdayguide\.com\/ports\/cozumel/i);
  assert.match(xml, /https:\/\/portdayguide\.com\/blog<\/loc>/i);
  assert.match(xml, /https:\/\/portdayguide\.com\/blog\/future-of-cruise-ship-terminals/i);
  assert.doesNotMatch(xml, /https:\/\/www\.portdayguide\.com/i);
  assert.doesNotMatch(xml, /https:\/\/portdayguide\.com\/(?:privacy|terms)/i);
});

test("redirects the www hostname to the canonical apex without losing the path", async () => {
  const response = await worker.fetch(new Request("https://www.portdayguide.com/ports/cozumel?source=test", { headers: { host: "www.portdayguide.com" }, redirect: "manual" }), env, ctx);
  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://portdayguide.com/ports/cozumel?source=test");
  assert.equal(response.headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains");
});

test("publishes crawl and AI-discovery controls without blocking noindex share pages", async () => {
  const [homeResponse, robotsResponse, llms] = await Promise.all([
    worker.fetch(new Request("https://portdayguide.com/", { headers: { accept: "text/html" } }), env, ctx),
    worker.fetch(new Request("https://portdayguide.com/robots.txt", { headers: { accept: "text/plain" } }), env, ctx),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
  ]);
  assert.equal(homeResponse.headers.get("strict-transport-security"), "max-age=63072000; includeSubDomains");
  const robots = await robotsResponse.text();
  assert.match(robots, /Disallow:\s*\/api\//i);
  assert.doesNotMatch(robots, /Disallow:\s*\/share/i);
  assert.match(llms, /Canonical site: https:\/\/portdayguide\.com\//i);
  assert.match(llms, /Cruise port guide directory/i);
  assert.match(llms, /Cruise planning blog/i);
});

test("marks non-search utility and legal pages as noindex", async () => {
  const [privacy, terms, share] = await Promise.all([render("/privacy"), render("/terms"), render("/share")]);
  assert.match(privacy, /<meta name="robots" content="noindex, follow"/i);
  assert.match(terms, /<meta name="robots" content="noindex, follow"/i);
  assert.match(share, /<meta name="robots" content="noindex, nofollow, nocache"/i);
});

test("Viator endpoint keeps the API key server-side and fails safely until configured", async () => {
  const response = await worker.fetch(new Request("http://localhost/api/viator/products?port=cozumel", { headers: { accept: "application/json" } }), env, ctx);
  assert.equal(response.status, 503);
  const data = await response.json();
  assert.equal(data.error, "not_configured");
  assert.doesNotMatch(JSON.stringify(data), /exp-api-key|VIATOR_API_KEY/i);
});

test("Viator price units come from API pricingPackageType and never default to per adult", async () => {
  const root = new URL("../", import.meta.url);
  const [route, topThings, featured, productCards, types] = await Promise.all([
    readFile(new URL("app/api/viator/products/route.ts", root), "utf8"),
    readFile(new URL("components/TopThingsExcursions.tsx", root), "utf8"),
    readFile(new URL("components/FeaturedViatorDeals.tsx", root), "utf8"),
    readFile(new URL("components/ViatorProductCards.tsx", root), "utf8"),
    readFile(new URL("lib/viator.ts", root), "utf8"),
  ]);
  assert.match(route, /pricingPackageTypeFromProduct/);
  assert.match(route, /pricingPackageType:\s*pricingPackageTypeFromProduct\(product\)/);
  assert.match(route, /availability\/schedules\/bulk/);
  assert.match(route, /pricingPackageTypeFromValue\(schedule\)/);
  assert.match(types, /pricingPackageType === "UNIT"\) return "per group"/);
  assert.match(types, /pricingPackageType === "PER_PERSON"\) return "per person"/);
  [topThings, featured, productCards].forEach((source) => {
    assert.match(source, /viatorPriceUnitLabel/);
    assert.doesNotMatch(source, /per adult/i);
  });
  assert.doesNotMatch(topThings, /No close live match found|Matched from current Viator listing text|Matched live excursion/i);
});

test("Viator recommendations search each attraction instead of only matching a short destination list", async () => {
  const root = new URL("../", import.meta.url);
  const [route, client, topThings] = await Promise.all([
    readFile(new URL("app/api/viator/products/route.ts", root), "utf8"),
    readFile(new URL("lib/viator-client.ts", root), "utf8"),
    readFile(new URL("components/TopThingsExcursions.tsx", root), "utf8"),
  ]);
  assert.match(route, /\/search\/freetext\?campaign-value=/);
  assert.match(route, /profile\.highlights\.map\(\(highlight\) => searchHighlightProducts/);
  assert.match(route, /searchTerm:\s*highlight/);
  assert.match(route, /destination:\s*String\(destinationId\)/);
  assert.match(client, /strategy=attraction-v3/);
  assert.doesNotMatch(topThings, /text-matched candidates/i);
  assert.match(topThings, /Before booking, check the meeting point/);
});

test("weather endpoint avoids false precision outside the forecast window", async () => {
  const response = await worker.fetch(new Request("http://localhost/api/weather?port=cozumel&date=2099-01-01", { headers: { accept: "application/json" } }), env, ctx);
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.available, false);
  assert.match(data.reason, /within nine days/i);
});

test("all 64 planner routes reserve return travel without timeline overlaps", async () => {
  const assetDir = new URL("../dist/server/ssr/assets/", import.meta.url);
  let shorepath;
  for (const name of await readdir(assetDir)) {
    if (!name.endsWith(".js")) continue;
    const candidate = await import(new URL(name, assetDir));
    if (Object.values(candidate).some((value) => typeof value === "function" && value.name === "buildCruisePlan")) {
      shorepath = candidate;
      break;
    }
  }
  assert.ok(shorepath);
  const profiles = Object.values(shorepath).find((value) => value && typeof value === "object" && "Cozumel" in value);
  const buildPlan = Object.values(shorepath).find((value) => typeof value === "function" && value.name === "buildCruisePlan");
  assert.ok(profiles && buildPlan);
  const toMinutes = (value) => {
    const [, hourText, minuteText, period] = value.match(/^(\d+):(\d+) (AM|PM)$/) || [];
    let hour = Number(hourText) % 12;
    if (period === "PM") hour += 12;
    return hour * 60 + Number(minuteText);
  };
  for (const [name, profile] of Object.entries(profiles)) {
    const plan = buildPlan({ ship: "Test", sailingDate: "", travelers: 2, party: "Couple", pace: "Balanced", interest: "Culture + history", mobility: "Standard walking", budget: "$$", weather: "Typical / dry", calls: [{ port: name, arrival: "08:00", allAboard: "17:00" }] });
    const day = plan.days[0];
    for (let index = 0; index < day.stops.length - 1; index += 1) {
      const current = day.stops[index];
      const next = day.stops[index + 1];
      assert.ok(toMinutes(current.time) + current.duration <= toMinutes(next.time), `${name}: ${current.place} overlaps ${next.place}`);
    }
    const returnStop = day.stops.find((stop) => stop.place === "Return to the ship");
    const shipStop = day.stops.find((stop) => stop.place === "Back at the ship");
    assert.ok(returnStop && shipStop, `${name}: missing explicit return leg`);
    assert.equal(toMinutes(shipStop.time) - toMinutes(returnStop.time), profile.transfer, `${name}: return transfer not reserved`);
    assert.ok(17 * 60 - toMinutes(returnStop.time) >= 120, `${name}: return begins less than two hours before all-aboard`);
  }
});

test("publishes the eight decision-intent topic pages as a crawlable hub-and-cluster", async () => {
  const routes = [
    "/ports/costa-maya/to-mahahual",
    "/ports/roatan/mahogany-bay-vs-coxen-hole",
    "/ports/cozumel/which-cruise-terminal",
    "/ports/grand-cayman/tender-guide",
    "/ports/roatan/west-bay-beach-from-cruise-port",
    "/ports/cozumel/taxi-rates",
    "/ports/grand-cayman/seven-mile-beach-from-port",
    "/ports/costa-maya/port-vs-mahahual",
  ];
  const titles = new Set();
  for (const route of routes) {
    const html = await render(route);
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1];
    assert.ok(title && !titles.has(title), `${route}: missing or duplicate title`);
    assert.ok(title.length <= 60, `${route}: title is too long (${title.length} characters)`);
    titles.add(title);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1, `${route}: expected one H1`);
    assert.match(html, new RegExp(`<link rel="canonical" href="https://portdayguide\\.com${route}"`, "i"), `${route}: wrong canonical`);
    assert.match(html, /Port Day Fit/i, `${route}: missing Port Day Fit`);
    assert.match(html, /The decision in one minute/i, `${route}: missing answer-first content`);
    assert.match(html, /Sources &amp; verification/i, `${route}: missing source context`);
    assert.match(html, /Build my [\s\S]{0,80} port day/i, `${route}: missing post-page planner conversion`);
    assert.match(html, /"@type":"Article"/i, `${route}: missing Article schema`);
    assert.doesNotMatch(html, /"@type":"FAQPage"/i, `${route}: should not prioritize FAQ schema`);
    assert.ok(visibleWordCount(html) >= 700, `${route}: expected substantive decision content`);
  }
  const hub = await render("/ports/cozumel");
  assert.match(hub, /href="\/ports\/cozumel\/which-cruise-terminal"/i);
  assert.match(hub, /href="\/ports\/cozumel\/taxi-rates"/i);
  const directory = await render("/ports");
  const region = await render("/ports/regions/caribbean-bahamas");
  routes.forEach((route) => {
    const link = new RegExp(`href="${route}"`, "i");
    assert.match(directory, link, `${route}: missing directory link`);
    assert.match(region, link, `${route}: missing regional-hub link`);
  });
  const sitemap = await worker.fetch(new Request("http://localhost/sitemap.xml", { headers: { accept: "application/xml" } }), env, ctx).then((response) => response.text());
  routes.forEach((route) => assert.match(sitemap, new RegExp(`https://portdayguide\\.com${route}`)));
});

test("uses crawlable, stable sources on the Cozumel terminal guide", async () => {
  const html = await render("/ports/cozumel/which-cruise-terminal");
  assert.match(html, /href="https:\/\/www\.puertamayaport\.com\/"/i);
  assert.match(html, /href="https:\/\/www\.cruisecritic\.com\/articles\/cozumel-cruise-port-parking-address-amenity-info"/i);
  assert.doesNotMatch(html, /href="https:\/\/www\.puertamaya\.com\/"/i);
  assert.doesNotMatch(html, /href="https:\/\/puntalangosta\.com\/"/i);
});

test("uses a clean Grand Cayman canonical hub and preserves the indexed legacy URL", async () => {
  const canonical = await render("/ports/grand-cayman");
  assert.match(canonical, /<link rel="canonical" href="https:\/\/portdayguide\.com\/ports\/grand-cayman"/i);
  const legacy = await worker.fetch(new Request("https://portdayguide.com/ports/george-town-grand-cayman?source=old"), env, ctx);
  assert.equal(legacy.status, 308);
  assert.equal(legacy.headers.get("location"), "https://portdayguide.com/ports/grand-cayman?source=old");
});

test("intent Viator searches use page-level campaigns and preserve sponsored pricing links", async () => {
  const root = new URL("../", import.meta.url);
  const [route, cards, guides] = await Promise.all([
    readFile(new URL("app/api/viator/products/route.ts", root), "utf8"),
    readFile(new URL("components/IntentViatorCards.tsx", root), "utf8"),
    readFile(new URL("lib/port-intent-guides.ts", root), "utf8"),
  ]);
  assert.match(route, /guide\.viator\.campaign/);
  assert.match(route, /guide\.viator\.query/);
  assert.match(route, /slice\(0, 4\)/);
  assert.match(cards, /rel="sponsored nofollow noopener"/);
  assert.match(cards, /viatorPriceUnitLabel\(product\.pricingPackageType\)/);
  assert.match(guides, /pdg-costa-maya-to-mahahual/);
  assert.match(guides, /pdg-grand-cayman-seven-mile-beach/);
});

test("renders the affiliate disclosure page", async () => {
  const html = await render("/disclosure");
  assert.match(html, /How PortdayGuide may earn money/i);
  assert.match(html, /does not sell, operate, fulfill, change, or refund tours/i);
});
