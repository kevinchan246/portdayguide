export const PRODUCTION_ORIGIN = "https://portdayguide.com";
export const PAGE_PATHS = ["/", "/planner", "/ports/yokohama-tokyo", "/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal"];
export const HEALTH_TARGETS = [
  ...PAGE_PATHS.map(path => ({ path, kind: "page" })),
  { path: "/robots.txt", kind: "robots" },
  { path: "/sitemap.xml", kind: "sitemap" },
  { path: "/api/viator/products?port=yokohama-tokyo", kind: "products", campaign: "portdayguide-yokohama-tokyo" },
  { path: "/api/viator/products?port=yokohama-tokyo&intent=tokyo-to-yokohama-cruise-terminal", kind: "products", campaign: "pdg-tokyo-to-yokohama-cruise-terminal" },
];

export function parseBaseUrl(value = PRODUCTION_ORIGIN) {
  const url = new URL(value);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if ((url.protocol !== "https:" && !(local && url.protocol === "http:")) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("--base-url must be an HTTPS origin or HTTP localhost origin, without credentials, path, query or fragment");
  }
  return url.origin;
}

const issue = (code, message, severity = "failure") => ({ code, severity, message });
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt);/gi, (match, entity) => {
  if (entity[0] === "#") {
    const point = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
  }
  return { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">" }[entity.toLowerCase()];
});
const htmlSource = html => html.replace(/<!--[\s\S]*?-->/g, "").replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "");

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([^\s=<>/'"]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

function noindex(value) {
  return /(?:^|[\s,:])(?:noindex|none)(?:$|[\s,;])/i.test(value || "");
}

function snippetBlocked(value) {
  return /(?:^|[\s,:])nosnippet(?:$|[\s,;])/i.test(value || "") || /(?:^|[\s,;])max-snippet\s*:\s*0(?:$|[\s,;])/i.test(value || "");
}

function visibleText(source) {
  const body = source.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1] || "";
  return decode(body.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function hasInternalLink(source, path) {
  return [...source.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href).some(href => {
    if (!href || /^(?:#|mailto:|tel:|javascript:)/i.test(href)) return false;
    try {
      const url = new URL(href, PRODUCTION_ORIGIN);
      return url.origin === PRODUCTION_ORIGIN && url.pathname !== path;
    } catch { return false; }
  });
}

function productionUrl(path) {
  return new URL(path, PRODUCTION_ORIGIN).href;
}

export function checkPage(html, path, { preview = false, robotsHeader = "" } = {}) {
  const issues = [];
  const source = htmlSource(html);
  const h1Count = [...source.matchAll(/<h1(?:\s[^>]*|)>/gi)].length;
  if (h1Count !== 1) issues.push(issue("h1_count", `Expected one H1; found ${h1Count}`));
  const canonical = [...source.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0]))
    .filter(attrs => (attrs.rel || "").toLowerCase().split(/\s+/).includes("canonical"));
  if (canonical.length !== 1) issues.push(issue("canonical_count", `Expected one canonical; found ${canonical.length}`));
  else {
    try {
      // Absolute production URLs only, even when testing a deploy preview.
      if (new URL(canonical[0].href).href !== productionUrl(path)) throw new Error("mismatch");
    } catch { issues.push(issue("canonical_mismatch", "Canonical must match this page on https://portdayguide.com")); }
  }
  const robots = [...source.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]))
    .filter(attrs => ["robots", "googlebot", "bingbot"].includes((attrs.name || "").toLowerCase()));
  if (!preview && (noindex(robotsHeader) || robots.some(attrs => noindex(attrs.content)))) {
    issues.push(issue("production_noindex", "Production page has a noindex or none directive"));
  }
  if (!preview && (snippetBlocked(robotsHeader) || robots.some(attrs => snippetBlocked(attrs.content)))) {
    issues.push(issue("production_snippet_blocked", "Production page disables search-result snippets"));
  }
  if (visibleText(source).length < 120) issues.push(issue("crawlable_body_missing", "Page has less than 120 characters of crawlable body text"));
  if (!hasInternalLink(source, path)) issues.push(issue("internal_link_missing", "Page has no crawlable internal link to another page"));
  return issues;
}

function robotsGroups(text) {
  const groups = [];
  let group = null;
  let hasRules = false;
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*/, "").trim().match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!match) continue;
    const key = match[1].toLowerCase();
    const value = match[2].trim();
    if (key === "user-agent") {
      if (!group || hasRules) { group = { agents: [], rules: [] }; groups.push(group); hasRules = false; }
      group.agents.push(value.toLowerCase());
    } else if (group && ["allow", "disallow"].includes(key)) {
      hasRules = true;
      if (value) group.rules.push({ allow: key === "allow", value });
    }
  }
  return groups;
}

function blocked(groups, path, agent) {
  const specific = groups.filter(group => group.agents.includes(agent));
  const selected = specific.length ? specific : groups.filter(group => group.agents.includes("*"));
  let winning = null;
  for (const rule of selected.flatMap(group => group.rules)) {
    const terminal = rule.value.endsWith("$");
    const pattern = (terminal ? rule.value.slice(0, -1) : rule.value).split("*")
      .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(".*");
    if (!new RegExp(`^${pattern}${terminal ? "$" : ""}`).test(path)) continue;
    const length = rule.value.replace(/[*$]/g, "").length;
    if (!winning || length > winning.length || (length === winning.length && rule.allow)) winning = { ...rule, length };
  }
  return winning && !winning.allow;
}

