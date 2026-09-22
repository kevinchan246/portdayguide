import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PINTEREST_ITEMS, buildPinterestFeed, pinterestDestination } from "../lib/pinterest-feed.mjs";

test("curated RSS uses stable unique IDs and one image per resource", () => {
  const xml = buildPinterestFeed();
  assert.equal(xml, buildPinterestFeed());
  assert.equal(PINTEREST_ITEMS.length, 2);
  assert.equal((xml.match(/<item>/g) || []).length, 2);
  assert.equal((xml.match(/<media:content /g) || []).length, 2);
  assert.equal((xml.match(/<guid isPermaLink="false">/g) || []).length, 2);
  assert.match(xml, /<rss version="2.0" xmlns:media="http:\/\/search.yahoo.com\/mrss\/">/);
  assert.match(xml, /<pubDate>Tue, 22 Sep 2026 03:45:00 GMT<\/pubDate>/);
  assert.throws(() => buildPinterestFeed([PINTEREST_ITEMS[0], PINTEREST_ITEMS[0]]), /unique/);
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
  }
});

if (process.env.TEST_BASE_URL) {
  test("production route serves RSS and both linked images", async () => {
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
