import test from "node:test";
import assert from "node:assert/strict";
import { PAGE_PATHS, PRODUCTION_ORIGIN, checkPage, checkProducts, checkRobots, checkSitemap, classifyStatus, inspectTarget, parseBaseUrl } from "../lib/site-health.mjs";

const body = "Use this practical port guide to compare terminal directions, travel time, meeting points, luggage limits, and return options before choosing your route.";
const html = (path = "/planner", extra = "") => `<html><head><link rel="canonical" href="${PRODUCTION_ORIGIN}${path}">${extra}</head><body><h1>Plan a port day</h1><p>${body}</p><a href="/ports/yokohama-tokyo">Yokohama port guide</a></body></html>`;
const codes = issues => issues.map(item => item.code);
const campaign = "pdg-tokyo-to-yokohama";
const productUrl = `https://www.viator.com/tours/Tokyo/Transfer/d334-123P1?pid=P123&campaign=${campaign}`;
const products = (url = productUrl) => JSON.stringify({ campaign, products: [{ productUrl: url }] });

test("production pages reject meta and header noindex; deploy preview noindex is accepted", () => {
  assert.deepEqual(checkPage(html(), "/planner"), []);
  assert.ok(codes(checkPage(html("/planner", '<meta content="noindex,follow" name="robots">'), "/planner")).includes("production_noindex"));
  assert.ok(codes(checkPage(html(), "/planner", { robotsHeader: "googlebot: noindex" })).includes("production_noindex"));
  assert.ok(codes(checkPage(html("/planner", '<meta name="googlebot" content="none">'), "/planner")).includes("production_noindex"));
  assert.deepEqual(checkPage(html("/planner", '<meta name="robots" content="noindex">'), "/planner", { preview: true, robotsHeader: "noindex" }), []);
});

test("production pages keep crawlable text, internal links and search snippets available", () => {
  assert.ok(codes(checkPage(html("/planner", '<meta name="robots" content="max-snippet:0">'), "/planner")).includes("production_snippet_blocked"));
  assert.ok(codes(checkPage(html("/planner", '<meta name="bingbot" content="nosnippet">'), "/planner")).includes("production_snippet_blocked"));
  assert.ok(codes(checkPage(html(), "/planner", { robotsHeader: "nosnippet" })).includes("production_snippet_blocked"));
  assert.ok(codes(checkPage(html().replace(`<p>${body}</p>`, ""), "/planner")).includes("crawlable_body_missing"));
  assert.ok(codes(checkPage(html().replace('<a href="/ports/yokohama-tokyo">Yokohama port guide</a>', ""), "/planner")).includes("internal_link_missing"));
});

test("canonical must be absolute and point to the same production page, including on previews", () => {
  for (const replacement of ["https://preview.netlify.app/planner", "/planner", "https://portdayguide.com/", "https://portdayguide.com/planner?x=1"]) {
    const changed = html().replace(`${PRODUCTION_ORIGIN}/planner`, replacement);
    assert.ok(codes(checkPage(changed, "/planner", { preview: true })).includes("canonical_mismatch"));
  }
  assert.ok(codes(checkPage(html().replace("</head>", '<link rel="canonical" href="https://portdayguide.com/planner"></head>'), "/planner")).includes("canonical_count"));
});

test("one real H1 is required, ignoring comment/script/template contents", () => {
  const extra = '<!-- <h1>comment</h1> --><script>const x="<h1>script</h1>";</script><template><h1>inactive</h1></template>';
  assert.deepEqual(checkPage(html() + extra, "/planner"), []);
  assert.ok(codes(checkPage(html() + "<h1>Duplicate</h1>", "/planner")).includes("h1_count"));
  assert.ok(codes(checkPage(html().replace(/<h1>.*?<\/h1>/, ""), "/planner")).includes("h1_count"));
});

test("affiliate URLs require HTTPS Viator host, pid and preserved campaign", () => {
  assert.deepEqual(checkProducts(products(), campaign), []);
  for (const value of [productUrl.replace("https:", "http:"), productUrl.replace("www.viator.com", "www.viator.com.evil.example"), productUrl.replace("www.viator.com", "evil.example"), productUrl.replace("pid=P123&", ""), productUrl.replace("pid=P123", "pid=%20"), productUrl.replace("www.viator.com", "secret@www.viator.com")]) {
    assert.ok(codes(checkProducts(products(value), campaign)).includes("product_affiliate_url_invalid"));
  }
  assert.ok(codes(checkProducts(products(productUrl.replace(campaign, "other")), campaign)).includes("product_campaign_mismatch"));
  assert.ok(codes(checkProducts(products(), "expected-other-campaign")).includes("products_campaign_invalid"));
});

