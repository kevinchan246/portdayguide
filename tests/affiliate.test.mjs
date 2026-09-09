import test from "node:test";
import assert from "node:assert/strict";
import { affiliateLinkEvent, validateAffiliateEvent, summarizeAffiliateEvents, AFFILIATE_STORE } from "../lib/affiliate-events.mjs";
import { selectRoatanProducts, roatanProductGroup } from "../lib/roatan-products.ts";
import { createHandler } from "../netlify/functions/affiliate-click.mjs";
import { removeExpiredClicks } from "../netlify/functions/affiliate-retention.mjs";
import { compareTransportQuotes, isCozumelDriverOption } from "../lib/cozumel-transport.ts";

const event = { type: "click", page: "/ports/roatan/west-bay-beach-from-cruise-port", product: "123P4", campaign: "pdg-roatan-west-bay-from-port", placement: "roatan-beach" };
const context = { deploy: { context: "production" } };
const endpoint = "https://portdayguide.com/.netlify/functions/affiliate-click";
function request(body = event, headers = {}, url = endpoint) {
  return new Request(url, { method: "POST", headers: { origin: "https://portdayguide.com", "content-type": "application/json", ...headers }, body: JSON.stringify(body) });
}

test("recognizes attributed product/destination links without rewriting their tracking", () => {
  const url = "https://www.viator.com/tours/Roatan/Tour/d4132-123P4?pid=P123&mcid=42383&medium=api&campaign=pdg-roatan-west-bay-from-port";
  assert.deepEqual(affiliateLinkEvent(url, event.page, event.placement), event);
  assert.equal(affiliateLinkEvent("https://www.viator.com/Roatan/d4132-ttd?pid=P123", "/", "other-link").product, "destination");
  for (const bad of [url.replace("www.viator.com", "viator.com.evil.test"), url.replace("https:", "http:"), "javascript:alert(1)", "https://www.viator.com/tours/Roatan/Tour/d4132-123P4"]) {
    assert.equal(affiliateLinkEvent(bad, event.page, event.placement), null);
  }
});

test("rejects private paths, query strings and oversized dimensions; discards extra data", () => {
  for (const page of ["/share", "/planner?ship=name", "/ports/roatan#email", "https://portdayguide.com/", "/ports/../share"]) {
    assert.equal(validateAffiliateEvent({ ...event, page }), null);
  }
  assert.equal(validateAffiliateEvent({ ...event, product: "x".repeat(121) }), null);
  assert.deepEqual(validateAffiliateEvent({ ...event, email: "do-not-store@example.com", ip: "192.0.2.1", itinerary: "private" }), event);
});

test("saves concurrent clicks with unique keys and only permitted fields", async () => {
  const records = new Map();
  const handler = createHandler(name => { assert.equal(name, AFFILIATE_STORE); return { async setJSON(key, value) { records.set(key, value); } }; });
  const responses = await Promise.all(Array.from({ length: 8 }, () => handler(request({ ...event, ip: "192.0.2.1" }), context)));
  assert.ok(responses.every(result => result.status === 204 && result.headers.get("cache-control") === "no-store"));
  assert.equal(records.size, 8);
  for (const [key, value] of records) {
    assert.match(key, /^\d{4}-\d{2}-\d{2}\/[a-f0-9-]{36}$/);
    assert.deepEqual(value, { ...event, date: key.slice(0, 10) });
  }
});

test("previews, opt-outs, cross-origin requests and invalid payloads never reach storage", async () => {
  const handler = createHandler(() => { assert.fail("must not access storage"); });
  assert.equal((await handler(request(), { deploy: { context: "deploy-preview" } })).status, 204);
  assert.equal((await handler(request(), {})).status, 204);
  for (const headers of [{ dnt: "1" }, { "sec-gpc": "1" }]) assert.equal((await handler(request(event, headers), context)).status, 204);
  assert.equal((await handler(request(event, { origin: "https://evil.test" }), context)).status, 403);
  assert.equal((await handler(request(event, {}, endpoint.replace("portdayguide.com", "preview.netlify.app")), context)).status, 403);
  assert.equal((await handler(request({ type: "click" }), context)).status, 400);
  assert.equal((await handler(request(event, { "content-type": "text/plain" }), context)).status, 415);
  assert.equal((await handler(new Request(endpoint), context)).status, 405);
});

test("body size is enforced even without Content-Length and storage errors are visible", async () => {
  const handler = createHandler(() => { throw new Error("unavailable"); });
  assert.equal((await handler(request({ ...event, extra: "x".repeat(3000) }), context)).status, 413);
  const original = console.error;
  const logs = [];
  console.error = message => logs.push(message);
  try { assert.equal((await handler(request(), context)).status, 503); }
  finally { console.error = original; }
  assert.deepEqual(logs, ["Affiliate click storage unavailable"]);
});

