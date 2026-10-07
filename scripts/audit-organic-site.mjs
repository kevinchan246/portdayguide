#!/usr/bin/env node
// Read-only, dependency-free audit of every sitemap page and discovered HTML link.
// Only same-site paths are requested; no API, affiliate or query-bearing links.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PRODUCTION_ORIGIN = "https://portdayguide.com";
const TIMEOUT_MS = 15_000;
const BODY_LIMIT = 3 * 1024 * 1024;
const MAX_PAGES = 500;
const CONCURRENCY = 3;
// A utility route may exist without a public navigation link or sitemap entry.
// Inspect its empty state only: never construct a private shared-plan query.
const SEED_PATHS = ["/", "/share"];

function options(args) {
  const config = { baseUrl: PRODUCTION_ORIGIN, output: "outputs/organic-audit.json", compare: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--help") return { help: true };
    if (!["--base-url", "--output", "--compare"].includes(args[i]) || !args[i + 1] || args[i + 1].startsWith("--")) throw new Error("Invalid argument");
    const key = args[i].slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    config[key] = args[++i];
  }
  const parsed = new URL(config.baseUrl);
  const local = ["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname);
  if ((parsed.protocol !== "https:" && !(local && parsed.protocol === "http:")) || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== "/") throw new Error("Origin required");
  config.baseUrl = parsed.origin;
  config.preview = config.baseUrl !== PRODUCTION_ORIGIN;
  config.output = path.resolve(config.output);
  const relative = path.relative(path.resolve("outputs"), config.output);
  if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative) || !config.output.endsWith(".json")) throw new Error("Output must be an ignored outputs/*.json file");
  if (config.compare) config.compare = path.resolve(config.compare);
  return config;
}

function decode(value = "") {
  return value.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n)))
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, entity => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&nbsp;": " " }[entity]));
}

function attributes(tag) {
  const result = {};
  const content = tag.replace(/^<\/?[\w:-]+/, "").replace(/\/?>$/, "");
  const regexp = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of content.matchAll(regexp)) result[match[1].toLowerCase()] = decode(match[2] ?? match[3] ?? match[4] ?? "");
  return result;
}

function text(html) {
  return decode(html.replace(/<(script|style|svg|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function matches(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"))].map(match => text(match[0]));
}

function htmlPath(href, pagePath, config) {
  try {
    const url = new URL(href, `${config.baseUrl}${pagePath}`);
    if (![config.baseUrl, PRODUCTION_ORIGIN].includes(url.origin) || url.search || !["https:", "http:"].includes(url.protocol)) return null;
    if (url.pathname.startsWith("/api/") || /\.(?:xml|txt|json|pdf|png|jpe?g|webp|gif|svg|ico|avif|mp4|css|js|woff2?|zip)$/i.test(url.pathname) || url.pathname.startsWith("/_next/")) return null;
    return url.pathname;
  } catch { return null; }
}

async function boundedText(response) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    for (;;) {
      const item = await reader.read();
      if (item.done) break;
      bytes += item.value.byteLength;
      if (bytes > BODY_LIMIT) { await reader.cancel(); throw new Error("Response exceeds inspection limit"); }
      chunks.push(Buffer.from(item.value));
    }
  } finally { reader.releaseLock(); }
  return Buffer.concat(chunks).toString("utf8");
}

async function get(url, accept) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, { method: "GET", credentials: "omit", redirect: "manual", signal: AbortSignal.timeout(TIMEOUT_MS), headers: { Accept: accept } });
      if (attempt === 1 && [429, 502, 503, 504].includes(response.status)) { await response.body?.cancel(); continue; }
      const body = response.status === 200 ? await boundedText(response) : "";
      if (response.status !== 200) await response.body?.cancel();
      return { status: response.status, contentType: response.headers.get("content-type") || "", robotsHeader: response.headers.get("x-robots-tag") || "", location: response.headers.get("location") || "", body };
    } catch {
      if (attempt === 2) return { status: null, error: "Request failed, exceeded inspection limit or timed out; not proof of a site outage", body: "", contentType: "", robotsHeader: "", location: "" };
    }
  }
}

