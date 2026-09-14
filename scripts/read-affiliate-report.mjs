import { getStore } from "@netlify/blobs";
import { REPORT_STORE } from "../lib/affiliate-reporting.mjs";

if (!process.env.NETLIFY_SITE_ID || !process.env.NETLIFY_AUTH_TOKEN) {
  throw new Error("Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN in the operator environment. Never commit credentials or private report output.");
}
const store = getStore({ name: REPORT_STORE, siteID: process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_AUTH_TOKEN, consistency: "strong" });
const report = await store.get("latest", { type: "json" });
if (!report) throw new Error("No completed daily report exists yet. Run the scheduled function from Netlify and check its logs.");
console.log(JSON.stringify(report, null, 2));
