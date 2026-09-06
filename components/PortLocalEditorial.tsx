import Link from "next/link";
import { PortEditorialPhotos } from "./PortEditorialPhotos";
import { PortTravelerPulse } from "./PortTravelerPulse";
import styles from "./PortLocalEditorial.module.css";
import { DestinationOverview, DestinationTransport, DestinationItineraries, DestinationTips } from "./PortDestinationEditorial";

export function LocalOverview({ slug }: { slug: string }) {
  if (slug === "cozumel" || slug === "juneau") return <DestinationOverview slug={slug} />;
  if (slug === "nassau") return <div className={`overview-copy ${styles.copy}`} data-local-overview="nassau">
    <p className="eyebrow">Choose your direction</p><h2>Nassau cruise port overview: town, beach or boat?</h2>
    <p className="quick-answer"><strong>Quick answer:</strong> Start with downtown Nassau if you want the most flexible independent day. Choose the Queen’s Staircase for history, Junkanoo Beach for a nearby beach outing, or a prebooked boat trip as your main commitment. Keep the final stop close to Prince George Wharf.</p>
    <p>The useful distinction here is how easily you can change your mind. A downtown walk lets you shorten the route when the heat builds. A beach visit needs a return plan before you settle in. A boat outing has an operator’s departure and return schedule, so it belongs at the centre of the day.</p>
    <div className={styles.scroll} role="region" aria-label="Nassau route comparison" tabIndex={0}><table><caption>Which Nassau outing fits your group?</caption><thead><tr><th scope="col">Priority</th><th scope="col">Start with</th><th scope="col">Trade-off</th></tr></thead><tbody>
      <tr><th scope="row">History and flexibility</th><td>Queen’s Staircase and downtown</td><td>Steps, uneven surfaces and heat matter more than map distance.</td></tr>
      <tr><th scope="row">A casual swim</th><td>Junkanoo Beach</td><td>Check conditions, facilities and the return route on arrival.</td></tr>
      <tr><th scope="row">Bahamian food</th><td>Arawak Cay or a downtown tasting</td><td>Allow time to order and eat; keep lunch from becoming a rushed detour.</td></tr>
      <tr><th scope="row">Time on the water</th><td>A confirmed boat excursion</td><td>Check the actual departure marina and total transfer time.</td></tr>
    </tbody></table></div>
    <p>Walking times quoted from the port usually begin near the exit. Your walk from the ship, security procedures and stops for directions come on top. Save the return entrance before leaving; the waterfront is easier to navigate when you know where you need to finish.</p>
  </div>;
  return <div className={`overview-copy ${styles.copy}`} data-local-overview="grand-cayman">
    <p className="eyebrow">Arrival briefing</p><h2>Grand Cayman cruise port overview: plan around the tender</h2>
    <p className="quick-answer"><strong>Quick answer:</strong> Cruise visitors reach George Town by tender boat. Choose a shore plan only after allowing for getting off the ship and returning to the correct tender terminal. Seven Mile Beach is a land-based option; Stingray City adds a separate boat excursion and a less flexible schedule.</p>
    <p>A ship at anchor does not mean you can immediately meet a driver ashore. The queue, boarding and landing are separate parts of the journey. A short crossing quoted by an operator or tourism website does not include all of them. Keep the ship’s instructions available offline.</p>
    <h3>Before joining the queue</h3><ul>
      <li>Confirm the tender process and any ticket or priority arrangements on your ship.</li>
      <li>Write down the last tender time and the time zone used onboard.</li>
      <li>Ask where you will land and where you must return; use a terminal name rather than “the port.”</li>
      <li>Tell an independent operator you are arriving by cruise tender before agreeing to a pickup.</li>
    </ul>
    <p>The return has two distinct stages: get back to the landing area, then board the tender to the ship. If your ship gives an earlier deadline than a suggested itinerary, its deadline governs. For the detailed arrival process, read the <Link href="/ports/grand-cayman/tender-guide">Grand Cayman tender guide</Link>.</p>
    <p className={styles.sources}>Arrival reference: <a href="https://www.visitcaymanislands.com/en-us/planning/travel-by-ship">Cayman Islands Department of Tourism — travel by ship</a>.</p>
  </div>;
}

