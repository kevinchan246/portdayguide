import assert from "node:assert/strict";
import test from "node:test";
import { profilesBySlug } from "../lib/shorepath.ts";
import { osakaActivityMinutes, osakaExcursionTiming, osakaMaximumDurationMinutes, osakaPlanning } from "../lib/osaka-planning.ts";

test("Osaka tour timing stays aligned with the guide's separate transfers and return margin", () => {
  assert.equal(osakaPlanning.transferMinutes, profilesBySlug.osaka.transfer);
  assert.equal(osakaPlanning.shipSideMinutes, profilesBySlug.osaka.buffer);
  assert.equal(osakaActivityMinutes(8), 220);
  assert.equal(osakaActivityMinutes(6), 100);
  assert.equal(osakaExcursionTiming("Osaka Castle", "5 hrs–7 hrs").status, "long-call");
  assert.equal(osakaExcursionTiming("Dotonbori", "3 hrs 40 min").status, "eight-hour-city");
  assert.equal(osakaExcursionTiming("Dotonbori", "3 hrs 41 min").status, "long-call");
  assert.equal(osakaExcursionTiming("Shinsekai", "1 hr 40 min").status, "short-city");
  assert.equal(osakaExcursionTiming("Shinsekai", "1 hr 41 min").status, "eight-hour-city");
});

test("Osaka timing uses the maximum of a bounded range, including mixed units", () => {
  assert.equal(osakaMaximumDurationMinutes("5–7 hours"), 420);
  assert.equal(osakaMaximumDurationMinutes("90 min–2 hrs"), 120);
  assert.equal(osakaMaximumDurationMinutes("1 hr 30 min–4 hrs 30 min"), 270);
  assert.equal(osakaMaximumDurationMinutes("2 to 4 hours"), 240);
  assert.equal(osakaMaximumDurationMinutes("2.5 hrs"), 150);
  assert.equal(osakaExcursionTiming("Osaka Castle", "1 hr–5 hrs").status, "long-call");
});

test("Missing, ambiguous, reversed and unbounded durations never imply a short tour", () => {
  for (const duration of ["", "Duration varies", "2 hours or more", "90", "7 hrs–5 hrs", "0 min", "2 hr plus transfers", "1 day", "2 hrs / 6 hrs"]) {
    assert.equal(osakaMaximumDurationMinutes(duration), null, duration);
    assert.equal(osakaExcursionTiming("Dotonbori", duration).status, "unconfirmed", duration);
  }
});

test("A short Kyoto activity never becomes an Osaka port-day fit", () => {
  for (const duration of ["45 min", "3 hrs", "8 hrs", "Duration varies"]) {
    const assessment = osakaExcursionTiming("Kyoto", duration);
    assert.equal(assessment.status, "separate-city");
    assert.match(assessment.note, /not a verified Osaka-port round trip/);
  }
});
