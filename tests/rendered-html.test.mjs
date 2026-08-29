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
  assert.match(html, /href="\/blog\/alaska-cruise-ports"/i);
  assert.match(html, /src="\/media\/ports\/juneau\.jpg"/i);
  assert.doesNotMatch(html, /\/_vinext\/image/i);
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
  const partialRegionSearch = await render("/ports?q=Alask");
  assert.match(partialRegionSearch, /value="Alask"/i);
  assert.match(partialRegionSearch, /<b>6<\/b>[\s\S]{0,80}port guides[\s\S]{0,80}found/i);
  assert.match(partialRegionSearch, /Juneau Cruise Port Guide/i);
  assert.doesNotMatch(partialRegionSearch, /No matching ports/i);
  const multiTermPartialSearch = await render("/ports?q=Alask%20Menden");
  assert.match(multiTermPartialSearch, /<b>1<\/b>[\s\S]{0,80}port guide[\s\S]{0,80}found/i);
  assert.match(multiTermPartialSearch, /Juneau Cruise Port Guide/i);
  const juneau = await render("/ports/juneau");
  assert.match(juneau, /Juneau Cruise Port Guide/i);
  assert.match(juneau, /Mendenhall Glacier/i);
  assert.match(juneau, /Easy downtown, excursion-dependent beyond it/i);
  assert.match(juneau, /Cruise Critic: Juneau member reviews/i);
  assert.match(juneau, /dedicated shuttles or taxis are far more practical/i);
  assert.match(juneau, /Top Things to Do &amp; Shore Excursions in (?:<!-- -->)?Juneau/i);
  assert.match(juneau, /Loading matched Viator excursion for Mendenhall Glacier/i);
  assert.match(juneau, /href="\/blog\/alaska-cruise-ports"/i);
  assert.match(juneau, /data-alaska-pillar-backlink="true"/i);
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
  assert.match(blog, /href="\/blog\/future-of-cruise-ship-terminals\/mco-to-port-canaveral"/i);
  assert.match(blog, /href="\/blog\/alaska-cruise-ports"/i);
  assert.match(blog, /Top Alaska Cruise Ports to Explore/i);
  assert.match(blog, /Traveling from MCO to Port Canaveral \(Best Transportation Options\)/i);
  assert.match(blog, /"@type":"CollectionPage"/i);
  assert.match(blog, /"@type":"ItemList"/i);
  assert.match(blog, /"numberOfItems":3/i);
  assert.match(blog, /<link rel="canonical" href="https:\/\/portdayguide\.com\/blog"/i);
  assert.doesNotMatch(blog, /\/_vinext\/image/i);

  const alaska = await render("/blog/alaska-cruise-ports");
  assert.match(alaska, /<title>Top Alaska Cruise Ports, Routes &amp; Itineraries \| PortdayGuide<\/title>/i);
  assert.match(alaska, /<h1[^>]*>Top Alaska Cruise Ports to Explore<\/h1>/i);
  assert.equal((alaska.match(/<h1\b/gi) || []).length, 1);
  assert.ok(visibleWordCount(alaska) >= 2000, "Alaska pillar should retain the complete long-form draft");
  assert.match(alaska, /Where Do Alaskan Cruises Leave From\?/i);
  assert.match(alaska, /Understanding Alaska Cruise Routes and Itineraries/i);
  assert.match(alaska, /Inside Passage: The Heart of Alaska Cruise Destinations/i);
  assert.match(alaska, /Glacier Bay National Park: Majestic Glaciers and Wildlife/i);
  assert.match(alaska, /Compare excursions at Alaska(?:&#x27;|')s featured cruise ports/i);
  assert.match(alaska, /Loading direct Viator matches for featured Alaska cruise ports/i);
  assert.match(alaska, /Affiliate disclosure/i);
  assert.doesNotMatch(alaska, /These live cards are direct matches/i);
  assert.ok(
    alaska.indexOf("Compare excursions at Alaska") < alaska.indexOf("Juneau: Alaska"),
    "Alaska Viator matches should appear after the route overview and before the port-by-port sections",
  );
  assert.match(alaska, /"@type":"BlogPosting"/i);
  assert.match(alaska, /"@type":"FAQPage"/i);
  assert.match(alaska, /"@type":"BreadcrumbList"/i);
  assert.match(alaska, /<link rel="canonical" href="https:\/\/portdayguide\.com\/blog\/alaska-cruise-ports"/i);
  assert.equal((alaska.match(/data-alaska-port-card="true"/gi) || []).length, 5);
  for (const slug of ["juneau", "ketchikan", "skagway", "sitka", "icy-strait-point"]) {
    assert.match(alaska, new RegExp(`href="/ports/${slug}"`, "i"));
    assert.match(alaska, new RegExp(`src="/media/ports/${slug}\\.jpg"`, "i"));
  }
  assert.doesNotMatch(alaska, /<img[^>]+src="https:\/\/(?:static\.semrush\.com|images\.unsplash\.com)/i);
  assert.doesNotMatch(alaska, /\/_vinext\/image/i);

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
  assert.match(article, /href="\/blog\/future-of-cruise-ship-terminals\/mco-to-port-canaveral"/i);
  assert.match(article, /Plan the journey around the terminal/i);
  assert.match(article, /MCO to Port Canaveral transportation options/i);
  assert.equal((article.match(/data-blog-child-card="true"/gi) || []).length, 1);
  assert.match(article, /src="\/media\/blog\/cruise-terminal-interior\.jpg"/i);
  assert.match(article, /src="\/media\/blog\/victoria-cruise-terminal\.jpg"/i);
  assert.doesNotMatch(article, /<img[^>]+src="https:\/\/(?:static\.semrush\.com|images\.unsplash\.com)/i);
  assert.doesNotMatch(article, /\/_vinext\/image/i);

  const child = await render("/blog/future-of-cruise-ship-terminals/mco-to-port-canaveral");
  assert.match(child, /<title>MCO to Port Canaveral: Transportation Options \| PortdayGuide<\/title>/i);
  assert.match(child, /<h1[^>]*>Traveling from MCO to Port Canaveral \(Best Transportation Options\)<\/h1>/i);
  assert.equal((child.match(/<h1\b/gi) || []).length, 1);
  assert.ok(visibleWordCount(child) >= 1200, "MCO transportation guide should retain the complete practical article");
  assert.match(child, /MCO to Port Canaveral Transportation Compared/i);
  assert.match(child, /Shared Shuttle Services/i);
  assert.match(child, /Private Car, SUV, or Van/i);
  assert.match(child, /Rideshare with Uber or Lyft/i);
  assert.match(child, /Cruise Line Transfers/i);
  assert.match(child, /Frequently Asked Questions/i);
  assert.match(child, /"@type":"BlogPosting"/i);
  assert.match(child, /"@type":"FAQPage"/i);
  assert.match(child, /"@type":"BreadcrumbList"/i);
  assert.match(child, /"isPartOf":\{"@type":"BlogPosting"/i);
  assert.match(child, /<link rel="canonical" href="https:\/\/portdayguide\.com\/blog\/future-of-cruise-ship-terminals\/mco-to-port-canaveral"/i);
  assert.match(child, /href="\/blog\/future-of-cruise-ship-terminals"/i);
  assert.match(child, /Why cruise terminals are changing/i);
  assert.match(child, /class="blog-related-guide-image"/i);
  assert.match(child, /<table>/i);
  assert.match(child, /passenger-terminal-technology\.jpg/i);
  assert.doesNotMatch(child, /\/_vinext\/image/i);

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
  assert.match(xml, /https:\/\/portdayguide\.com\/blog\/alaska-cruise-ports/i);
  assert.match(xml, /https:\/\/portdayguide\.com\/blog\/future-of-cruise-ship-terminals/i);
  assert.match(xml, /https:\/\/portdayguide\.com\/blog\/future-of-cruise-ship-terminals\/mco-to-port-canaveral/i);
  assert.doesNotMatch(xml, /https:\/\/www\.portdayguide\.com/i);
  assert.doesNotMatch(xml, /https:\/\/portdayguide\.com\/(?:privacy|terms)/i);
});

test("keeps every sitemap page indexable with a self-referencing canonical", async () => {
  const sitemapResponse = await worker.fetch(new Request("https://portdayguide.com/sitemap.xml", { headers: { accept: "application/xml" } }), env, ctx);
  assert.equal(sitemapResponse.status, 200);
  const xml = await sitemapResponse.text();
  const sitemapUrls = [...xml.matchAll(/<loc>(https:\/\/portdayguide\.com[^<]*)<\/loc>/gi)].map((match) => match[1]);
  assert.ok(sitemapUrls.length >= 80, `expected at least 80 public sitemap pages, found ${sitemapUrls.length}`);

  for (const sitemapUrl of sitemapUrls) {
    const url = new URL(sitemapUrl);
    const response = await worker.fetch(new Request(url, { headers: { accept: "text/html" } }), env, ctx);
    assert.equal(response.status, 200, `${url.pathname}: expected a successful public page`);
    assert.doesNotMatch(response.headers.get("x-robots-tag") ?? "", /\bnoindex\b/i, `${url.pathname}: response header must not block indexing`);

    const html = await response.text();
    assert.doesNotMatch(html, /<meta[^>]+name=["'](?:robots|googlebot)["'][^>]+content=["'][^"']*\bnoindex\b/i, `${url.pathname}: page contains a noindex directive`);
    assert.match(html, /<meta name="robots" content="index, follow"/i, `${url.pathname}: missing explicit index, follow metadata`);
    const googleBot = html.match(/<meta name="googlebot" content="([^"]+)"/i)?.[1] ?? "";
    for (const directive of ["index", "follow", "max-image-preview:large", "max-snippet:-1", "max-video-preview:-1"]) {
      assert.match(googleBot, new RegExp(`(?:^|, )${directive.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:, |$)`, "i"), `${url.pathname}: missing Googlebot directive ${directive}`);
    }

    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
    assert.ok(canonical, `${url.pathname}: missing canonical URL`);
    assert.equal(new URL(canonical).href, url.href, `${url.pathname}: canonical does not match the sitemap URL`);
  }
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
  assert.match(llms, /Alaska cruise ports pillar guide/i);
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

test("publishes the Yokohama terminal-area article with affiliate and reciprocal guide links", async () => {
  const route = "/ports/yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal";
  const article = await render(route);
  assert.match(article, /<title>Things to Do Near Yokohama Cruise Terminal \| PortdayGuide<\/title>/i);
  assert.match(article, /<h1[^>]*>Discover the Hidden Gems Near the Yokohama Cruise Terminal<\/h1>/i);
  assert.equal((article.match(/<h1\b/gi) || []).length, 1);
  assert.ok(visibleWordCount(article) >= 1200, "Yokohama terminal-area guide should retain the complete article");
  assert.match(article, new RegExp(`<link rel="canonical" href="https://portdayguide\\.com${route}"`, "i"));
  assert.match(article, /Overview of Yokohama Cruise Terminal/i);
  assert.match(article, /Getting to Yokohama Cruise Terminal/i);
  assert.match(article, /Attractions Near Yokohama Cruise Terminal/i);
  assert.match(article, /Dining and Shopping Near the Terminal/i);
  assert.match(article, /Yokohama Cruise Terminal FAQ/i);
  assert.match(article, /Live booking options/i);
  assert.match(article, /Yokohama food tours near Osanbashi/i);
  assert.ok(article.indexOf("Dining and Shopping Near the Terminal") < article.indexOf("Live booking options"), "Viator module should sit inside the dining section");
  assert.ok(article.indexOf("Live booking options") < article.indexOf("Yokohama Red Brick Warehouse"), "Dining Viator module should appear before the shopping-area subsections");
  assert.match(article, /href="\/ports\/yokohama-tokyo"/i);
  assert.match(article, /Complete port guide/i);
  assert.match(article, /\/media\/ports\/yokohama-tokyo\.jpg/i);
  assert.equal((article.match(/data-photo-source="Unsplash"/gi) || []).length, 7, "each named Yokohama attraction should have an Unsplash photo");
  assert.ok((article.match(/on Unsplash\./gi) || []).length >= 7, "each attraction photo should include visible Unsplash credit");
  for (const photographer of ["Yu Kato", "Matt &amp; Chris Pua", "Mmoka", "Yanhao Fang", "bady abbas", "Bobby Youstra"]) {
    assert.match(article, new RegExp(photographer, "i"), `missing photo credit for ${photographer}`);
  }
  assert.ok((article.match(/utm_source=portdayguide(?:&amp;|&)utm_medium=referral/gi) || []).length >= 14, "photo and photographer links should keep Unsplash attribution tracking");
  assert.match(article, /"@type":"Article"/i);
  assert.match(article, /"@type":"FAQPage"/i);

  const hub = await render("/ports/yokohama-tokyo");
  assert.match(hub, new RegExp(`href="${route}"`, "i"));
  assert.match(hub, /Discover the Hidden Gems Near the Yokohama Cruise Terminal/i);
  assert.match(hub, /port-topic-card-featured/i);

  const directory = await render("/ports");
  const region = await render("/ports/regions/asia");
  assert.match(directory, new RegExp(`href="${route}"`, "i"));
  assert.match(region, new RegExp(`href="${route}"`, "i"));

  const sitemap = await worker.fetch(new Request("http://localhost/sitemap.xml", { headers: { accept: "application/xml" } }), env, ctx).then((response) => response.text());
  assert.match(sitemap, new RegExp(`https://portdayguide\\.com${route}`));
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
  assert.match(route, /guide\.viator\.matchTerms/);
  assert.match(route, /titleMatches/);
  assert.match(route, /slice\(0, 4\)/);
  assert.match(cards, /rel="sponsored nofollow noopener"/);
  assert.match(cards, /viatorPriceUnitLabel\(product\.pricingPackageType\)/);
  assert.match(guides, /pdg-costa-maya-to-mahahual/);
  assert.match(guides, /pdg-grand-cayman-seven-mile-beach/);
  assert.match(guides, /pdg-yokohama-terminal-dining/);
  assert.match(guides, /Yokohama Chinatown food tour/);
});

test("uses one matched Alaska affiliate collection and omits booking explainer copy sitewide", async () => {
  const root = new URL("../", import.meta.url);
  const [route, alaskaCards, intentCards] = await Promise.all([
    readFile(new URL("app/api/viator/products/route.ts", root), "utf8"),
    readFile(new URL("components/AlaskaViatorPicks.tsx", root), "utf8"),
    readFile(new URL("components/IntentViatorCards.tsx", root), "utf8"),
  ]);
  assert.match(route, /featured === "alaska"/);
  assert.match(route, /portdayguide-alaska-cruise-ports/);
  assert.match(route, /selected\.length === 4/);
  assert.match(alaskaCards, /featured=alaska/);
  assert.match(alaskaCards, /data-alaska-viator-count/);
  assert.match(alaskaCards, /data\.products\.length < 3/);
  assert.doesNotMatch(alaskaCards, /These live cards are direct matches/i);
  assert.doesNotMatch(intentCards, /\{copy\}/);
});

test("renders the affiliate disclosure page", async () => {
  const html = await render("/disclosure");
  assert.match(html, /How PortdayGuide may earn money/i);
  assert.match(html, /does not sell, operate, fulfill, change, or refund tours/i);
});