test("aggregate separates placements and counts clicks rather than inventing visitor counts", () => {
  const rows = summarizeAffiliateEvents([event, event, { ...event, placement: "roatan-private-island" }, { type: "booking" }]);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].clicks, 2);
  assert.equal(rows[1].clicks, 1);
  assert.ok(rows.every(row => !("visitors" in row) && !("revenue" in row)));
});

test("retention processes pagination and leaves the 90-day boundary and other keys intact", async () => {
  const removed = [];
  const cutoff = new Date(Date.parse("2026-09-07T12:00:00Z") - 90 * 86400000).toISOString().slice(0, 10);
  const count = await removeExpiredClicks({
    async *list() { yield { blobs: [{ key: "2026-01-01/a" }, { key: `${cutoff}/boundary` }] }; yield { blobs: [{ key: "2026-02-01/b" }, { key: "2026-09-07/new" }, { key: "unknown" }] }; },
    async delete(key) { removed.push(key); },
  }, new Date("2026-09-07T12:00:00Z"));
  assert.equal(count, 2);
  assert.deepEqual(removed, ["2026-01-01/a", "2026-02-01/b"]);
});

test("Roatán selection reserves both choices, excludes unrelated tours and never duplicates", () => {
  const products = [
    { productCode: "a", title: "West Bay Beach day pass" },
    { productCode: "b", title: "Bananarama beach transfer" },
    { productCode: "c", title: "West Bay snorkeling" },
    { productCode: "d", title: "Roatan private customizable chocolate Rum History" },
    { productCode: "e", title: "Roatán Private Cultural Island Tour" },
    { productCode: "f", title: "Shared chocolate tour" },
    { productCode: "g", title: "Private scuba dive" },
  ];
  assert.deepEqual(selectRoatanProducts([...products, products[0]]).map(product => product.productCode), ["a", "b", "d", "e"]);
  assert.equal(roatanProductGroup({ title: "Private chocolate and West Bay beach", productCode: "x" }), "beach");
  assert.deepEqual(selectRoatanProducts(products.slice(0, 3)).map(product => product.productCode), ["a", "b", "c"]);
  assert.deepEqual(selectRoatanProducts(products.slice(5)), []);
  assert.deepEqual(selectRoatanProducts([products[3]]), [products[3]]);
});

test("Cozumel driver selection rejects self-drive adventures and unrelated transport", () => {
  assert.ok(isCozumelDriverOption({ title: "Explore Cozumel your Way Private Island Tour with Pro Guide", description: "Your own air-conditioned vehicle and professional driver-guide." }));
  assert.ok(isCozumelDriverOption({ title: "Private Driver and Custom Tour", description: "Choose your stops." }));
  for (const product of [
    { title: "Private Jeep Tour", description: "Driver available." },
    { title: "Customizable Private Buggy Tour", description: "Guide and driver." },
    { title: "Private Island Tour", description: "Take the wheel and drive yourself with a driver-guide leading the way." },
    { title: "Private Island Tour", description: "Driver not included." },
    { title: "Private Airport Transfer", description: "Professional driver." },
    { title: "Private Walking Food Tour", description: "Meet your guide downtown." },
  ]) assert.equal(isCozumelDriverOption(product), false, product.title);
});

test("whole-party comparison adds unequal return fares and separate extras without multiplying vehicle totals", () => {
  const result = compareTransportQuotes({ passengers: "5", outward: "30.10", back: "40.20", taxiExtras: "100", driver: "160", driverExtras: "50" });
  assert.deepEqual(result, { people: 5, taxiTotal: 170.3, driverTotal: 210, difference: 39.7 });
  assert.equal(compareTransportQuotes({ passengers: "4", outward: "10", back: "10", taxiExtras: "0", driver: "20", driverExtras: "0" }).difference, 0);
});

test("quote comparison never treats missing or invalid amounts as a free fare", () => {
  const quote = { passengers: "4", outward: "", back: "", taxiExtras: "0", driver: "", driverExtras: "0" };
  assert.deepEqual(compareTransportQuotes(quote), { people: 4, taxiTotal: null, driverTotal: null, difference: null });
  for (const passengers of ["0", "-1", "2.5", "31", ""]) assert.equal(compareTransportQuotes({ ...quote, passengers }), null);
  for (const outward of ["-5", "1e2", "1.234", "100001", "NaN"]) assert.equal(compareTransportQuotes({ ...quote, outward, back: "5" }).taxiTotal, null);
  assert.equal(compareTransportQuotes({ ...quote, outward: "0", back: "0" }).taxiTotal, 0);
});
