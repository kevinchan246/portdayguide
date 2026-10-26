import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as React from "react";
import * as jsx from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { viatorPriceUnitLabel } from "../lib/viator.ts";

const origin = process.env.TEST_BASE_URL || "http://127.0.0.1:4173";

test("scoped cards preserve attributed destinations and distinguish missing, person and group price units", async () => {
  const source = await readFile(new URL("../components/IntentViatorCards.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const product = { productCode: "test", productUrl: "https://www.viator.com/tours/Cozumel/Driver/d632-test?pid=P00311056&campaign=pdg-cozumel-taxi-rates", title: "Driver", duration: "5 hrs", price: 100, currency: "USD", imageUrl: "/test.jpg", imageAlt: "Test", rating: null, reviewCount: 0 };
  const render = (pricingPackageType, portSlug = "cozumel", topic = "taxi-rates") => {
    let state = 0;
    const exports = {};
    const imports = { "react": { ...React, useEffect() {}, useState: () => [state++ === 0 ? { products: [{ ...product, pricingPackageType }] } : false, () => {}] }, "react/jsx-runtime": jsx, "@/lib/viator": { viatorPriceUnitLabel }, "@/lib/roatan-products": {} };
    runInNewContext(compiled, { exports, require: name => { assert.ok(name in imports, name); return imports[name]; } });
    return renderToStaticMarkup(exports.IntentViatorCards({ portSlug, topic, portName: "Test", heading: "Options" }));
  };
  const unknown = render(null);
  assert.match(unknown, /Price unit not supplied/);
  assert.match(unknown, /data-affiliate-placement="cozumel-driver-options"/);
  assert.match(unknown, /pid=P00311056&amp;campaign=pdg-cozumel-taxi-rates/);
  assert.match(unknown, /rel="sponsored nofollow noopener"/);
  assert.doesNotMatch(render("UNIT"), /Price unit not supplied/);
  assert.match(render("UNIT"), /per group/);
  assert.match(render("PER_PERSON"), /per person/);
  assert.match(render(null, "yokohama-tokyo", "tokyo-to-yokohama-cruise-terminal"), /Price unit not supplied/);
  assert.doesNotMatch(render(null, "roatan", "mahogany-bay-vs-coxen-hole"), /Price unit not supplied/);
});

test("decision links resolve to visible sections and preserve the two Yokohama travel directions", async () => {
  const paths = ["/ports/cozumel/taxi-rates", "/ports/yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal", "/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal"];
  const html = await Promise.all(paths.map(async path => {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.ok(text.includes(`href="https://portdayguide.com${path}"`));
    assert.equal((text.match(/<h1\b/g) || []).length, 1);
    return text;
  }));
  for (const anchor of ["cozumel-fare-references", "transport-budget-title", "cozumel-driver-checks"]) {
    assert.ok(html[0].includes(`href="#${anchor}"`));
    assert.ok(html[0].includes(`id="${anchor}"`));
  }
  for (const anchor of ["yokohama-park-food", "yokohama-waterfront"]) {
    assert.ok(html[1].includes(`href="#${anchor}"`));
    assert.ok(html[1].includes(`id="${anchor}"`));
  }
  assert.ok(html[1].includes(`${paths[2]}#tokyo-transfer-checklist`));
  assert.ok(html[2].includes('id="tokyo-transfer-checklist"'));
  assert.match(html[1], /Daikoku requires a vehicle connection/);
  assert.match(html[2], /Already arriving by ship for a shore visit/);
  assert.ok(html[2].includes(`href="${paths[1]}"`));
});