test("empty inventory is a warning, malformed API data is a failure", () => {
  const target = { kind: "products", path: "/api/viator/products" };
  const result = inspectTarget(target, { status: 200, body: JSON.stringify({ campaign, products: [] }) });
  assert.equal(result.state, "warning");
  assert.equal(result.issues[0].code, "empty_inventory");
  assert.ok(codes(checkProducts("<html>blocked</html>")).includes("products_invalid_json"));
  assert.ok(codes(checkProducts(JSON.stringify({ campaign, products: {} }))).includes("products_invalid_shape"));
  assert.ok(codes(checkProducts(JSON.stringify({ products: [] }))).includes("products_campaign_invalid"));
});

test("robots honors path-specific rules, search crawler groups, allow precedence and preview exclusion", () => {
  const sitemap = `\nSitemap: ${PRODUCTION_ORIGIN}/sitemap.xml`;
  assert.deepEqual(checkRobots(`User-agent: *\nAllow: /\nDisallow: /api/${sitemap}`), []);
  assert.ok(codes(checkRobots(`User-agent: *\nDisallow: /${sitemap}`)).includes("robots_blocks_page"));
  assert.ok(codes(checkRobots(`User-agent: *\nAllow: /\nUser-agent: Googlebot\nDisallow: /ports/${sitemap}`)).includes("robots_blocks_page"));
  assert.ok(codes(checkRobots(`User-agent: *\nAllow: /\nUser-agent: Bingbot\nDisallow: /ports/${sitemap}`)).includes("robots_blocks_page"));
  assert.ok(codes(checkRobots(`User-agent: *\nAllow: /\nUser-agent: OAI-SearchBot\nDisallow: /ports/${sitemap}`)).includes("robots_blocks_page"));
  assert.ok(codes(checkRobots(`User-agent: *\nDisallow: /*cruise-terminal$${sitemap}`)).includes("robots_blocks_page"));
  assert.deepEqual(checkRobots(`User-agent: *\nDisallow: /\nAllow: /${sitemap}`), []);
  assert.deepEqual(checkRobots("User-agent: *\nDisallow: /", { preview: true }), []);
});

test("sitemap requires all focus pages and canonical production hosts", () => {
  const xml = `<urlset>${PAGE_PATHS.map(path => `<url><loc>${PRODUCTION_ORIGIN}${path}</loc></url>`).join("")}</urlset>`;
  assert.deepEqual(checkSitemap(xml), []);
  assert.ok(codes(checkSitemap(xml.replace("<loc>https://portdayguide.com/planner</loc>", ""))).includes("sitemap_missing_page"));
  assert.ok(codes(checkSitemap(xml.replace("https://portdayguide.com/planner", "https://preview.netlify.app/planner"))).includes("sitemap_noncanonical"));
});

test("blocked or rate-limited inspection is distinct from server failure", () => {
  assert.equal(classifyStatus(403), "access_limited");
  assert.equal(classifyStatus(429), "access_limited");
  assert.equal(classifyStatus(503), "site_failure");
  assert.equal(classifyStatus(302), "unexpected_http_status");
  assert.equal(inspectTarget({ kind: "page", path: "/" }, { status: 403, body: "" }).state, "failure");
});

test("base URL accepts HTTPS previews and localhost but rejects credentials and arbitrary HTTP", () => {
  assert.equal(parseBaseUrl(), PRODUCTION_ORIGIN);
  assert.equal(parseBaseUrl("https://deploy-preview-12--example.netlify.app/"), "https://deploy-preview-12--example.netlify.app");
  assert.equal(parseBaseUrl("http://127.0.0.1:4173"), "http://127.0.0.1:4173");
  assert.equal(parseBaseUrl("http://[::1]:4173"), "http://[::1]:4173");
  for (const value of ["http://example.com", "https://user:password@example.com", "https://example.com/path", "https://example.com?token=secret", "file:///tmp/site"]) assert.throws(() => parseBaseUrl(value));
});