export function checkRobots(text, { preview = false } = {}) {
  if (!/^\s*user-agent\s*:/im.test(text)) return [issue("robots_invalid", "robots.txt has no User-agent directives")];
  if (preview) return []; // Preview-wide crawl exclusion is expected.
  const groups = robotsGroups(text);
  const issues = [];
  for (const agent of ["*", "googlebot", "bingbot", "oai-searchbot"]) {
    for (const path of PAGE_PATHS) {
      if (blocked(groups, path, agent)) issues.push(issue("robots_blocks_page", `robots.txt blocks ${agent} at ${path}`));
    }
  }
  const sitemaps = [...text.matchAll(/^\s*sitemap\s*:\s*(\S+)\s*$/gim)].map(match => match[1]);
  if (!sitemaps.includes(`${PRODUCTION_ORIGIN}/sitemap.xml`)) issues.push(issue("robots_sitemap_missing", "robots.txt must advertise the production sitemap"));
  return issues;
}

export function checkSitemap(xml) {
  const issues = [];
  if (!/<(?:\w+:)?urlset\b/i.test(xml)) return [issue("sitemap_invalid", "Expected a sitemap urlset")];
  const urls = [...xml.matchAll(/<(?:\w+:)?loc\b[^>]*>([\s\S]*?)<\/(?:\w+:)?loc\s*>/gi)].map(match => decode(match[1].trim()));
  const normalized = new Set();
  let foreign = 0;
  for (const value of urls) {
    try {
      const url = new URL(value);
      if (url.origin !== PRODUCTION_ORIGIN || url.username || url.password || url.search || url.hash) foreign++;
      else normalized.add(url.href);
    } catch { foreign++; }
  }
  if (foreign) issues.push(issue("sitemap_noncanonical", `${foreign} sitemap URLs are invalid or outside the canonical production site`));
  for (const path of PAGE_PATHS) {
    if (!normalized.has(productionUrl(path))) issues.push(issue("sitemap_missing_page", `Sitemap does not contain ${path}`));
  }
  return issues;
}

export function checkProducts(text, expectedCampaign) {
  let payload;
  try { payload = JSON.parse(text); } catch { return [issue("products_invalid_json", "Product API did not return valid JSON")]; }
  if (!payload || !Array.isArray(payload.products)) return [issue("products_invalid_shape", "Product API must contain a products array")];
  const issues = [];
  if (typeof payload.campaign !== "string" || !payload.campaign.trim() || (expectedCampaign && payload.campaign !== expectedCampaign)) {
    issues.push(issue("products_campaign_invalid", "Product API campaign is missing or differs from the expected campaign"));
  }
  for (let index = 0; index < payload.products.length; index++) {
    const product = payload.products[index];
    try {
      const url = new URL(product?.productUrl);
      if (url.protocol !== "https:" || !/(^|\.)viator\.com$/i.test(url.hostname) || url.username || url.password || (url.port && url.port !== "443") || !url.searchParams.get("pid")?.trim()) {
        throw new Error("invalid");
      }
      if (url.searchParams.get("campaign") !== payload.campaign) issues.push(issue("product_campaign_mismatch", `Product ${index + 1} link does not preserve the response campaign`));
    } catch { issues.push(issue("product_affiliate_url_invalid", `Product ${index + 1} must have an HTTPS Viator URL with pid`)); }
  }
  if (!payload.products.length) issues.push(issue("empty_inventory", "No matching inventory; verify availability and matching before changing recommendations", "warning"));
  return issues;
}

export function classifyStatus(status) {
  if (status === 403 || status === 429) return "access_limited";
  if (status >= 500) return "site_failure";
  if (status !== 200) return "unexpected_http_status";
  return "ok";
}

export function inspectTarget(target, { status, body, contentType = "", robotsHeader = "" }, { preview = false } = {}) {
  const category = classifyStatus(status);
  if (category !== "ok") {
    const message = category === "access_limited" ? "Access was blocked or rate limited; site health could not be verified" : `Expected HTTP 200; received ${status}`;
    return { state: "failure", category, issues: [issue(category, message)] };
  }
  let issues;
  if (target.kind === "page") {
    issues = checkPage(body, target.path, { preview, robotsHeader });
    if (!/\btext\/html\b/i.test(contentType)) issues.push(issue("content_type_invalid", "Page did not return text/html"));
  } else if (target.kind === "robots") issues = checkRobots(body, { preview });
  else if (target.kind === "sitemap") issues = checkSitemap(body);
  else issues = checkProducts(body, target.campaign);
  const state = issues.some(item => item.severity === "failure") ? "failure" : issues.length ? "warning" : "pass";
  const inventory = {};
  if (target.kind === "products") {
    try {
      const payload = JSON.parse(body);
      inventory.productCount = Array.isArray(payload?.products) ? payload.products.length : null;
      inventory.sourceUpdatedAt = typeof payload?.updatedAt === "string" && !Number.isNaN(Date.parse(payload.updatedAt)) ? payload.updatedAt : null;
    } catch { inventory.productCount = null; }
  }
  return { state, category: state === "failure" ? "content_failure" : "ok", issues, ...inventory };
}