async function sitemap(config) {
  const pending = ["/sitemap.xml"];
  const visited = new Set();
  const pages = new Map();
  const documents = [];
  while (pending.length) {
    const pathname = pending.shift();
    if (visited.has(pathname)) continue;
    if (visited.size >= 20) throw new Error("Sitemap index exceeds inspection limit");
    visited.add(pathname);
    const response = await get(`${config.baseUrl}${pathname}`, "application/xml,text/xml");
    documents.push({ path: pathname, status: response.status, error: response.error || null });
    if (response.status !== 200) throw new Error("Sitemap could not be inspected");
    const index = /<sitemapindex\b/i.test(response.body);
    const entries = [...response.body.matchAll(new RegExp(`<${index ? "sitemap" : "url"}\\b[^>]*>([\\s\\S]*?)<\\/${index ? "sitemap" : "url"}>`, "gi"))];
    for (const [, entry] of entries) {
      const loc = decode(entry.match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i)?.[1]?.trim() || "");
      const url = new URL(loc);
      if (![PRODUCTION_ORIGIN, config.baseUrl].includes(url.origin) || url.search || url.hash) throw new Error("Unexpected sitemap origin or non-canonical URL");
      if (index) pending.push(url.pathname);
      else {
        if (pages.has(url.pathname)) throw new Error("Duplicate sitemap URL");
        pages.set(url.pathname, { path: url.pathname, url: loc, lastModified: entry.match(/<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/i)?.[1]?.trim() || null });
      }
    }
  }
  if (!pages.size || pages.size > MAX_PAGES) throw new Error("Sitemap inventory empty or exceeds inspection limit");
  return { pages, documents };
}

function inspect(response, pathname, config) {
  const base = { path: pathname, status: response.status, contentType: response.contentType, robotsHeader: response.robotsHeader, redirect: response.location, error: response.error || null };
  if (response.status !== 200) return { ...base, internalLinks: [], images: [], issues: [response.status === null ? "request_incomplete" : response.status >= 400 ? "http_error" : "redirect"] };
  const html = response.body;
  const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
  const description = metas.find(meta => meta.name?.toLowerCase() === "description")?.content || "";
  const robots = metas.filter(meta => ["robots", "googlebot"].includes(meta.name?.toLowerCase())).map(meta => meta.content || "").join(", ");
  const canonicals = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).filter(link => link.rel?.split(/\s+/).includes("canonical")).map(link => link.href || "");
  const title = matches(html, "title")[0] || "";
  const h1 = matches(html, "h1");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
  const bodyText = text(main.replace(/<(header|footer|nav)\b[^>]*>[\s\S]*?<\/\1>/gi, " "));
  const internalLinks = [...new Set([...html.matchAll(/<a\b[^>]*>/gi)].map(match => attributes(match[0]).href).filter(Boolean).map(href => htmlPath(href, pathname, config)).filter(Boolean))];
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => {
    const attr = attributes(match[0]);
    return { src: attr.src || "", alt: attr.alt ?? null, width: attr.width || null, height: attr.height || null, loading: attr.loading || null, srcSet: Boolean(attr.srcset) };
  });
  const structuredData = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match => attributes(`<script${match[1]}>`).type === "application/ld+json").map(([, , value]) => {
    try {
      const data = JSON.parse(value);
      const nodes = Array.isArray(data) ? data : data["@graph"] || [data];
      return { valid: true, types: nodes.flatMap(node => node["@type"] || []).filter(Boolean), breadcrumbItems: nodes.filter(node => node["@type"] === "BreadcrumbList").flatMap(node => node.itemListElement || []).map(item => typeof item.item === "string" ? item.item : item.item?.["@id"]).filter(Boolean) };
    } catch { return { valid: false, types: [], breadcrumbItems: [] }; }
  });
  const issues = [];
  if (!/text\/html/i.test(response.contentType)) issues.push("unexpected_content_type");
  if (!title) issues.push("missing_title");
  if (!description) issues.push("missing_description");
  if (h1.length !== 1) issues.push("h1_count");
  if (canonicals.length !== 1) issues.push("canonical_count");
  else if (canonicals[0] !== `${PRODUCTION_ORIGIN}${pathname === "/" ? "" : pathname}` && !(pathname === "/" && canonicals[0] === `${PRODUCTION_ORIGIN}/`)) issues.push("canonical_mismatch");
  const indexBlocked = value => /(?:^|[,\s])(?:noindex|none)(?:[,\s]|$)/i.test(value);
  const noindexMeta = indexBlocked(robots);
  const noindexHeader = indexBlocked(response.robotsHeader);
  const noindex = noindexMeta || noindexHeader;
  // Accept a host-wide preview header, but catch accidental page-level noindex
  // in a local production build before that page is published.
  if (noindexMeta || (noindexHeader && !config.preview)) issues.push("noindex");
  if (structuredData.some(item => !item.valid)) issues.push("invalid_json_ld");
  if (images.some(item => item.alt === null)) issues.push("image_missing_alt");
  if (images.some(item => !item.width || !item.height)) issues.push("image_missing_dimensions");
  return { ...base, title, titleLength: title.length, description, descriptionLength: description.length, canonical: canonicals, robots, noindex, noindexMeta, noindexHeader, h1, h2: matches(main, "h2"), bodyText, bodyWordCount: bodyText.split(/\s+/).filter(Boolean).length, internalLinks, images, structuredData, issues };
}

