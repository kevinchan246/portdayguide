import { getStore } from "@netlify/blobs";
import { AFFILIATE_STORE } from "../lib/affiliate-events.mjs";
import { reportDates, readClickDays, combineClickDays } from "../lib/affiliate-reporting.mjs";

const [from, to] = process.argv.slice(2);
const dates = reportDates(from, to);
if (!process.env.NETLIFY_SITE_ID || !process.env.NETLIFY_AUTH_TOKEN) {
  throw new Error("Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN locally. Never use NEXT_PUBLIC_ for these credentials.");
}
const store = getStore({ name: AFFILIATE_STORE, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN, consistency: "strong" });
const days = await readClickDays(store, dates, { maxRecords: 50000, deadline: Date.now() + 300000 });
const columns = ["page", "product", "campaign", "placement", "source", "clicks"];
const quote = value => `"${String(value).replaceAll('"', '""')}"`;
console.log(columns.join(","));
for (const row of combineClickDays(days)) console.log(columns.map(key => quote(row[key])).join(","));
