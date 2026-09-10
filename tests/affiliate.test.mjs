import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { affiliateLinkEvent, validateAffiliateEvent, summarizeAffiliateEvents, AFFILIATE_STORE } from "../lib/affiliate-events.mjs";
import { selectRoatanProducts, roatanProductGroup } from "../lib/roatan-products.ts";
import { createHandler } from "../netlify/functions/affiliate-click.mjs";
import { removeExpiredClicks } from "../netlify/functions/affiliate-retention.mjs";
import { compareTransportQuotes, isCozumelDriverOption } from "../lib/cozumel-transport.ts";
import { isTokyoToYokohamaPortTransfer } from "../lib/tokyo-yokohama-transfer.ts";

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

test("Tokyo transfer selection requires a stated city or hotel departure toward Yokohama port", () => {
  for (const product of [
    { title: "Tokyo City to Yokohama Cruise Port - Private Transfer", description: "A private one-way departure transfer." },
    { title: "Private transfer from your hotel in Tokyo to Yokohama Port", description: "Reserve your pickup time." },
    { title: "Yokohama Port Private Transfer from Tokyo hotels", description: "Your driver meets you at your hotel." },
    { title: "Private port transfer", description: "Travel from Tokyo city to Yokohama cruise port in a private vehicle." },
    { title: "Private hotel transfer", description: "Pickup at your Tokyo hotel and drop-off at Yokohama port." },
    { title: "Tokyo hotel → Yokohama Osanbashi terminal transfer", description: "One-way transfer." },
  ]) assert.equal(isTokyoToYokohamaPortTransfer(product), true, product.title);
});

test("Tokyo transfer selection rejects reverse, ambiguous and conflicting directions", () => {
  for (const product of [
    { title: "Yokohama Cruise Port to Tokyo City - Private Transfer", description: "Your driver meets your ship." },
    { title: "Private Tokyo hotel transfer from Yokohama port", description: "One-way transfer." },
    { title: "Tokyo and Yokohama port private transfers", description: "Comfortable transport between your hotel and the terminal." },
    { title: "Tokyo hotel to/from Yokohama Port transfer", description: "Choose a direction." },
    { title: "Tokyo city to Yokohama port round-trip transfer", description: "Return included." },
    { title: "Tokyo hotel to Yokohama port transfer", description: "Available in either direction." },
    { title: "Tokyo hotel to Yokohama port transfer", description: "Yokohama port to Tokyo city transfers also available." },
    { title: "Tokyo hotel to Yokohama port transfer", description: "Pickup at Yokohama port and drop-off at your Tokyo hotel." },
    { title: "Private transfer", description: "Start in Tokyo city. Travel to Yokohama port." },
  ]) assert.equal(isTokyoToYokohamaPortTransfer(product), false, product.title);
});

test("Tokyo transfer selection excludes airport variants, wrong terminals, sightseeing and rentals", () => {
  const products = [
    { title: "Tokyo Narita Airport to Yokohama Port Transfer", description: "Airport pickup." },
    { title: "Private port transfer", description: "Tokyo hotel or Haneda airport to Yokohama port." },
    { title: "Tokyo hotel to Yokohama port transfer", description: "Also offers airport pickup." },
    { title: "Tokyo hotel to Tokyo International Cruise Terminal transfer", description: "Yokohama port is another destination." },
    { title: "Tokyo cruise port to Yokohama port transfer", description: "Port-to-port transport." },
    { title: "Tokyo hotel to Yokohama port sightseeing transfer", description: "A full day guided tour." },
    { title: "Tokyo hotel to Yokohama port walking tour", description: "Includes a private transfer." },
    { title: "Tokyo hotel to Yokohama port car rental", description: "Self-drive transfer." },
    { title: "Private hotel transfer", description: "No transfers from Tokyo hotel to Yokohama port are included." },
  ];
  assert.deepEqual(products.filter(isTokyoToYokohamaPortTransfer), []);
  assert.equal(isTokyoToYokohamaPortTransfer({ title: "", description: "" }), false);
});

