import test from "node:test";
import assert from "node:assert/strict";
import { KNOWN_TEST_KEYS, combineClickDays, lastCompleteDays, readClickDays, reportDates, saveDailyReport, removeExpiredReports } from "../lib/affiliate-reporting.mjs";
import { createReportHandler } from "../netlify/functions/affiliate-daily-report.mjs";

const event = { type: "click", page: "/ports/cozumel/taxi-rates", product: "22191P1", campaign: "pdg-cozumel-taxi-rates", placement: "cozumel-driver-options", date: "2026-09-10" };
function source(records) {
  return {
    async *list({ prefix }) { const keys = [...records.keys()].filter(key => key.startsWith(prefix)); for (let i = 0; i < keys.length; i += 2) yield { blobs: keys.slice(i, i + 2).map(key => ({ key })) }; },
    async get(key) { return records.get(key); },
  };
}

test("complete UTC windows exclude today and validate dates", () => {
  const dates = lastCompleteDays(new Date("2026-09-14T05:07:00Z"));
  assert.equal(dates.length, 28);
  assert.equal(dates[0], "2026-08-17");
  assert.equal(dates.at(-1), "2026-09-13");
  for (const pair of [["2026-02-30", "2026-03-01"], ["2026-09-14", "2026-09-13"], ["2026-01-01", "2026-09-14"]]) assert.throws(() => reportDates(...pair));
});

test("exclude only the known test key, preserve other same-day clicks and pagination", async () => {
  const records = new Map([[[...KNOWN_TEST_KEYS][0], event], ["2026-09-10/real-1", event], ["2026-09-10/real-2", event], ["2026-09-10/invalid", { ...event, date: "2026-09-11" }]]);
  const [day] = await readClickDays(source(records), ["2026-09-10"]);
  assert.equal(day.recordedClicks, 2);
  assert.equal(day.excludedTestClicks, 1);
  assert.equal(day.invalidRecords, 1);
  assert.equal(day.rows[0].clicks, 2);
  assert.equal(day.rows[0].source, "unspecified");
});

test("combining old reports and tagged rows preserves source groups and the total click count", () => {
  const row = { page: event.page, product: event.product, campaign: event.campaign, placement: event.placement, clicks: 2 };
  const combined = combineClickDays([
    { rows: [row, { ...row, source: "pinterest", clicks: 3 }] },
    { rows: [{ ...row, source: "unspecified", clicks: 1 }, { ...row, source: "pinterest", clicks: 2 }, { ...row, source: "checklist", clicks: 1 }, { ...row, source: "someone@example.com", clicks: 1 }] },
  ]);
  assert.deepEqual(combined.map(({ source, clicks }) => ({ source, clicks })), [
    { source: "pinterest", clicks: 5 }, { source: "unspecified", clicks: 4 }, { source: "checklist", clicks: 1 },
  ]);
  assert.equal(combined.reduce((sum, row) => sum + row.clicks, 0), 10);
});

test("retries produce deterministic archives without double counting", async () => {
  const records = new Map([["2026-09-10/real", event]]);
  const reports = new Map();
  const destination = { async setJSON(key, value) { reports.set(key, value); } };
  const now = new Date("2026-09-14T05:07:00Z");
  const first = await saveDailyReport(source(records), destination, now);
  await saveDailyReport(source(records), destination, now);
  assert.equal(reports.size, 29);
  assert.equal(reports.get("latest").recordedClicks, 1);
  assert.equal(first.last7Days[0].clicks, 1);
  assert.equal(first.previous7Days.length, 0);
  assert.equal(first.dataSources.completedCommission, "not_collected");
  assert.equal("revenue" in first, false);
  assert.equal(first.schemaVersion, 2);
  assert.match(first.sourceScope, /no cross-page attribution/);
});

test("failed or missing reads and record caps do not publish an incomplete latest report", async () => {
  let writes = 0;
  const destination = { async setJSON() { writes += 1; } };
  const broken = { async *list() { yield { blobs: [{ key: "2026-08-17/missing" }] }; }, async get() { return null; } };
  await assert.rejects(saveDailyReport(broken, destination, new Date("2026-09-14T05:07:00Z")), /could not be read/);
  assert.equal(writes, 0);
  await assert.rejects(readClickDays(source(new Map([["2026-09-10/real", event]])), ["2026-09-10"], { maxRecords: 0 }), /record limit/);
  await assert.rejects(readClickDays(source(new Map()), ["2026-09-10"], { deadline: 0 }), /time budget/);
});

test("archive failure cannot replace latest, and preview invocation never touches storage", async () => {
  let latestWritten = false;
  await assert.rejects(saveDailyReport(source(new Map()), { async setJSON(key) { if (key.startsWith("daily/")) throw new Error("storage"); if (key === "latest") latestWritten = true; } }));
  assert.equal(latestWritten, false);
  const handler = createReportHandler(() => assert.fail("preview must not open private stores"));
  await handler(null, { deploy: { context: "deploy-preview" } });
  await handler(null, {});
});

test("aggregate retention removes expired dates while keeping the boundary and latest", async () => {
  const deleted = [];
  await removeExpiredReports({ async *list() { yield { blobs: ["daily/2025-09-13", "snapshots/2025-09-13", "daily/2025-09-14", "latest"].map(key => ({ key })) }; }, async delete(key) { deleted.push(key); } }, new Date("2026-09-14T05:07:00Z"));
  assert.deepEqual(deleted, ["daily/2025-09-13", "snapshots/2025-09-13"]);
});

test("a final source read past the shared deadline cannot publish archives or latest", async () => {
  const originalNow = Date.now;
  let clock = originalNow();
  let writes = 0;
  Date.now = () => clock;
  try {
    const slow = source(new Map([["2026-09-13/last", { ...event, date: "2026-09-13" }]]));
    const get = slow.get;
    slow.get = async key => { clock += 35000; return get(key); };
    await assert.rejects(saveDailyReport(slow, { async setJSON() { writes += 1; } }, new Date("2026-09-14T05:07:00Z"), { deadline: clock + 25000 }), /time budget/);
    assert.equal(writes, 0);
  } finally { Date.now = originalNow; }
});

test("a stalled listing is timed out rather than waiting for the platform to terminate", async () => {
  await assert.rejects(readClickDays({ async *list() { await new Promise(resolve => setTimeout(resolve, 60)); yield { blobs: [] }; } }, ["2026-09-13"], { deadline: Date.now() + 10 }), /time budget/);
});
