import { getStore } from "@netlify/blobs";
import { AFFILIATE_STORE, summarizeAffiliateEvents } from "../lib/affiliate-events.mjs";

const [from, to] = process.argv.slice(2);
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
if (!validDate(from) || !validDate(to) || from > to || (Date.parse(to) - Date.parse(from)) / 86400000 > 92) {
  throw new Error("Usage: node scripts/report-affiliate-clicks.mjs YYYY-MM-DD YYYY-MM-DD (inclusive, at most 93 days)");
}
if (!process.env.NETLIFY_SITE_ID || !process.env.NETLIFY_AUTH_TOKEN) {
  throw new Error("Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN locally. Never use NEXT_PUBLIC_ for these credentials.");
}
const store = getStore({ name: AFFILIATE_STORE, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN, consistency: "strong" });
const events = [];
for (let day = Date.parse(from); day <= Date.parse(to); day += 86400000) {
  const prefix = new Date(day).toISOString().slice(0, 10) + "/";
  for await (const page of store.list({ prefix, paginate: true })) {
    for (const blob of page.blobs) {
      const event = await store.get(blob.key, { type: "json" });
      if (event) events.push(event);
    }
  }
}
const columns = ["page", "product", "campaign", "placement", "clicks"];
const quote = value => `"${String(value).replaceAll('"', '""')}"`;
console.log(columns.join(","));
for (const row of summarizeAffiliateEvents(events)) console.log(columns.map(key => quote(row[key])).join(","));
