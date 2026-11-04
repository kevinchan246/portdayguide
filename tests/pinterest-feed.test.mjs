import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { inflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { PINTEREST_ITEMS, buildPinterestFeed, pinterestDestination } from "../lib/pinterest-feed.mjs";

test("curated RSS uses stable unique IDs and one image per resource", () => {
  const xml = buildPinterestFeed();
  assert.equal(xml, buildPinterestFeed());
  assert.ok(PINTEREST_ITEMS.length >= 9);
  assert.equal((xml.match(/<item>/g) || []).length, PINTEREST_ITEMS.length);
  assert.equal((xml.match(/<media:content /g) || []).length, PINTEREST_ITEMS.length);
  assert.equal((xml.match(/<guid isPermaLink="false">/g) || []).length, PINTEREST_ITEMS.length);
  assert.match(xml, /<rss version="2.0" xmlns:media="http:\/\/search.yahoo.com\/mrss\/">/);
  assert.match(xml, /<pubDate>Tue, 22 Sep 2026 03:45:00 GMT<\/pubDate>/);
  assert.throws(() => buildPinterestFeed([PINTEREST_ITEMS[0], PINTEREST_ITEMS[0]]), /unique/);
});

test("approved six-Pin queue preserves pixels, copy, earlier RSS and staggered ownership", async () => {
  const root = new URL("../docs/pinterest-batches/2026-10-31/", import.meta.url);
  const manifest = JSON.parse(await readFile(new URL("manifest.json", root), "utf8"));
  const ledger = JSON.parse(await readFile(new URL("release-ledger.json", root), "utf8"));
  const credits = JSON.parse(await readFile(new URL("../lib/pinterest-photo-credits.json", import.meta.url), "utf8"));
  assert.equal(ledger.approvedHead, "664f07595bb5c1fba15335202c017a8ae10a5553");
  assert.equal(ledger.pins.length, 6);
  assert.equal(new Set(ledger.pins.map(p => p.targetDate)).size, 6);
  const ids = new Set(ledger.pins.map(p => p.id));
  const earlier = PINTEREST_ITEMS.filter(p => !ids.has(p.id));
  assert.equal(earlier.length, 8);
  assert.equal(createHash("sha256").update(buildPinterestFeed(earlier)).digest("hex"), "9080a0782c221d3a11fbd710efade38581e50d6702fdd68333ec38a6e7adb451");
  const pageTimes = new Map();
  for (const queued of ledger.pins) {
    const approved = manifest.pins.find(p => p.id === queued.id);
    assert.ok(approved);
    assert.equal(queued.destination, approved.destination);
    const image = await readFile(new URL(`../public${queued.imagePath}`, import.meta.url));
    assert.equal(createHash("sha256").update(image).digest("hex"), approved.sha256);
    assert.ok(image.equals(await readFile(new URL(approved.file, root))));
    const source = approved.sources[0], credit = credits[queued.creditAnchor];
    for (const key of ["author", "sourceUrl", "license", "licenseUrl"]) assert.equal(credit[key], source[key]);
    for (const value of [source.author, source.sourceUrl, source.licenseUrl, "Cropped; gradients and type added."]) assert.ok(approved.description.includes(value));
    const live = PINTEREST_ITEMS.find(p => p.id === queued.id);
    if (queued.status === "queued-for-existing-acquisition-run") {
      assert.equal(live, undefined, "Queued dates must not leak into static RSS");
      assert.equal(queued.feedItemDate, null);
    } else {
      assert.ok(live);
      assert.equal(live.title, approved.title); assert.equal(live.description, approved.description);
      assert.equal(pinterestDestination(live), approved.destination);
      assert.equal(live.imagePath, queued.imagePath); assert.equal(live.publishedAt, queued.feedItemDate);
    }
    const planned = new Date(queued.feedItemDate || `${queued.targetDate}T15:30:00Z`).getTime();
    const page = new URL(queued.destination).pathname;
    if (pageTimes.has(page)) assert.ok(planned - pageTimes.get(page) >= 14 * 86400000, "Same-page variants require 14 complete days");
    pageTimes.set(page, planned);
  }
});

test("feed titles, descriptions and destination query strings are XML escaped", () => {
  const xml = buildPinterestFeed([{ ...PINTEREST_ITEMS[0], title: 'A & B < "C"', description: "It's useful > all." }]);
  assert.match(xml, /<title>A &amp; B &lt; &quot;C&quot;<\/title>/);
  assert.match(xml, /<description>It&apos;s useful &gt; all.<\/description>/);
  assert.match(xml, /\?utm_source=pinterest&amp;utm_medium=organic_social&amp;utm_campaign=portdayguide_guides/);
  assert.doesNotMatch(xml, /&(?!amp;|lt;|gt;|quot;|apos;)/);
});

test("destinations use the claimed HTTPS domain, correct section and campaign", () => {
  for (const item of PINTEREST_ITEMS) {
    const url = new URL(pinterestDestination(item));
    assert.equal(url.origin, "https://portdayguide.com");
    assert.equal(url.searchParams.get("utm_source"), "pinterest");
    assert.equal(url.searchParams.get("utm_medium"), "organic_social");
    assert.equal(url.searchParams.get("utm_campaign"), "portdayguide_guides");
    assert.equal(url.searchParams.get("utm_content"), item.id);
    assert.equal(url.hash, `#${item.anchor}`);
  }
  for (const path of ["https://example.com/guide", "//example.com/guide", "http://portdayguide.com/guide", "https://user@portdayguide.com/guide"]) {
    assert.throws(() => buildPinterestFeed([{ ...PINTEREST_ITEMS[0], path }]), /claimed domain/);
  }
  assert.throws(() => buildPinterestFeed([{ ...PINTEREST_ITEMS[0], imagePath: "https://example.com/image.png" }]), /claimed domain/);
});

test("every advertised image exists and is an actual 1000 by 1500 PNG", async () => {
  for (const item of PINTEREST_ITEMS) {
    const data = await readFile(new URL(`../public${item.imagePath}`, import.meta.url));
    assert.deepEqual([...data.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(data.readUInt32BE(16), 1000);
    assert.equal(data.readUInt32BE(20), 1500);
    assert.ok(data.length < 20 * 1024 * 1024);
    // Header-only checks can accept a truncated upload. Walk every chunk and
    // decompress its image stream before advertising the file to Pinterest.
    const idat = [];
    let offset = 8, ended = false;
    while (offset + 12 <= data.length) {
      const length = data.readUInt32BE(offset), end = offset + 12 + length;
      assert.ok(end <= data.length, `${item.id}: incomplete PNG chunk`);
      const kind = data.toString("ascii", offset + 4, offset + 8);
      if (kind === "IDAT") idat.push(data.subarray(offset + 8, offset + 8 + length));
      offset = end;
      if (kind === "IEND") { ended = true; break; }
    }
    assert.ok(ended && offset === data.length, `${item.id}: complete PNG end marker`);
    assert.ok(inflateSync(Buffer.concat(idat)).length > 0, `${item.id}: decodable image stream`);
  }
});

if (process.env.TEST_BASE_URL) {
  test("approved staged images and complete photo credits are available", async () => {
    const ledger = JSON.parse(await readFile(new URL("../docs/pinterest-batches/2026-10-31/release-ledger.json", import.meta.url), "utf8"));
    const response = await fetch(`${process.env.TEST_BASE_URL}/photo-credits`);
    assert.equal(response.status, 200);
    const html = await response.text();
    const credits = JSON.parse(await readFile(new URL("../lib/pinterest-photo-credits.json", import.meta.url), "utf8"));
    for (const pin of ledger.pins) {
      assert.ok(html.includes(`id="${pin.creditAnchor}"`));
      assert.ok(html.includes(credits[pin.creditAnchor].sourceUrl));
      assert.ok(html.includes(credits[pin.creditAnchor].licenseUrl));
      const image = await fetch(`${process.env.TEST_BASE_URL}${pin.imagePath}`);
      assert.equal(image.status, 200);
      assert.equal(createHash("sha256").update(Buffer.from(await image.arrayBuffer())).digest("hex"), pin.sha256);
    }
  });
  test("production route serves RSS and all linked images", async () => {
    const response = await fetch(`${process.env.TEST_BASE_URL}/feeds/pinterest.xml`);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /application\/rss\+xml/);
    assert.equal(await response.text(), buildPinterestFeed());
    for (const item of PINTEREST_ITEMS) {
      const image = await fetch(`${process.env.TEST_BASE_URL}${item.imagePath}`);
      assert.equal(image.status, 200);
      assert.match(image.headers.get("content-type"), /image\/png/);
      const destination = await fetch(`${process.env.TEST_BASE_URL}${item.path}`);
      assert.equal(destination.status, 200);
      assert.ok((await destination.text()).includes(`id="${item.anchor}"`), `${item.anchor} must exist on the destination page`);
    }
  });
}
