import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import test from "node:test";

// Parse the HTTP response as HTML, including nested picture/card markup. Next
// already bundles this parser, so these checks need no browser or new package.
const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const baseUrl = new URL(process.env.TEST_BASE_URL ?? "http://127.0.0.1:4173");
const productionOrigin = "https://portdayguide.com";
const documents = new Map();
const imageHashes = new Map();

async function request(path) {
  const url = new URL(path, productionOrigin);
  assert.equal(url.origin, productionOrigin, `Unexpected resource origin: ${url}`);
  return fetch(new URL(`${url.pathname}${url.search}`, baseUrl), { signal: AbortSignal.timeout(15_000) });
}

function documentAt(path) {
  if (!documents.has(path)) documents.set(path, (async () => {
    const response = await request(path);
    assert.equal(response.status, 200, `${path} must render successfully`);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, `${path} must serve HTML`);
    return parse(await response.text());
  })());
  return documents.get(path);
}

async function mapConcurrent(items, callback) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(8, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await callback(items[index]);
    }
  }));
  return results;
}

function mediaPath(value, context) {
  assert.equal(typeof value, "string", `${context} needs an image URL`);
  const url = new URL(value, productionOrigin);
  assert.equal(url.origin, productionOrigin, `${context} must use a same-origin cover`);
  assert.ok(url.pathname.startsWith("/media/"), `${context} must identify a media asset`);
  assert.equal(url.search, "", `${context} must identify the original image without transform parameters`);
  assert.equal(url.hash, "", `${context} must identify an image without a fragment`);
  return url.pathname;
}

function schemaImages(value) {
  if (Array.isArray(value)) return value.flatMap(schemaImages);
  return [typeof value === "string" ? value : value?.url ?? value?.contentUrl];
}

function articleSchemas(document) {
  function flatten(value) {
    if (Array.isArray(value)) return value.flatMap(flatten);
    return [value, ...(value?.["@graph"] ? flatten(value["@graph"]) : [])];
  }
  return document.querySelectorAll('script[type="application/ld+json"]')
    .flatMap((node) => flatten(JSON.parse(node.rawText)))
    .filter((schema) => [schema?.["@type"]].flat().some((type) => ["Article", "BlogPosting"].includes(type)));
}

function coverFrom(document, path) {
  const intent = document.querySelector(".intent-hero");
  const blog = document.querySelector(".blog-article-cover");
  const region = intent ?? blog ?? document.querySelector(".port-hero-photo");
  assert.ok(region, `${path} needs a rendered primary cover`);
  const images = region.querySelectorAll("img");
  assert.equal(images.length, 1, `${path} needs one primary cover image`);
  const src = mediaPath(images[0].getAttribute("src"), `${path} hero`);
  // PortScenicPhoto puts the short credit beside its background div; article
  // credits live inside the hero or cover figure.
  const creditRegion = intent || blog ? region : region.parentNode;
  const credit = creditRegion.querySelector(".port-photo-caption a, figcaption a");
  assert.ok(credit?.getAttribute("href"), `${path} cover needs a linked photo credit`);
  return { src, creditHref: credit.getAttribute("href"), kind: intent || blog ? "article" : "port" };
}

