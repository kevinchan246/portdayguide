"use client";

import { useState } from "react";
import { compareTransportQuotes, type TransportQuote } from "@/lib/cozumel-transport";
import styles from "./CozumelTaxiArticle.module.css";

export function CozumelTransportBudget() {
  const [quote, setQuote] = useState<TransportQuote>({ passengers: "4", outward: "", back: "", taxiExtras: "0", driver: "", driverExtras: "0" });
  const [currency, setCurrency] = useState("USD");
  const result = compareTransportQuotes(quote);
  const format = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  const field = (key: keyof TransportQuote, label: string) => <label>{label}<input type="number" inputMode="decimal" min="0" max="100000" step="0.01" value={quote[key]} onChange={event => setQuote({ ...quote, [key]: event.target.value })} /></label>;
  return <section className={styles.budget} aria-labelledby="transport-budget-title">
    <h2 id="transport-budget-title">Compare the whole-party cost</h2>
    <p>Enter quotes you have checked. Use the same currency for every amount and include every vehicle your party needs. Extras mean admissions, waiting charges or other costs missing from each quote.</p>
    <div className={styles.controls}>
      <label>People in your party<input type="number" inputMode="numeric" min="1" max="30" step="1" value={quote.passengers} onChange={event => setQuote({ ...quote, passengers: event.target.value })} /></label>
      <label>Currency of all quotes<select value={currency} onChange={event => { setCurrency(event.target.value); setQuote({ ...quote, outward: "", back: "", taxiExtras: "0", driver: "", driverExtras: "0" }); }}><option value="USD">USD — US dollars</option><option value="MXN">MXN — Mexican pesos</option></select></label>
    </div>
    <div className={styles.columns}>
      <fieldset><legend>Separate taxis</legend>{field("outward", "Outward fare — whole party")}{field("back", "Return fare — whole party")}{field("taxiExtras", "Extras — whole party")}</fieldset>
      <fieldset><legend>Private driver or package</legend>{field("driver", "Confirmed quote — whole party")}{field("driverExtras", "Extras not included — whole party")}<p>Use a quote for the same people, route and duration. A Viator “from” price may not be your group total.</p></fieldset>
    </div>
    <div className={styles.result} aria-live="polite" aria-atomic="true">
      {!result ? <p>Enter a whole number of 1–30 people.</p> : <>
        <p><strong>Taxis:</strong> {result.taxiTotal === null ? "Enter both fares and extras." : `${format(result.taxiTotal)} total · ${format(result.taxiTotal / result.people)} per traveler`}</p>
        <p><strong>Driver/package:</strong> {result.driverTotal === null ? "Enter a confirmed quote and extras." : `${format(result.driverTotal)} total · ${format(result.driverTotal / result.people)} per traveler`}</p>
        {result.difference !== null && <p>{result.difference === 0 ? "The entered totals are equal." : `The driver/package is ${format(Math.abs(result.difference))} ${result.difference > 0 ? "more" : "less"} for the whole party.`} Compare pickup, included time and return arrangements before deciding.</p>}
      </>}
    </div>
    <small>This compares your inputs; it does not fetch current taxi fares or convert currencies. Changing the currency clears the amounts. Amounts must be non-negative, with at most two decimal places. Nothing entered here is saved.</small>
  </section>;
}
