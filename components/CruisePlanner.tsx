"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { PlanView } from "@/components/PlanView";
import {
  buildCruisePlan, encodePlan, interests, planAsText, portNames, portProfiles, portRegions, portsByRegion, profilesBySlug,
  type CruisePlan, type Interest, type Mobility, type Pace, type PlannerInput, type PortCallInput, type PortName, type WeatherForecast,
} from "@/lib/shorepath";

const defaultCalls: PortCallInput[] = [
  { port: "Cozumel", arrival: "08:00", allAboard: "16:30" },
  { port: "Nassau", arrival: "08:30", allAboard: "16:00" },
  { port: "Costa Maya", arrival: "08:00", allAboard: "17:00" },
];

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon icon-arrow"><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

function minutes(value: string) {
  const [hours, mins] = value.split(":").map(Number);
  return hours * 60 + mins;
}

export function CruisePlanner() {
  const [ship, setShip] = useState("");
  const [sailingDate, setSailingDate] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [party, setParty] = useState("Family with kids");
  const [pace, setPace] = useState<Pace>("Balanced");
  const [interest, setInterest] = useState<Interest>("Beach + water");
  const [mobility, setMobility] = useState<Mobility>("Standard walking");
  const [budget, setBudget] = useState("$$");
  const [calls, setCalls] = useState<PortCallInput[]>(defaultCalls);
  const [plan, setPlan] = useState<CruisePlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<CruisePlan[]>([]);
  const [status, setStatus] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try { setSavedTrips(JSON.parse(window.localStorage.getItem("portdayguide.trips") || window.localStorage.getItem("shorepath.trips") || "[]") as CruisePlan[]); }
      catch { setSavedTrips([]); }
      const requestedSlug = new URLSearchParams(window.location.search).get("port") || "";
      const requestedPort = profilesBySlug[requestedSlug];
      if (requestedPort) {
        setCalls([{ port: requestedPort.name, arrival: "08:00", allAboard: "16:30" }]);
        setStatus(`${requestedPort.name} added from the guide. Enter your ship times to test the route.`);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const usedPorts = useMemo(() => new Set(calls.map((call) => call.port)), [calls]);
  const updateCall = (index: number, patch: Partial<PortCallInput>) => { setCalls((current) => current.map((call, callIndex) => callIndex === index ? { ...call, ...patch } : call)); setFormError(""); };
  const addPort = () => { const next = portNames.find((name) => !usedPorts.has(name)); if (next) setCalls((current) => [...current, { port: next, arrival: "08:00", allAboard: "16:30" }]); };
  const plannerInput = (): PlannerInput => ({ ship, sailingDate, travelers, party, pace, interest, mobility, budget, weather: "Typical / dry", calls });

  const generatePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const invalidCall = calls.find((call) => {
      const profile = portProfiles[call.port];
      const minimumWindow = Math.max(120, profile.buffer + profile.transfer) + profile.transfer + 90;
      return minutes(call.allAboard) - minutes(call.arrival) < minimumWindow;
    });
    if (invalidCall) {
      const profile = portProfiles[invalidCall.port];
      const minimumWindow = Math.max(120, profile.buffer + profile.transfer) + profile.transfer + 90;
      setFormError(`${invalidCall.port}: allow at least ${Math.ceil(minimumWindow / 30) / 2} hours between arrival and all-aboard.`);
      return;
    }
    if (!calls.length) { setFormError("Add at least one port call."); return; }
    setFormError("");
    const basePlan = buildCruisePlan(plannerInput());
    setStatus(basePlan.days.some((day) => day.date) ? "Checking near-term weather…" : "");
    setPlan(basePlan);
    window.requestAnimationFrame(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    const forecasts = await Promise.all(basePlan.days.map(async (day) => {
      if (!day.date) return null;
      try {
        const response = await fetch(`/api/weather?port=${encodeURIComponent(day.slug)}&date=${encodeURIComponent(day.date)}`);
        const data = await response.json() as { available?: boolean; forecast?: WeatherForecast };
        return data.available && data.forecast ? data.forecast : null;
      } catch { return null; }
    }));
    const forecastCount = forecasts.filter(Boolean).length;
    if (forecastCount) {
      setPlan({ ...basePlan, days: basePlan.days.map((day, index) => forecasts[index] ? { ...day, forecast: forecasts[index] || undefined } : day) });
      setStatus(`Live weather added to ${forecastCount} port day${forecastCount === 1 ? "" : "s"}.`);
    } else if (basePlan.days.some((day) => day.date)) setStatus("Dates saved. Live weather appears when a port day is within nine days.");
  };

  const persistTrips = (trips: CruisePlan[]) => { setSavedTrips(trips); window.localStorage.setItem("portdayguide.trips", JSON.stringify(trips)); };
  const savePlan = () => { if (!plan) return; persistTrips([plan, ...savedTrips.filter((saved) => saved.id !== plan.id)].slice(0, 5)); setStatus("Saved on this device."); };
  const loadPlan = (saved: CruisePlan) => {
    setPlan(saved); setShip(saved.ship); setSailingDate(saved.sailingDate); setTravelers(saved.travelers); setParty(saved.party); setPace(saved.pace); setInterest(saved.interest); setMobility(saved.mobility); setBudget(saved.budget);
    setCalls(saved.days.map((day) => ({ port: day.port, date: day.date || "", arrival: day.arrival, allAboard: day.allAboard })));
    setStatus("Saved cruise loaded."); window.requestAnimationFrame(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }));
  };
  const copyText = async () => { if (!plan) return; try { await navigator.clipboard.writeText(planAsText(plan)); setStatus("Complete plan copied."); } catch { setStatus("Copy was blocked. Use Print / PDF instead."); } };
  const copyShareLink = async () => { if (!plan) return; try { await navigator.clipboard.writeText(`${window.location.origin}/share?trip=${encodePlan(plan)}`); setStatus("Share link copied."); } catch { setStatus("Could not create the share link. Copy the plan instead."); } };

  return <>
    <section className="planner-section" id="planner-form">
      <form className="cruise-builder" onSubmit={generatePlan}>
        <div className="builder-column trip-fields">
          <div className="builder-title"><span>01</span><div><p>TRAVELERS</p><h2>Who is going?</h2></div></div>
          <div className="field-row"><label><span className="field-label">Ship name <small>(optional)</small></span><input value={ship} onChange={(event) => setShip(event.target.value)} placeholder="e.g. Icon of the Seas" /></label><label><span className="field-label">Travelers</span><input type="number" min="1" max="20" value={travelers} onChange={(event) => setTravelers(Math.max(1, Number(event.target.value)))} /></label></div>
          <div className="field-row"><label>Travel party<select value={party} onChange={(event) => setParty(event.target.value)}><option>Family with kids</option><option>Couple</option><option>Multigenerational group</option><option>Friends</option><option>Solo traveler</option></select></label><label>Pace<select value={pace} onChange={(event) => setPace(event.target.value as Pace)}><option>Relaxed</option><option>Balanced</option><option>Active</option></select></label></div>
          <label>Main interest<select value={interest} onChange={(event) => setInterest(event.target.value as Interest)}>{interests.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Walking & mobility<select value={mobility} onChange={(event) => setMobility(event.target.value as Mobility)}><option>Standard walking</option><option>Limited walking</option><option>Wheelchair / step-free preferred</option></select></label>
          <label>Budget per person<select value={budget} onChange={(event) => setBudget(event.target.value)}><option value="$">$ · value-first</option><option value="$$">$$ · flexible</option><option value="$$$">$$$ · premium</option></select></label>
        </div>
        <div className="builder-column port-fields">
          <div className="builder-title"><span>02</span><div><p>PORTS & DATES</p><h2>When are you ashore?</h2></div></div>
          <p className="builder-help">Use the ship’s local arrival and all-aboard times.</p>
          <div className="port-call-list">{calls.map((call, index) => <div className="port-call-row" key={`${call.port}-${index}`}>
            <b>{String(index + 1).padStart(2, "0")}</b>
            <label>Port<select value={call.port} onChange={(event) => updateCall(index, { port: event.target.value as PortName })}>{portRegions.map((region) => <optgroup label={region} key={region}>{portsByRegion[region].map((name) => <option key={name} disabled={name !== call.port && usedPorts.has(name)}>{name}</option>)}</optgroup>)}</select><small>{portProfiles[call.port].pier}</small></label>
            <label>Port date<input type="date" value={call.date || ""} onChange={(event) => updateCall(index, { date: event.target.value })} /><small>Enables live weather</small></label>
            <label>Arrival<input type="time" required value={call.arrival} onChange={(event) => updateCall(index, { arrival: event.target.value })} /></label>
            <label>All-aboard<input type="time" required value={call.allAboard} onChange={(event) => updateCall(index, { allAboard: event.target.value })} /></label>
            {calls.length > 1 && <button type="button" aria-label={`Remove ${call.port}`} onClick={() => setCalls((current) => current.filter((_, callIndex) => callIndex !== index))}>×</button>}
          </div>)}</div>
          {calls.length < portNames.length && <button className="add-port" type="button" onClick={addPort}>+ Add another supported port</button>}
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <div className="builder-submit"><button className="primary-button" type="submit">Build my cruise plan <ArrowIcon /></button></div>
        </div>
      </form>
    </section>

    {plan && <section className="results-section" id="results"><div className="results-toolbar"><div><p className="eyebrow"><span /> Complete sailing plan</p><h2>Ready to take ashore.</h2></div><div className="toolbar-actions"><button type="button" onClick={savePlan}>Save</button><button type="button" onClick={copyShareLink}>Share link</button><button type="button" onClick={copyText}>Copy plan</button><button type="button" onClick={() => window.print()}>Print / PDF</button></div></div>{status && <p className="action-status" role="status">{status}</p>}<PlanView plan={plan} /></section>}

    {savedTrips.length > 0 && <section className="section saved-section"><div className="section-heading compact"><p className="eyebrow"><span /> Saved on this device</p><h2>Recent plans.</h2></div><div className="saved-grid">{savedTrips.map((saved) => <article key={saved.id}><div><span>{saved.sailingDate || "Date not set"}</span><h3>{saved.ship || "Cruise plan"}</h3><p>{saved.days.map((day) => day.port).join(" · ")}</p></div><div><button type="button" onClick={() => loadPlan(saved)}>Open</button><button type="button" onClick={() => persistTrips(savedTrips.filter((trip) => trip.id !== saved.id))}>Delete</button></div></article>)}</div></section>}
  </>;
}