test("Tokyo transfer API searches both catalogs and only returns forward transfers with source pricing", async () => {
  const guide = {
    sourcePortSlug: "yokohama-tokyo", urlPortSlug: "tokyo", topic: "tokyo-to-yokohama-cruise-terminal",
    viator: { query: "Tokyo hotel to Yokohama cruise port private transfer", searchQueries: ["Tokyo hotel to Yokohama cruise port private transfer", "Tokyo city to Yokohama port transfer", "unused extra query"], matchTerms: ["transfer"], campaign: "pdg-tokyo-to-yokohama-cruise-terminal" },
  };
  const product = (productCode, title, description = "One-way transfer.") => ({
    productCode, title, description, productUrl: `https://www.viator.com/tours/Tokyo/Transfer/d0-${productCode}`,
    images: [{ variants: [{ width: 720, height: 480, url: "https://example.com/transfer.jpg" }] }],
    pricing: { currency: "USD", summary: { fromPrice: 123 } },
  });
  const forward = product("forward", "Tokyo City to Yokohama Cruise Port - Private Transfer");
  const searches = [];
  const exports = {};
  const imports = {
    "@/lib/shorepath": { profilesBySlug: { "yokohama-tokyo": { name: "Yokohama (Tokyo)", country: "Japan" } } },
    "@/lib/port-intent-guides": { portIntentGuides: [guide] },
    "@/lib/roatan-products": { selectRoatanProducts },
    "@/lib/cozumel-transport": { isCozumelDriverOption },
    "@/lib/tokyo-yokohama-transfer": { isTokyoToYokohamaPortTransfer },
  };
  const source = await readFile(new URL("../app/api/viator/products/route.ts", import.meta.url), "utf8");
  runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, {
    exports, require: name => { assert.ok(name in imports, name); return imports[name]; },
    URL, Response, AbortSignal, console,
    process: { env: { VIATOR_API_KEY: "test-only", VIATOR_API_ROOT: "https://api.sandbox.viator.com/partner" } },
    fetch: async (url, options) => {
      const path = new URL(url).pathname;
      if (path === "/partner/destinations") return Response.json({ destinations: [
        { destinationId: 1, name: "Japan", type: "COUNTRY" },
        { destinationId: 2, name: "Tokyo", type: "CITY", parentDestinationId: 1 },
        { destinationId: 3, name: "Yokohama", type: "CITY", parentDestinationId: 1 },
      ] });
      const body = JSON.parse(options.body);
      if (path === "/partner/search/freetext") {
        searches.push({ destination: body.productFiltering.destination, query: body.searchTerm });
        assert.equal(new URL(url).searchParams.get("campaign-value"), guide.viator.campaign);
        return Response.json({ products: { results: body.productFiltering.destination === "2" ? [forward,
          product("reverse", "Yokohama Port to Tokyo City Private Transfer"),
          product("ambiguous", "Tokyo and Yokohama port private transfer"),
        ] : [forward,
          product("airport", "Tokyo Narita Airport to Yokohama Port Transfer"),
          product("mixed", "Tokyo hotel to Yokohama port transfer", "Also available from Yokohama port to Tokyo hotels."),
          product("other-port", "Tokyo hotel to Tokyo International Cruise Terminal transfer"),
        ] } });
      }
      assert.equal(path, "/partner/availability/schedules/bulk");
      assert.deepEqual(body.productCodes, ["forward"]);
      return Response.json({ availabilitySchedules: [] });
    },
  });
  const response = await exports.GET(new Request(`https://example.com/api/viator/products?port=${guide.sourcePortSlug}&intent=${guide.topic}`));
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.deepEqual(searches, [
    { destination: "2", query: guide.viator.searchQueries[0] },
    { destination: "3", query: guide.viator.searchQueries[1] },
  ]);
  assert.deepEqual(payload.products.map(item => item.productCode), ["forward"]);
  assert.equal(payload.products[0].price, 123);
  assert.equal(payload.products[0].pricingPackageType, null);
});

test("quote comparison never treats missing or invalid amounts as a free fare", () => {
  const quote = { passengers: "4", outward: "", back: "", taxiExtras: "0", driver: "", driverExtras: "0" };
  assert.deepEqual(compareTransportQuotes(quote), { people: 4, taxiTotal: null, driverTotal: null, difference: null });
  for (const passengers of ["0", "-1", "2.5", "31", ""]) assert.equal(compareTransportQuotes({ ...quote, passengers }), null);
  for (const outward of ["-5", "1e2", "1.234", "100001", "NaN"]) assert.equal(compareTransportQuotes({ ...quote, outward, back: "5" }).taxiTotal, null);
  assert.equal(compareTransportQuotes({ ...quote, outward: "0", back: "0" }).taxiTotal, 0);
});