export function LocalTransport({ slug }: { slug: string }) {
  if (slug === "cozumel" || slug === "juneau") return <DestinationTransport slug={slug} />;
  const nassau = slug === "nassau";
  return <section id="transport" className={`section ${styles.copy}`} data-local-transport={nassau ? "walking-route" : "pickup-questions"}>
    {nassau ? <>
      <h2>On foot through Nassau, with a taxi when it helps</h2>
      <p>Start by checking your group’s walking tolerance. The Queen’s Staircase is a useful history stop, but a route containing stairs is different from a level waterfront stroll. If steps are unsuitable, choose a downtown and waterfront outing with transport arranged for any more distant stops.</p>
      <PortEditorialPhotos slug={slug} photoSlug="nassau-queens-staircase" />
      <ol className={styles.sequence}>
        <li><strong>Leave the port with one inland destination.</strong> For a history outing, make the Queen’s Staircase the main stop. Carry water and allow breaks instead of treating the published walking time as a deadline.</li>
        <li><strong>Return toward downtown for food or an indoor stop.</strong> Pirates of Nassau is an option from the existing port guide; check its current hours and admission before committing. This is a useful place to reassess the weather and everyone’s energy.</li>
        <li><strong>Choose whether the beach still fits.</strong> Junkanoo Beach or Arawak Cay can become the main outing instead of the history loop. Avoid adding both merely because they appear close on a map.</li>
      </ol>
      <p>For a taxi, agree on the destination, total fare, number of passengers and return meeting point. If an excursion includes pickup, use its written location. A marina departure may require another transfer even when the listing describes the activity as being in Nassau.</p>
      <p className={styles.sources}>Landmark reference: <a href="https://nassaucruiseport.com/content/top-attractions/the-queens-staircase/">Nassau Cruise Port — the Queen’s Staircase</a>.</p>
      <h3>Traveler takeaways</h3><p>A short-looking route becomes demanding when it combines hills, steps and midday heat. Spend your available walking energy on the sight you most want to see and keep the way back straightforward.</p>
    </> : <>
      <h2>Four questions before leaving the George Town landing</h2>
      <dl className={styles.decisions}>
        <div><dt>Which beach access point?</dt><dd>Seven Mile Beach is a stretch of coastline, not one taxi destination. Choose a named access point and establish where the driver will meet you again. Ask separately about chairs, shade and facilities.</dd></div>
        <div><dt>Where does the excursion boat depart?</dt><dd>A Stingray City booking can involve a road transfer to a separate boat departure. Check whether that transfer is included, how long the complete outing takes and where it finishes.</dd></div>
        <div><dt>Is lunch a separate journey?</dt><dd>Camana Bay can be a dining or browsing stop, but it is not your tender terminal. Include the onward journey to George Town when deciding whether to add it after the beach.</dd></div>
        <div><dt>What happens if arrival is delayed?</dt><dd>Ask an independent operator about late tenders and a missed port call before paying. Keep its contact details and cancellation terms with the booking confirmation.</dd></div>
      </dl>
      <PortEditorialPhotos slug={slug} photoSlug="camana-bay-waterfront" />
      <p>A taxi offers more control over when you leave a beach stop; a booked excursion gives you a scheduled activity but less control over its ending. A George Town walk has fewer transfers. Select the arrangement that fits the time left after landing, not the duration printed for the ship’s entire call.</p>
      <p>Before entering any vehicle, agree on the currency, the total price for your group, the pickup location and the return arrangement. Keep enough available funds for an alternative ride if the planned pickup fails. Confirm vehicle and boat boarding requirements directly if anyone needs step-free access.</p>
      <h3>Traveler takeaways</h3><p>The beach and a boat excursion are different commitments. A late tender should usually shorten the shore plan, not compress the return margin. If sea conditions change, follow the ship’s updated instructions even when your original booking remains available.</p>
    </>}
    <PortTravelerPulse portSlug={slug} portName={nassau ? "Nassau" : "Grand Cayman"} />
  </section>;
}

