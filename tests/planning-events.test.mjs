import test from "node:test";
import assert from "node:assert/strict";
import { createMeasurementClient } from "../lib/measurement-client.mjs";
import { planningTools, validatePlanningEvent } from "../lib/planning-events.mjs";
import { createHandler } from "../netlify/functions/affiliate-click.mjs";
import { readClickDays, saveDailyReport } from "../lib/affiliate-reporting.mjs";

const page = "/ports/cozumel/taxi-rates";
const arrival = { type: "page_arrival", page, source: "unspecified" };
const completion = { type: "tool_complete", page, tool: "cozumel-budget", source: "unspecified" };
const click = { type: "click", page, product: "22191P1", campaign: "pdg-cozumel-taxi-rates", placement: "cozumel-driver-options", source: "unspecified" };
const context = { deploy: { context: "production" } };

function browser() {
  const requests = [];
  const state = { location: { hostname: "portdayguide.com", pathname: page, search: "" }, navigator: {}, document: { referrer: "" },
    fetch: async (url, options) => { requests.push({ url, ...options }); }, time: 1000 };
  const send = createMeasurementClient({ ...state, now: () => state.time });
  return { state, requests, send };
}

test("planning events accept only the four pages and their exact tools, discarding all input details", () => {
  const privateData = { ship: "private", itinerary: ["private"], email: "private@example.test", amount: 200, query: "private", referrer: "private", product: "private", id: "private" };
  assert.deepEqual(validatePlanningEvent({ ...arrival, ...privateData }), arrival);
  assert.deepEqual(validatePlanningEvent({ ...completion, ...privateData }), completion);
  for (const [path, tool] of planningTools) {
    assert.ok(validatePlanningEvent({ ...arrival, page: path }));
    if (tool) assert.ok(validatePlanningEvent({ ...completion, page: path, tool }));
  }
  for (const path of ["/", "/share", "/planner?ship=name", `${page}#private`, "/ports/cozumel", page + "/", "https://portdayguide.com/planner"]) {
    assert.equal(validatePlanningEvent({ ...arrival, page: path }), null);
  }
  for (const value of [null, {}, { ...completion, tool: "cruise-planner" }, { ...completion, tool: "" }, { ...arrival, type: "booking" }]) assert.equal(validatePlanningEvent(value), null);
});

test("arrival/completion deduplicate across rerenders, route revisits and source changes without browser storage", () => {
  const { state, requests, send } = browser();
  assert.equal(send(arrival), true);
  assert.equal(send(arrival), false);
  state.location.search = "?utm_source=pinterest&ship=private";
  assert.equal(send(arrival), false);
  assert.equal(send(completion), true);
  assert.equal(send(completion), false);
  state.location.pathname = "/planner";
  assert.equal(send(arrival), true);
  assert.equal(send({ type: "tool_complete", tool: "cruise-planner" }), true);
  state.location.pathname = page;
  assert.equal(send(arrival), false);
  assert.equal(send(completion), false);
  assert.equal(requests.length, 4);
  assert.equal(JSON.parse(requests[1].body).source, "pinterest");
  assert.ok(requests.every(request => !request.body.includes("private") && request.credentials === "omit" && request.referrerPolicy === "origin"));
  // A new document is a new observation, never a unique person/session.
  assert.equal(browser().send(arrival), true);
});

test("DNT, GPC, previews and localhost suppress every event type without blocking later permitted events", () => {
  const { state, requests, send } = browser();
  for (const signal of ["doNotTrack", "globalPrivacyControl"]) {
    state.navigator[signal] = signal === "doNotTrack" ? "1" : true;
    for (const event of [arrival, completion, click]) assert.equal(send(event), false);
    delete state.navigator[signal];
  }
  for (const host of ["localhost", "deploy-preview-44--verdant-souffle-f6e570.netlify.app"]) {
    state.location.hostname = host;
    for (const event of [arrival, completion, click]) assert.equal(send(event), false);
  }
  assert.equal(requests.length, 0);
  state.location.hostname = "portdayguide.com";
  assert.equal(send(arrival), true);
});

