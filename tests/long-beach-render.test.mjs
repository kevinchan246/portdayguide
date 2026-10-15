import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4173";
test("LGB arrival recommendations distinguish both ports and preserve booking limits", async () => {
  const path = "/blog/long-beach-airport-to-cruise-port";
  const response = await fetch(`${base}${path}`);
  assert.equal(response.status, 200);
  const doc = parse(await response.text());
  assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute("href"), `https://portdayguide.com${path}`);
  assert.doesNotMatch(doc.querySelector('meta[name="robots"]').getAttribute("content"), /noindex/);
  const cards = doc.querySelectorAll(".intent-viator-card");
  assert.equal(cards.length, 2);
  for (const [index,code,address] of [[0,"320728P1520","231 Windsor Way"],[1,"128285P2397","100 Swinford Street"]]) {
    const card = cards[index], url = new URL(card.getAttribute("href"));
    assert.ok(url.pathname.endsWith(code));
    assert.ok(card.text.includes(address));
    assert.equal(url.searchParams.get("pid"), "P00311056");
    assert.equal(url.searchParams.get("campaign"), "pdg-lgb-correct-cruise-port");
    assert.equal(card.getAttribute("data-affiliate-product"), code);
    assert.match(card.getAttribute("rel"), /sponsored nofollow/);
    assert.equal(card.querySelectorAll("a").length, 0);
    assert.ok(card.querySelector("img"));
  }
  const body = doc.querySelector("article").text;
  assert.match(body, /per person, varying with party size/);
  assert.match(body, /not wheelchair accessible/);
  assert.match(body, /US\$127\.96/);
  assert.match(body, /different route/);
  assert.match(body, /not inventory for your sailing/);
  for (const credit of doc.querySelectorAll('a[href="/photo-credits#long-beach-airport-terminal"]')) assert.equal(credit.text.trim(), "Melikamp");
  const article = doc.querySelectorAll('script[type="application/ld+json"]').map(n=>JSON.parse(n.rawText)).find(s=>s["@type"] === "BlogPosting");
  assert.equal(article.mainEntityOfPage, `https://portdayguide.com${path}`);
  assert.equal(article.datePublished, "2026-10-15");
  const sitemap = await fetch(`${base}/sitemap.xml`).then(r=>r.text());
  assert.ok(sitemap.includes(`https://portdayguide.com${path}`));
  for (const source of ["/blog", "/blog/hobby-airport-to-galveston-cruise"]) {
    const html = await fetch(`${base}${source}`).then(r=>r.text());
    assert.ok(html.includes(`href="${path}"`), `discovery link from ${source}`);
  }
});