export function LocalItineraries({ slug }: { slug: string }) {
  if (slug === "cozumel" || slug === "juneau") return <DestinationItineraries slug={slug} />;
  if (slug === "nassau") return <section id="itineraries" className={`section ${styles.copy}`} data-local-itinerary="nassau-options">
    <h2>A Nassau day you can shorten without losing the main stop</h2>
    <p>Choose the version that fits your interests, then work backward from all-aboard. A six-hour or eight-hour advertised call includes time you may spend getting off and back onto the ship. The examples below describe priorities, not guaranteed attraction or transfer durations.</p>
    <h3>For a shorter call: history and a downtown finish</h3>
    <p>Make the Queen’s Staircase the main sight, with a shaded break and lunch toward downtown. Keep the waterfront browse optional. Once the group has completed the history stop, the day has already delivered its main purpose; an early return does not mean a failed itinerary.</p>
    <h3>For a beach-focused call: choose the beach first</h3>
    <p>Go to your chosen beach with the return plan settled. Leave room to change, eat and arrange transport. If Arawak Cay is the food priority, plan around that stop rather than adding a hurried meal after a long swim. A boat excursion should replace this independent plan rather than sit between its activities.</p>
    <h3>For a longer call: extend one outing</h3>
    <p>Extra time is useful for a slower lunch, an indoor attraction or more time at the main sight. It does not require a trip across the island. Reassess the remaining time before adding a second destination, especially when the group has already walked farther than expected.</p>
    <p><strong>Return planning:</strong> The site’s Nassau baseline is to begin returning at least two hours before all-aboard, with more time for distant pickups or traffic. This is a conservative planning rule, not a published taxi journey time. Your ship’s instructions take priority.</p>
  </section>;
  return <section id="itineraries" className={`section ${styles.copy}`} data-local-itinerary="cayman-countback">
    <h2>Build the Grand Cayman day backward from the last tender</h2>
    <p>The most useful time on this call is the one your ship gives for the last tender. Record it before going ashore. A six-hour or eight-hour port call cannot be treated as the same number of hours at a beach: landing, road travel, the return queue and boarding all use part of it.</p>
    <ol className={styles.sequence}>
      <li><strong>Set the landing-area return target.</strong> Allow a queue and boarding margin before the ship’s last tender. Ask the onboard team what applies to your sailing and mobility needs; do not assume arriving at the waterfront at the deadline is enough.</li>
      <li><strong>Subtract the trip from your final stop.</strong> Confirm the return pickup and route before going to Seven Mile Beach or Camana Bay. The planner’s typical transfer estimate is a starting assumption, not a promise for every beach access point.</li>
      <li><strong>Fit one main activity into the remainder.</strong> A beach visit can usually be shortened more easily than a scheduled boat outing. Book Stingray City only when its complete pickup-to-drop-off window fits after realistic tender arrival.</li>
      <li><strong>Cut the optional stop first.</strong> If getting ashore takes longer, remove lunch away from the return route or the extra shopping stop. Avoid relying on a faster taxi or an empty tender queue to recover lost time.</li>
    </ol>
    <p><strong>Conservative baseline:</strong> This guide’s planning model reserves a 30-minute typical land transfer plus a 120-minute return margin. Actual conditions and an earlier last-tender deadline can require leaving sooner. Never substitute the ship’s departure time for the last tender.</p>
    <p>For the beach route, use the <Link href="/ports/grand-cayman/seven-mile-beach-from-port">Seven Mile Beach from the cruise port guide</Link> to choose a specific destination before arranging transport.</p>
    <PortEditorialPhotos slug={slug} photoSlug="seven-mile-beach-north" />
  </section>;
}

export function LocalTips({ slug }: { slug: string }) {
  if (slug === "cozumel" || slug === "juneau") return <DestinationTips slug={slug} />;
  return <section id="local-tips" className={`section ${styles.copy}`}>
    <h2>{slug === "nassau" ? "Pack for a walk, even if you plan to swim" : "Keep the return details with you ashore"}</h2>
    {slug === "nassau" ? <p>Bring walking shoes for uneven downtown surfaces, water and sun protection. Keep valuables dry if you choose the beach, and save a map of the port entrance offline. Ask about admission and any requested service fee before accepting a tour or service. Check current opening hours before using an indoor stop as your rain plan.</p> : <p>Save the tender-terminal name, ship time, last-tender time and operator contact details on your phone, with a backup accessible if the battery runs out. Check the fare currency before paying. For a water outing, confirm boarding assistance, swimming expectations and conditions with the operator. A beach photograph illustrates the setting; it cannot verify today’s sand access, sea state or facilities.</p>}
  </section>;
}
