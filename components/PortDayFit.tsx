import type { PortIntentGuide } from "@/lib/port-intent-guides";

export function PortDayFit({ fit }: { fit: PortIntentGuide["fit"] }) {
  const items = [
    ["Best for", fit.bestFor],
    ["Time needed", fit.minimumWindow],
    ["DIY difficulty", fit.diyLevel],
    ["Mobility", fit.mobility],
    ["Weather sensitivity", fit.weather],
    ["Biggest risk", fit.mainRisk],
  ];
  return <aside className="port-day-fit" aria-labelledby="port-day-fit-title">
    <div><span>Port Day Fit</span><h2 id="port-day-fit-title">Does this plan fit your call?</h2><p>A decision snapshot before you spend time or money on the route.</p></div>
    <dl>{items.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
  </aside>;
}
