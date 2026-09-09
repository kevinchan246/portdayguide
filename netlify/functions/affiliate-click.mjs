import { getStore } from "@netlify/blobs";
import { AFFILIATE_STORE, validateAffiliateEvent } from "../../lib/affiliate-events.mjs";

const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
const response = status => new Response(null, { status, headers });

// Export the factory so validation and failure paths use the real handler in tests.
export function createHandler(openStore = getStore) {
  return async (request, context) => {
    if (request.method !== "POST") return response(405);
    if (context?.deploy?.context !== "production") return response(204);
    if (new URL(request.url).hostname !== "portdayguide.com" || request.headers.get("origin") !== "https://portdayguide.com") return response(403);
    if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1") return response(204);
    if (!request.headers.get("content-type")?.startsWith("application/json")) return response(415);
    if (Number(request.headers.get("content-length")) > 2048) return response(413);
    let payload;
    try {
      const reader = request.body?.getReader();
      if (!reader) return response(400);
      const chunks = [];
      let length = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        length += value.byteLength;
        if (length > 2048) { await reader.cancel(); return response(413); }
        chunks.push(value);
      }
      payload = validateAffiliateEvent(JSON.parse(Buffer.concat(chunks).toString("utf8")));
    } catch { return response(400); }
    if (!payload) return response(400);
    try {
      const date = new Date().toISOString().slice(0, 10);
      // Unique event keys avoid lost increments under concurrent serverless invocations.
      await openStore(AFFILIATE_STORE).setJSON(`${date}/${crypto.randomUUID()}`, { ...payload, date });
      return response(204);
    } catch {
      console.error("Affiliate click storage unavailable");
      return response(503);
    }
  };
}

export default createHandler();
export const config = { rateLimit: { action: "rate_limit", aggregateBy: "ip", windowLimit: 60, windowSize: 60 } };
