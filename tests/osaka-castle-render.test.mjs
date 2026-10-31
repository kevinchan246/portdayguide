import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:4173";
const path = "/blog/osaka-cruise-port-to-castle";

test("castle article preserves the berth, walking decision and conditional guided alternative", async () => {
  const r = await fetch(`${base}${path}`);
  assert.equal(r.status, 200);
  const doc = parse(await r.text());
  assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute("href"), `https://portdayguide.com${path}`);
  assert.doesNotMatch(doc.querySelector('meta[name="robots"]').getAttribute("content"), /noindex/);
  assert.doesNotMatch(r.headers.get("x-robots-tag") ?? "", /noindex/);
  assert.equal(doc.querySelectorAll("h1").length, 1);
  const body = doc.querySelector("article").text;
  for (const detail of [/Tempozan/, /Osakako station \(C11\)/, /Tanimachi 4-chome \(C18\)/, /Exit 9/, /20 minutes/, /55 minutes each way plus 150 minutes/, /100 minutes/, /220 minutes/, /¥1,200 per adult/, /¥2,400/, /ISIC/, /staff can arrange elevator use/, /not a live availability result/, /JR Osakajokoen/, /not the C18 stop/]) assert.match(body, detail);
  const cards = doc.querySelectorAll(".intent-viator-card");
  assert.equal(cards.length, 1);
  const card = cards[0], href = new URL(card.getAttribute("href"));
  assert.ok(href.pathname.endsWith("92163P251"));
  assert.equal(href.searchParams.get("pid"), "P00311056");
  assert.equal(href.searchParams.get("campaign"), "pdg-osaka-castle-from-port");
  assert.equal(card.getAttribute("data-affiliate-product"), "92163P251");
  assert.equal(card.getAttribute("data-affiliate-placement"), "osaka-castle-guided-alternative");
  assert.match(card.getAttribute("rel"), /sponsored nofollow/);
  assert.equal(card.querySelectorAll("a").length, 0);
  assert.ok(card.querySelector("img"));
  assert.match(body, /per person/);
  assert.match(body, /not wheelchair accessible/);
  assert.match(body, /Base tour details exclude museum admission/);
  assert.match(body, /No current party quote|no current party quote/);
  const credits = doc.querySelectorAll('a[href="/photo-credits#osaka-castle-keep"]');
  assert.equal(credits.length, 2);
  for (const a of credits) assert.equal(a.text.trim(), "Takipoint123");
  const schema = doc.querySelectorAll('script[type="application/ld+json"]').map(n=>JSON.parse(n.rawText)).find(s=>s["@type"] === "BlogPosting");
  assert.equal(schema.datePublished, "2026-10-20");
  assert.equal(schema.mainEntityOfPage, `https://portdayguide.com${path}`);
  assert.equal(schema.image, "https://portdayguide.com/media/articles/osaka-castle-keep.webp");
  for (const source of ["/blog", "/ports/osaka", "/ports/osaka/kaiyukan-from-cruise-port"]) {
    const html = await fetch(`${base}${source}`).then(r=>r.text());
    assert.ok(html.includes(`href="${path}"`), `discovery from ${source}`);
  }
  assert.ok((await fetch(`${base}/sitemap.xml`).then(r=>r.text())).includes(`https://portdayguide.com${path}`));
});