function duplicates(pages, field) {
  const values = new Map();
  for (const page of pages) {
    const value = page[field];
    if (typeof value !== "string" || !value) continue;
    const key = value.trim().toLowerCase();
    if (!values.has(key)) values.set(key, []);
    values.get(key).push(page.path);
  }
  return [...values].filter(([, paths]) => paths.length > 1).map(([value, paths]) => ({ value, paths }));
}

async function main() {
  const config = options(process.argv.slice(2));
  if (config.help) {
    console.log("Usage: node scripts/audit-organic-site.mjs [--base-url HTTPS_OR_LOCALHOST_ORIGIN] [--output outputs/organic-audit.json] [--compare outputs/baseline.json]\nGET-only, 3 workers, 15-second timeout, one retry, 500-page limit. Audits every sitemap page, the empty /share utility seed, and discovered same-site HTML paths. API, query-bearing links and external/affiliate destinations are never requested. Production canonicals required on previews; host-wide preview noindex headers are recorded but accepted, while sitemap page-level meta noindex fails. JSON output must be under ignored outputs/. Exit 1 means incomplete crawl or blocking technical findings; intentional noindex utility headings and dimensional warnings alone do not fail.");
    return;
  }
  const startedAt = new Date().toISOString();
  const inventory = await sitemap(config);
  const robotsResponse = await get(`${config.baseUrl}/robots.txt`, "text/plain");
  const robotsTxt = { status: robotsResponse.status, contentType: robotsResponse.contentType, error: robotsResponse.error || null, directives: robotsResponse.body.split(/\r?\n/).map(line => line.replace(/#.*/, "").trim()).filter(Boolean) };
  const queued = new Set(inventory.pages.keys());
  for (const seed of SEED_PATHS) queued.add(seed);
  const pending = [...queued];
  const pages = [];
  while (pending.length) {
    const batch = pending.splice(0, CONCURRENCY);
    const inspected = await Promise.all(batch.map(async pathname => inspect(await get(`${config.baseUrl}${pathname}`, "text/html"), pathname, config)));
    for (const page of inspected) {
      page.inSitemap = inventory.pages.has(page.path);
      page.seededUtility = SEED_PATHS.includes(page.path) && !page.inSitemap;
      page.lastModified = inventory.pages.get(page.path)?.lastModified || null;
      pages.push(page);
      const discovered = [...page.internalLinks];
      if (page.redirect) {
        const redirectPath = htmlPath(page.redirect, page.path, config);
        if (redirectPath) discovered.push(redirectPath);
      }
      for (const linked of discovered) if (!queued.has(linked)) {
        if (queued.size >= MAX_PAGES) throw new Error("Discovered page inventory exceeds inspection limit");
        queued.add(linked); pending.push(linked);
      }
    }
  }
  pages.sort((a, b) => a.path.localeCompare(b.path));
  const byPath = new Map(pages.map(page => [page.path, page]));
  const incoming = new Map(pages.map(page => [page.path, []]));
  for (const page of pages) for (const link of page.internalLinks) if (link !== page.path && incoming.has(link)) incoming.get(link).push(page.path);
  const reachable = new Set(["/"]);
  const depths = new Map([["/", 0]]);
  const visit = ["/"];
  while (visit.length) {
    const page = byPath.get(visit.shift());
    if (!page) continue;
    for (const link of page.internalLinks) if (!reachable.has(link)) { reachable.add(link); depths.set(link, depths.get(page.path) + 1); visit.push(link); }
  }
  for (const page of pages) { page.incomingLinks = incoming.get(page.path); page.reachableFromHome = reachable.has(page.path); page.clickDepthFromHome = depths.get(page.path) ?? null; }
  const blocking = new Set(["request_incomplete", "http_error", "unexpected_content_type", "missing_title", "missing_description", "h1_count", "canonical_count", "canonical_mismatch", "noindex", "invalid_json_ld", "image_missing_alt"]);
  const findings = {
    blockingPages: pages.map(page => ({ path: page.path, issues: page.issues.filter(issue => blocking.has(issue) && !(["noindex", "canonical_mismatch"].includes(issue) && page.noindex && !page.inSitemap) && !(issue === "h1_count" && page.path === "/share" && page.noindex && !page.inSitemap)) })).filter(page => page.issues.length),
    nonIndexableCanonicalMismatches: pages.filter(page => page.noindex && !page.inSitemap && page.issues.includes("canonical_mismatch")).map(page => ({ path: page.path, canonical: page.canonical })),
    nonIndexableUtilityHeadingWarnings: pages.filter(page => page.path === "/share" && page.noindex && !page.inSitemap && page.issues.includes("h1_count")).map(page => ({ path: page.path, h1Count: page.h1.length })),
    sitemapRedirects: pages.filter(page => page.inSitemap && page.status !== null && page.status >= 300 && page.status < 400).map(page => ({ path: page.path, status: page.status, target: page.redirect })),
    // A preview-wide noindex header must not hide duplication in sitemap content.
    duplicateTitles: duplicates(pages.filter(page => page.inSitemap || !page.noindex), "title"),
    duplicateDescriptions: duplicates(pages.filter(page => page.inSitemap || !page.noindex), "description"),
    duplicateBodies: duplicates(pages.filter(page => page.inSitemap || !page.noindex), "bodyText").map(({ paths }) => ({ paths })),
    orphans: pages.filter(page => page.inSitemap && page.path !== "/" && !page.incomingLinks.length).map(page => page.path),
    unreachableFromHome: pages.filter(page => page.inSitemap && !page.reachableFromHome).map(page => page.path),
    brokenInternalLinks: pages.flatMap(page => page.internalLinks.filter(link => byPath.get(link)?.status >= 400).map(target => ({ source: page.path, target, status: byPath.get(target).status }))),
    missingImageDimensions: pages.filter(page => page.issues.includes("image_missing_dimensions")).map(page => ({ path: page.path, images: page.images.filter(item => !item.width || !item.height).map(item => item.src) })),
    longTitles: pages.filter(page => page.titleLength > 65).map(page => ({ path: page.path, length: page.titleLength, title: page.title })),
    descriptionLengthOutsideGuidance: pages.filter(page => page.description && (page.descriptionLength < 100 || page.descriptionLength > 170)).map(page => ({ path: page.path, length: page.descriptionLength })),
  };
  const summary = { sitemapPages: inventory.pages.size, crawledPages: pages.length, pagesOutsideSitemap: pages.filter(page => !page.inSitemap).length, navigatedPagesOutsideSitemap: pages.filter(page => !page.inSitemap && !page.seededUtility).length, seededUtilityPages: pages.filter(page => page.seededUtility).length, successfulPages: pages.filter(page => page.status === 200).length, incompletePages: pages.filter(page => page.status === null).length, robotsStatus: robotsTxt.status, blockingPages: findings.blockingPages.length, brokenInternalLinks: findings.brokenInternalLinks.length, orphanSitemapPages: findings.orphans.length, unreachableSitemapPages: findings.unreachableFromHome.length, maximumClickDepth: Math.max(...pages.map(page => page.clickDepthFromHome ?? 0)), duplicateTitles: findings.duplicateTitles.length, duplicateDescriptions: findings.duplicateDescriptions.length, duplicateBodies: findings.duplicateBodies.length, images: pages.reduce((sum, page) => sum + page.images.length, 0), uniqueImageSources: new Set(pages.flatMap(page => page.images.map(item => item.src))).size, missingImageDimensions: findings.missingImageDimensions.length };
  const report = { schemaVersion: 1, startedAt, completedAt: new Date().toISOString(), baseUrl: config.baseUrl, mode: config.preview ? "preview" : "production", seedPaths: SEED_PATHS, limits: { concurrency: CONCURRENCY, maxPages: MAX_PAGES, timeoutMs: TIMEOUT_MS, bodyBytes: BODY_LIMIT }, scope: "Every sitemap HTML URL, the empty /share utility seed and discovered query-free internal HTML links; static response HTML only. No browser rendering, API, external/affiliate navigation or analytics events. Image URL availability, licensing, live products and search rankings require separate verification.", summary, sitemapDocuments: inventory.documents, robotsTxt, findings, pages };
  if (config.compare) {
    const baseline = JSON.parse(await readFile(config.compare, "utf8"));
    const before = new Map(baseline.pages.map(page => [page.path, page]));
      report.comparison = { baselineOrigin: baseline.baseUrl, baselineCompletedAt: baseline.completedAt, summaryBefore: baseline.summary, summaryAfter: summary, changedPages: pages.filter(page => before.has(page.path)).map(page => { const previous = before.get(page.path); return { path: page.path, fields: ["status", "title", "description", "canonical", "h1", "bodyWordCount", "internalLinks", "images", "issues"].filter(field => JSON.stringify(previous[field]) !== JSON.stringify(page[field])) }; }).filter(item => item.fields.length), addedPages: pages.filter(page => !before.has(page.path)).map(page => page.path), removedPages: baseline.pages.filter(page => !byPath.has(page.path)).map(page => page.path) };
  }
  await mkdir(path.dirname(config.output), { recursive: true });
  await writeFile(config.output, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ output: path.relative(process.cwd(), config.output), ...summary, blockingPages: findings.blockingPages, sitemapRedirects: findings.sitemapRedirects, orphans: findings.orphans, unreachableFromHome: findings.unreachableFromHome, duplicateTitles: findings.duplicateTitles, duplicateDescriptions: findings.duplicateDescriptions }, null, 2));
  if (summary.incompletePages || robotsTxt.status === null || findings.blockingPages.length || findings.sitemapRedirects.length || findings.brokenInternalLinks.length || findings.orphans.length || findings.unreachableFromHome.length) process.exitCode = 1;
}

try { await main(); }
catch { console.error("Organic audit could not complete. Check origin, sitemap, response limits and output path with --help; no raw headers or response bodies are printed."); process.exitCode = 1; }
