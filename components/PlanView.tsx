import type { CruisePlan } from "@/lib/shorepath";
import { ViatorDestinationLink } from "@/components/ViatorDestinationLink";
import { portPath } from "@/lib/seo";

function ShieldIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" className="icon"><path d="M12 3 5.5 5.8v5.4c0 4.3 2.7 7.8 6.5 9.8 3.8-2 6.5-5.5 6.5-9.8V5.8L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>;
}

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export function PlanView({ plan, shared = false }: { plan: CruisePlan; shared?: boolean }) {
  return (
    <div className="cruise-plan">
      <div className="plan-overview">
        <div>
          <p className="card-kicker">{shared ? "SHARED PORTDAYGUIDE PLAN" : "YOUR CRUISE PLAN"}</p>
          <h2>{plan.ship || "Caribbean sailing"}</h2>
          <p>{plan.sailingDate || "Sailing date not set"} · {plan.travelers} traveler{plan.travelers === 1 ? "" : "s"} · {plan.days.length} port{plan.days.length === 1 ? "" : "s"}</p>
        </div>
        <div className="plan-score"><strong>{plan.days.length}</strong><span>return-aware<br />port days</span></div>
      </div>

      <div className="day-list">
        {plan.days.map((day, dayIndex) => (
          <article className="day-card" key={`${day.port}-${dayIndex}`}>
            <div className="day-heading">
              <div><p>PORT {String(dayIndex + 1).padStart(2, "0")} · {day.country}</p><h3>{day.port}</h3><span>{day.date ? `${formatDate(day.date)} · ` : ""}{day.title} · {day.cost}</span></div>
              <div className="return-chip"><ShieldIcon /><span>Back by <b>{day.returnTarget}</b><small>{day.bufferMinutes}-minute margin</small></span></div>
            </div>

            {day.warning && <div className="plan-warning">{day.warning}</div>}
            {day.forecast && <div className="weather-strip"><div><b>{day.forecast.summary}</b><span>{day.forecast.lowC}–{day.forecast.highC}°C · wind up to {day.forecast.windKph} km/h · {day.forecast.precipitationMm} mm precipitation</span></div><p>{day.forecast.planNote}</p><a href="https://api.met.no/" target="_blank" rel="noopener noreferrer">Weather: MET Norway ↗</a></div>}

            <div className="day-body">
              <div className="schedule-column">
                <h4>Timed route</h4>
                <ol className="timeline">{day.stops.map((stop, index) => <li key={`${stop.place}-${index}`}><span className="timeline-dot" /><time>{stop.time}</time><div><strong>{stop.place}</strong><small>{stop.note}</small></div></li>)}</ol>
                <details className="day-notes"><summary>Transport, weather & access notes</summary><div><b>Transport</b><p>{day.transport}</p><b>Weather backup</b><p>{day.backup}</p><b>Access note</b><p>{day.mobilityNote}</p></div></details>
              </div>

              <div className="booking-column">
                <div className="booking-title"><div><p className="card-kicker">BOOKABLE MATCHES</p><h4>Compare live options</h4></div><span>via Viator</span></div>
                <p className="affiliate-notice"><b>Affiliate disclosure:</b> Some booking links may earn PortdayGuide a commission at no extra cost to you. Prices, availability, pickup, duration, cancellation, and ship-return suitability must be verified on Viator.</p>
                {day.date && <p className="viator-date-note"><b>Your port date:</b> {formatDate(day.date)}. Select this date on Viator after opening a tour.</p>}
                <div className="excursion-list">
                  {day.matches.map((match, matchIndex) => (
                    <article className={matchIndex === 0 ? "excursion-card recommended" : "excursion-card"} key={match.title}>
                      <div className="excursion-top"><span>{matchIndex === 0 ? "BEST MATCH" : match.category.toUpperCase()}</span><b>{match.price}</b></div>
                      <h5>{match.title}</h5>
                      <p>{match.description}</p>
                      <div className="excursion-meta"><span>◷ {match.duration}</span><span>◎ {match.bestFor}</span></div>
                    </article>
                  ))}
                </div>
                <ViatorDestinationLink className="planner-viator-cta" portSlug={day.slug} portName={day.port} />
                <a className="guide-link" href={portPath(day.slug)}>Read the complete {day.port} cruise-port guide →</a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
