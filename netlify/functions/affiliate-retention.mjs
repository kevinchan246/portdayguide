import { getStore } from "@netlify/blobs";
import { AFFILIATE_STORE } from "../../lib/affiliate-events.mjs";

export async function removeExpiredClicks(store, now = new Date()) {
  const cutoff = new Date(now.getTime() - 90 * 86400000).toISOString().slice(0, 10);
  let removed = 0;
  for await (const page of store.list({ paginate: true })) {
    for (const blob of page.blobs) {
      if (/^\d{4}-\d{2}-\d{2}\//.test(blob.key) && blob.key.slice(0, 10) < cutoff) {
        await store.delete(blob.key);
        removed += 1;
      }
    }
  }
  return removed;
}

export default async function handler(_request, context) {
  if (context?.deploy?.context !== "production") return;
  const removed = await removeExpiredClicks(getStore(AFFILIATE_STORE));
  console.info(`Removed ${removed} expired affiliate click records`);
}
export const config = { schedule: "17 4 * * *" };
