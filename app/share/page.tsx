"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlanView } from "@/components/PlanView";
import { buildCruisePlan, decodePlan, planAsText, type CruisePlan } from "@/lib/shorepath";

export default function SharedPlanPage() {
  const [plan, setPlan] = useState<CruisePlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const encoded = new URLSearchParams(window.location.search).get("trip");
      const input = encoded ? decodePlan(encoded) : null;
      setPlan(input ? buildCruisePlan(input) : null);
      setLoading(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const copyPlan = async () => {
    if (!plan) return;
    try { await navigator.clipboard.writeText(planAsText(plan)); setStatus("Plan copied."); }
    catch { setStatus("Copy was blocked. Use Print / PDF instead."); }
  };

  return <main className="share-page">
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><Link href="/planner">Build my own cruise</Link></header>
    {loading ? <div className="share-state"><span>⌁</span><h1>Opening the shared PortdayGuide plan…</h1></div> : plan ? <>
      <section className="share-intro"><p className="eyebrow"><span /> Shared cruise plan</p><h1>A shore plan built around the ship’s clock.</h1><p>Review every official port time and booking detail before using this plan.</p><div><button type="button" onClick={copyPlan}>Copy plan</button><button type="button" onClick={() => window.print()}>Print / PDF</button><Link href="/planner">Customize this cruise</Link></div>{status && <small role="status">{status}</small>}</section>
      <section className="shared-plan-wrap"><PlanView plan={plan} shared /></section>
    </> : <div className="share-state"><span>!</span><h1>This shared plan could not be opened.</h1><p>The link may be incomplete. Ask the sender for a new link or build a fresh plan.</p><Link className="primary-button" href="/planner">Build a port-day plan</Link></div>}
    <section className="share-guidance" aria-labelledby="share-guidance-title"><p className="eyebrow"><span /> Before using this itinerary</p><h2 id="share-guidance-title">Treat the shared plan as a starting structure.</h2><p>A shared PortdayGuide link reconstructs the preferences entered by its creator. It does not connect to a cruise-line reservation, confirm a berth, hold a tour, or update the ship’s official schedule. Compare every port, arrival, and all-aboard time with the current cruise documents before using the plan.</p><div><article><h3>Verify the first mile</h3><p>Confirm whether the ship docks or tenders, the exact terminal name, and where public transport or a booked operator actually meets passengers. A destination label can cover several terminals with different exit routes.</p></article><article><h3>Recheck the complete return</h3><p>The visible transfer is a planning assumption, not live traffic. Include pickup or station waiting, the ride back, port security, the pier or tender, and a ship-side margin. Leave earlier when weather, mobility, or unfamiliar transport adds uncertainty.</p></article><article><h3>Open every booking</h3><p>Prices, pricing units, availability, duration, accessibility, cancellation terms, and meeting points can change. The current booking page and operator confirmation control. Keep those details and an emergency contact available offline.</p></article></div><p>Do not place passport numbers, payment details, medical records, or booking confirmations in a plan. Anyone with the complete shared link may be able to view the itinerary values it contains. If the link is incomplete or the plan no longer matches the sailing, return to the planner and create a fresh version.</p><Link href="/planner">Build or update a cruise plan →</Link></section>
  </main>;
}