function sourceIdentity(source) {
  const url = new URL(source, productionOrigin);
  assert.equal(url.protocol, "https:", `Photo source must use HTTPS: ${source}`);
  assert.notEqual(url.origin, productionOrigin, `Photo source must identify the original: ${source}`);
  if (url.hostname === "commons.wikimedia.org") {
    const title = url.searchParams.get("title") ?? decodeURIComponent(url.pathname.replace(/^\/wiki\//, ""));
    assert.ok(title.startsWith("File:"), `Commons source needs its file identity: ${source}`);
    return `commons:${title.replaceAll("_", " ").normalize("NFC")}`;
  }
  // Tracking parameters or fragments do not turn the same credited photo into
  // a different source. Commons' title parameter is handled above.
  url.search = "";
  url.hash = "";
  return url.href;
}

function creditSource(creditHref, credits, path) {
  const url = new URL(creditHref, productionOrigin);
  if (url.origin !== productionOrigin) return sourceIdentity(url.href);
  assert.equal(url.pathname, "/photo-credits", `${path} must link its cover credit to the attribution directory`);
  const id = decodeURIComponent(url.hash.slice(1));
  assert.ok(id, `${path} cover credit needs an attribution anchor`);
  const section = credits.querySelectorAll("section[id]").find((node) => node.getAttribute("id") === id);
  assert.ok(section, `${path} credit anchor ${id} must exist`);
  const original = section.querySelector("a[href]")?.getAttribute("href");
  assert.ok(original, `${path} credit ${id} needs an original source link`);
  return sourceIdentity(original);
}

function imageHash(src) {
  if (!imageHashes.has(src)) imageHashes.set(src, (async () => {
    const response = await request(src);
    assert.equal(response.status, 200, `${src} cover must be reachable`);
    assert.match(response.headers.get("content-type") ?? "", /^image\//i, `${src} must serve an image`);
    const bytes = Buffer.from(await response.arrayBuffer());
    assert.ok(bytes.length, `${src} must contain image data`);
    return createHash("sha256").update(bytes).digest("hex");
  })());
  return imageHashes.get(src);
}

let inventory;
function contentInventory() {
  inventory ??= (async () => {
    const response = await request("/sitemap.xml");
    assert.equal(response.status, 200, "Sitemap must be reachable");
    const sitemap = parse(await response.text());
    const locations = sitemap.querySelectorAll("url").map((entry) => {
      const canonical = entry.querySelector("loc")?.text.trim();
      const url = new URL(canonical);
      assert.equal(url.origin, productionOrigin, "Sitemap pages must use the canonical origin");
      const images = entry.querySelectorAll("*").filter((node) => node.tagName?.toLowerCase() === "image:loc").map((node) => node.text.trim());
      return { path: url.pathname, canonical, images };
    });
    assert.ok(locations.length, "Sitemap must discover pages");
    assert.equal(new Set(locations.map((page) => page.path)).size, locations.length, "Sitemap must not duplicate pages");
    const credits = await documentAt("/photo-credits");
    const pages = await mapConcurrent(locations, async (location) => {
      const document = await documentAt(location.path);
      const schemas = articleSchemas(document);
      if (!schemas.length) return { ...location, document };
      assert.equal(schemas.length, 1, `${location.path} needs one primary article schema`);
      assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute("href"), location.canonical, `${location.path} must be self-canonical`);
      const cover = coverFrom(document, location.path);
      return { ...location, document, cover, schema: schemas[0], source: creditSource(cover.creditHref, credits, location.path) };
    });
    const content = pages.filter((page) => page.cover);
    assert.ok(content.length, "Sitemap must discover content pages with article schema");
    return { pages, content };
  })();
  return inventory;
}

test("all sitemap content pages use distinct credited covers with matching search and share images", async (t) => {
  const { content } = await contentInventory();
  const seenHashes = new Map();
  const seenSources = new Map();
  for (const page of content) {
    const context = `${page.path} cover`;
    const social = [
      ...page.document.querySelectorAll('meta[property="og:image"]'),
      ...page.document.querySelectorAll('meta[name="twitter:image"]'),
    ];
    assert.ok(page.document.querySelector('meta[property="og:image"]'), `${context} needs an OG image`);
    assert.ok(page.document.querySelector('meta[name="twitter:image"]'), `${context} needs a Twitter image`);
    for (const meta of social) assert.equal(mediaPath(meta.getAttribute("content"), context), page.cover.src, `${context} must match its social image`);
    for (const image of schemaImages(page.schema.image)) assert.equal(mediaPath(image, context), page.cover.src, `${context} must match its schema image`);
    assert.ok(page.images.length, `${context} must appear in the image sitemap`);
    for (const image of page.images) assert.equal(mediaPath(image, context), page.cover.src, `${context} must match its sitemap image`);
    const hash = await imageHash(page.cover.src);
    assert.ok(!seenHashes.has(hash), `${page.path} repeats cover bytes from ${seenHashes.get(hash)}`);
    assert.ok(!seenSources.has(page.source), `${page.path} reuses the original photograph from ${seenSources.get(page.source)}`);
    seenHashes.set(hash, page.path);
    seenSources.set(page.source, page.path);
  }
  t.diagnostic(`Checked ${content.length} rendered content covers, fetched image SHA256s, and original photo identities.`);
});

test("article discovery image links show the target page's own cover throughout the rendered site", async (t) => {
  const { pages, content } = await contentInventory();
  const byPath = new Map(content.map((page) => [page.path, page]));
  const articlePaths = content.filter((page) => page.cover.kind === "article").map((page) => page.path).sort();
  const blog = await documentAt("/blog");
  const directoryPaths = blog.querySelectorAll(".planning-article-card").map((card) => {
    const link = card.querySelector("a[href]");
    assert.ok(link?.querySelector("img"), "Every article directory card needs a linked cover");
    return new URL(link.getAttribute("href"), productionOrigin).pathname;
  }).sort();
  assert.deepEqual(directoryPaths, articlePaths, "The article directory must show every canonical article exactly once");
  const home = await documentAt("/");
  assert.ok(home.querySelector(".planning-article-card a img"), "Homepage featured articles must exercise the cover cards");
  let checked = 0;
  for (const page of pages) {
    for (const link of page.document.querySelectorAll("a[href]")) {
      const url = new URL(link.getAttribute("href"), productionOrigin);
      if (url.origin !== productionOrigin) continue;
      const target = byPath.get(url.pathname);
      if (!target) continue;
      for (const image of link.querySelectorAll("img")) {
        assert.equal(mediaPath(image.getAttribute("src"), `${page.path} discovery card`), target.cover.src, `${page.path} image link to ${target.path} must show that page's cover`);
        checked++;
      }
    }
  }
  assert.ok(checked, "Rendered content discovery must include image links");
  t.diagnostic(`Checked ${directoryPaths.length} directory articles and ${checked} discovery image links across ${pages.length} sitemap pages.`);
});
