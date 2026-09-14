import { summarizeAffiliateEvents, validateAffiliateEvent } from "./affiliate-events.mjs";

export const REPORT_STORE = "affiliate-reports-v1";
export const KNOWN_TEST_KEYS = new Set(["2026-09-10/42bdb7ce-45f7-4fa5-8515-26c01f5d9626"]);
const DAY = 86400000;

function assertBudget(deadline) {
  if (Date.now() >= deadline) throw new Error("Click report exceeded its time budget; previous report retained.");
}

async function withinBudget(action, deadline) {
  assertBudget(deadline);
  let timer;
  try {
    const result = await Promise.race([
      action(),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Click report exceeded its time budget; previous report retained.")), Math.max(1, deadline - Date.now())); }),
    ]);
    assertBudget(deadline);
    return result;
  } finally { clearTimeout(timer); }
}

async function* pagesWithinBudget(store, options, deadline) {
  const iterator = store.list(options)[Symbol.asyncIterator]();
  while (true) {
    const page = await withinBudget(() => iterator.next(), deadline);
    if (page.done) return;
    yield page.value;
  }
}

export function validReportDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value || "") && !Number.isNaN(Date.parse(value))
    && new Date(value).toISOString().slice(0, 10) === value;
}

/** Inclusive UTC dates. Explicit bounds prevent accidental full-store exports. */
export function reportDates(from, to) {
  if (!validReportDate(from) || !validReportDate(to) || from > to || (Date.parse(to) - Date.parse(from)) / DAY > 89) {
    throw new Error("Use an inclusive date range of at most 90 days (YYYY-MM-DD).");
  }
  const result = [];
  for (let day = Date.parse(from); day <= Date.parse(to); day += DAY) result.push(new Date(day).toISOString().slice(0, 10));
  return result;
}

export function lastCompleteDays(now, count = 28) {
  const midnight = Date.parse(now.toISOString().slice(0, 10));
  return reportDates(new Date(midnight - count * DAY).toISOString().slice(0, 10), new Date(midnight - DAY).toISOString().slice(0, 10));
}

/** A failed read must fail the report, never turn unavailable data into zero clicks. */
export async function readClickDays(store, dates, { maxRecords = 5000, deadline = Date.now() + 22000 } = {}) {
  const result = [];
  let read = 0;
  const checkBudget = () => assertBudget(deadline);
  for (const date of dates) {
    if (!validReportDate(date)) throw new Error("Invalid report date.");
    checkBudget();
    const events = [];
    let excludedTestClicks = 0;
    let invalidRecords = 0;
    for await (const page of pagesWithinBudget(store, { prefix: `${date}/`, paginate: true }, deadline)) {
      checkBudget();
      for (let offset = 0; offset < page.blobs.length; offset += 8) {
        checkBudget();
        const batch = page.blobs.slice(offset, offset + 8);
        read += batch.length;
        if (read > maxRecords) throw new Error("Click report record limit exceeded; previous report retained.");
        await withinBudget(() => Promise.all(batch.map(async ({ key }) => {
          if (!key.startsWith(`${date}/`)) throw new Error("Unexpected record outside requested date.");
          if (KNOWN_TEST_KEYS.has(key)) { excludedTestClicks += 1; return; }
          const raw = await store.get(key, { type: "json" });
          if (raw === null || raw === undefined) throw new Error("Listed click record could not be read; retry report.");
          const event = validateAffiliateEvent(raw);
          if (!event || raw.date !== date) { invalidRecords += 1; return; }
          events.push(event);
        })), deadline);
      }
    }
    result.push({ date, recordedClicks: events.length, excludedTestClicks, invalidRecords, rows: summarizeAffiliateEvents(events) });
  }
  return result;
}

export function combineClickDays(days) {
  const groups = new Map();
  for (const day of days) for (const row of day.rows) {
    const key = JSON.stringify([row.page, row.product, row.campaign, row.placement]);
    const previous = groups.get(key) || { page: row.page, product: row.product, campaign: row.campaign, placement: row.placement, clicks: 0 };
    previous.clicks += row.clicks;
    groups.set(key, previous);
  }
  return [...groups.values()].sort((a, b) => b.clicks - a.clicks || a.page.localeCompare(b.page) || a.placement.localeCompare(b.placement));
}

export async function saveDailyReport(clickStore, reportStore, now = new Date(), { deadline = Date.now() + 25000 } = {}) {
  const dates = lastCompleteDays(now);
  // Reserve four seconds for archives and the final latest pointer.
  const days = await readClickDays(clickStore, dates, { deadline: deadline - 4000 });
  const snapshot = {
    schemaVersion: 1, generatedAt: now.toISOString(), timezone: "UTC",
    from: dates[0], to: dates.at(-1), status: "complete",
    metric: "recorded affiliate click events; not unique visitors, bookings or revenue",
    coverage: "Persistence was verified on 2026-09-10. Earlier days may have incomplete collection. Zero means no valid stored events, not zero visitors.",
    dataSources: { affiliateClicks: "available", searchConsole: "not_collected", viatorBookings: "not_collected", completedCommission: "not_collected" },
    recordedClicks: days.reduce((sum, day) => sum + day.recordedClicks, 0),
    excludedTestClicks: days.reduce((sum, day) => sum + day.excludedTestClicks, 0),
    invalidRecords: days.reduce((sum, day) => sum + day.invalidRecords, 0),
    days, rows: combineClickDays(days),
    last7Days: combineClickDays(days.slice(-7)), previous7Days: combineClickDays(days.slice(-14, -7)),
  };
  // Publish latest only after all archive writes succeed. Retries overwrite deterministic keys.
  await withinBudget(() => Promise.all(days.map(day => reportStore.setJSON(`daily/${day.date}`, { ...day, generatedAt: snapshot.generatedAt, metric: snapshot.metric }))), deadline - 1000);
  await withinBudget(() => reportStore.setJSON("latest", snapshot), deadline);
  return snapshot;
}

export async function removeExpiredReports(store, now = new Date(), { deadline = Date.now() + 25000 } = {}) {
  const cutoff = new Date(now.getTime() - 365 * DAY).toISOString().slice(0, 10);
  for await (const page of pagesWithinBudget(store, { paginate: true }, deadline)) {
    for (const { key } of page.blobs) {
      const date = key.match(/^(?:daily|snapshots)\/(\d{4}-\d{2}-\d{2})$/)?.[1];
      if (date && date < cutoff) await withinBudget(() => store.delete(key), deadline);
    }
  }
}
