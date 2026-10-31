import { normalizeAffiliateSource, validateAffiliateEvent } from "./affiliate-events.mjs";

// Deliberately bounded to this pilot. No /share, free-text dimensions or form inputs.
export const planningTools = new Map([
  ["/ports/cozumel/taxi-rates", "cozumel-budget"],
  ["/ports/yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal", null],
  ["/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal", "tokyo-checklist"],
  ["/planner", "cruise-planner"],
]);

export function validatePlanningEvent(value) {
  if (!value || typeof value !== "object" || !planningTools.has(value.page)) return null;
  const base = { type: value.type, page: value.page, source: normalizeAffiliateSource(value.source) };
  if (value.type === "page_arrival") return base;
  if (value.type === "tool_complete" && value.tool && planningTools.get(value.page) === value.tool) return { ...base, tool: value.tool };
  return null;
}

export function validateMeasurementEvent(value) {
  return validateAffiliateEvent(value) || validatePlanningEvent(value);
}

export function summarizePlanningEvents(events) {
  const groups = new Map();
  for (const raw of events) {
    const event = validatePlanningEvent(raw);
    if (!event) continue;
    const key = JSON.stringify([event.type, event.page, event.tool || "", event.source]);
    const row = groups.get(key) || { ...event, events: 0 };
    row.events += 1;
    groups.set(key, row);
  }
  return [...groups.values()];
}

export function combinePlanningDays(days) {
  const groups = new Map();
  for (const day of days) for (const row of day.planningRows || []) {
    const event = validatePlanningEvent(row);
    if (!event || !Number.isSafeInteger(row.events) || row.events < 0) continue;
    const key = JSON.stringify([event.type, event.page, event.tool || "", event.source]);
    const previous = groups.get(key) || { ...event, events: 0 };
    previous.events += row.events;
    groups.set(key, previous);
  }
  return [...groups.values()];
}