test("click suppression remains 750ms and is independent of tool/arrival events", () => {
  const { state, requests, send } = browser();
  assert.equal(send(click), true);
  send(arrival);
  send(completion);
  state.time += 749;
  assert.equal(send(click), false);
  state.time += 1;
  assert.equal(send(click), true);
  assert.equal(requests.filter(request => JSON.parse(request.body).type === "click").length, 2);
});

test("failed tracking never throws or retries; private shared routes send nothing", async () => {
  const { state } = browser();
  let attempts = 0;
  const send = createMeasurementClient({ ...state, fetch: () => { attempts++; return Promise.reject(new Error("offline")); } });
  assert.doesNotThrow(() => send(arrival));
  await Promise.resolve();
  assert.equal(send(arrival), false);
  assert.equal(attempts, 1);
  state.location.pathname = "/share";
  assert.equal(send(completion), false);
  assert.equal(send(click), false);
});

test("the existing production handler stores only validated planning dimensions and preserves guards", async () => {
  const records = new Map();
  const handler = createHandler(() => ({ async setJSON(key, value) { records.set(key, value); } }));
  const request = (event, headers = {}, host = "portdayguide.com") => new Request(`https://${host}/.netlify/functions/affiliate-click`, {
    method: "POST", headers: { origin: "https://portdayguide.com", "content-type": "application/json", ...headers }, body: JSON.stringify(event),
  });
  for (const event of [arrival, completion]) {
    assert.equal((await handler(request({ ...event, ship: "private", amount: 100 }), context)).status, 204);
    assert.equal((await handler(request(event, { dnt: "1" }), context)).status, 204);
    assert.equal((await handler(request(event, { "sec-gpc": "1" }), context)).status, 204);
    assert.equal((await handler(request(event), { deploy: { context: "deploy-preview" } })).status, 204);
    assert.equal((await handler(request(event, { origin: "https://other.test" }), context)).status, 403);
    assert.equal((await handler(request(event, {}, "other.test"), context)).status, 403);
  }
  assert.equal(records.size, 2);
  for (const [key, value] of records) assert.deepEqual(value, { ...(value.type === "page_arrival" ? arrival : completion), date: key.slice(0, 10) });
  assert.equal((await handler(request({ ...completion, tool: "cruise-planner" }), context)).status, 400);
  assert.equal(records.size, 2);
});

test("mixed reports preserve historical click totals and keep planning counts separate", async () => {
  const date = "2026-10-26";
  const records = new Map([click, arrival, completion, completion].map((value, index) => [`${date}/${index}`, { ...value, date }]));
  const store = { async *list({ prefix }) { yield { blobs: [...records.keys()].filter(key => key.startsWith(prefix)).map(key => ({ key })) }; }, async get(key) { return records.get(key); } };
  const [day] = await readClickDays(store, [date]);
  assert.equal(day.recordedClicks, 1);
  assert.equal(day.rows[0].clicks, 1);
  assert.equal(day.planningRows.find(row => row.type === "tool_complete").events, 2); // no invented server-side visitor dedup
  assert.equal(day.invalidRecords, 0);
  const reports = new Map();
  const report = await saveDailyReport(store, { async setJSON(key, value) { reports.set(key, value); } }, new Date("2026-10-27T05:07:00Z"));
  assert.equal(report.schemaVersion, 3);
  assert.equal(report.recordedClicks, 1);
  assert.equal(report.planning.rows.find(row => row.type === "page_arrival").events, 1);
  assert.equal(report.planning.last7Days.length, 2);
  assert.equal(report.planning.previous7Days.length, 0);
  assert.match(report.planning.coverage, /unmeasured/);
  assert.deepEqual(reports.get(`daily/${date}`).planningRows, day.planningRows);
  assert.ok(!JSON.stringify(report).includes('"visitors"'));
});
