import Link from "next/link";
import { PortEditorialPhotos } from "./PortEditorialPhotos";
import { PortTravelerPulse } from "./PortTravelerPulse";
import styles from "./PortLocalEditorial.module.css";

type Destination = { slug: "cozumel" | "juneau" };

export function DestinationOverview({ slug }: Destination) {
  return <div className={`overview-copy ${styles.copy}`} data-destination-overview={slug}>
    {slug === "cozumel" ? <>
      <h2>Cozumel cruise port overview: let the pier choose the route</h2>
      <p className="quick-answer"><strong>Quick answer:</strong> Confirm Punta Langosta, International Pier or Puerta Maya first. Downtown San Miguel is the simplest walking option from Punta Langosta; southern terminals need their own taxi or excursion pickup plan. Choose one activity area before adding lunch or shopping.</p>
      <p>Cozumel is an island with several distinct cruise arrivals, not one interchangeable port gate. A tour that starts in downtown San Miguel may be convenient for one ship and require a separate transfer for another. Save the exact terminal name alongside your booking, then check whether the meeting point is inside the terminal, outside its exit or at a different marina.</p>
      <p>The route decision comes before the attraction ranking. Chankanaab is a park-based outing, San Gervasio is a heritage visit, and Punta Sur adds a different travel commitment. Combining all three spends a large share of a short call in transit. Pick the experience you would regret missing and make everything else optional.</p>
      <p>Keep mainland travel separate from an ordinary island itinerary. A ferry connection adds another timetable and return dependency. A mainland excursion needs its own complete ship-to-ship plan; it should not be treated as a quick addition after an island beach visit.</p>
    </> : <>
      <h2>Juneau cruise port overview: glacier, whales or a flexible town day?</h2>
      <p className="quick-answer"><strong>Quick answer:</strong> Choose Mendenhall Glacier for a land-based landscape visit or whale watching for a scheduled boat experience. Combine them only when the complete pickup-to-return window fits your call. Keep downtown Juneau as a separate, flexible option if arrival or conditions change.</p>
      <p>Start with what you actually want to experience. Seeing Mendenhall from the visitor area is not the same product as landing on ice by helicopter. A whale-watching listing may include road transfers as well as time aboard the boat. Two listings with similar titles can leave very different amounts of time for walking, photography and lunch.</p>
      <h3>Three booking checks before comparing prices</h3>
      <ul><li>Which cruise dock or meeting point does the pickup serve?</li><li>Does the advertised duration include every road transfer and the return to your ship area?</li><li>What happens if the ship arrives late or the operator cancels for conditions?</li></ul>
      <p>Do not buy a second fixed-time activity until the first operator’s return arrangements are clear. A combination trip can simplify coordination, but it is still a scheduled commitment rather than extra free time. Ask how long you actually get at the glacier and whether admission or other required charges are included.</p>
    </>}
  </div>;
}

export function DestinationTransport({ slug }: Destination) {
  return <section id="transport" className={`section ${styles.copy}`} data-local-transport={slug === "cozumel" ? "pier-to-area" : "glacier-transfer"}>
    {slug === "cozumel" ? <>
      <h2>How to get around Cozumel cruise port: match the ride to the area</h2>
      <h3>Downtown: walking is a terminal-specific choice</h3>
      <p>From Punta Langosta, a San Miguel outing can centre on browsing, a meal and a waterfront walk. From International Pier or Puerta Maya, establish the ride into town and the trip back before setting out. A downtown map pin is not a substitute for your ship’s terminal entrance.</p>
      <h3>Park or beach: settle the return before the swim</h3>
      <p>For Chankanaab or a beach club, confirm the total taxi fare, currency, passenger count and whether the quoted amount includes a return. Photograph a posted fare board where available. Agree on a named pickup point rather than relying on finding the same driver later.</p>
      <PortEditorialPhotos slug={slug} photoSlug="chankanaab-park" />
      <h3>Heritage or a longer circuit: price the whole route</h3>
      <p>For San Gervasio or a Punta Sur outing, ask whether waiting time, additional stops and admission are included. A single transfer and a vehicle retained for several hours are different purchases. A booked shore excursion may simplify the route, but verify its actual terminal meeting point and cancellation terms.</p>
      <p>Use the <Link href="/ports/cozumel/taxi-rates">Cozumel taxi guide</Link> for the questions to ask at the fare board. Puerta Maya also publishes <a href="https://www.puertamayaport.com/">official port information</a>; your cruise documents remain the source for your assigned berth.</p>
      <h3>Traveler takeaways</h3><p>Keep your return on the same terminal plan you used outbound. Nearby southern piers are not interchangeable pickup locations. If anyone needs step-free access, confirm the vehicle, attraction paths and boarding arrangements before payment, rather than assuming a short transfer is an accessible one.</p>
    </> : <>
      <h2>Getting to Mendenhall is a transport decision, not just an admission ticket</h2>
      <p>Separate three items when budgeting: transport to the visitor area, any applicable admission, and activities beyond ordinary sightseeing. A ticket for one does not automatically cover the others. Ask the provider exactly what is included and where its return service collects passengers.</p>
      <p><strong>Public bus is not a glacier shuttle.</strong> Capital Transit says its closest stop is 1.5 miles from the visitor center. Its downtown journey can take up to 1.5 hours each way including the walk; reaching the downtown bus from your own berth may add time. Check the <a href="https://juneaucapitaltransit.org/how-to-ride-to-the-mendenhall-glacier-visitor-center-with-capital-transit/">official glacier transit directions</a> before choosing it for a short call.</p>
      <PortEditorialPhotos slug={slug} photoSlug="mendenhall-glacier" />
      <p>A private shuttle, taxi or booked tour has a different return arrangement. For a shuttle, confirm the return departure; for a taxi, arrange the collection rather than assuming one will be waiting. For whale watching, check the boat departure location and whether road transfers are included in the booking.</p>
      <p>Check current access and visitor information with the <a href="https://www.fs.usda.gov/r10/tongass/offices/mendenhall-glacier-visitor-center">Forest Service</a>. The glacier photo here is historical: it illustrates the setting, not the present ice position or a guarantee that a particular trail is open.</p>
      <h3>Traveler takeaways</h3><p>Spend the transport budget where it buys a clearer return plan. A cheaper outbound journey is not necessarily the best shore-day choice if it leaves a long walk or an uncertain ride back. Confirm walking surfaces, boat boarding and assistance requirements directly for your group.</p>
    </>}
    <PortTravelerPulse portSlug={slug} portName={slug === "cozumel" ? "Cozumel" : "Juneau"} />
  </section>;
}

export function DestinationItineraries({ slug }: Destination) {
  return <section id="itineraries" className={`section ${styles.copy}`} data-destination-plan={slug === "cozumel" ? "area-routes" : "weather-branches"}>
    {slug === "cozumel" ? <>
      <h2>Choose an island route, not a four-attraction checklist</h2>
      <h3>Town route: San Miguel with an unhurried finish</h3>
      <p>Keep the main outing downtown, with lunch and shopping as flexible stops. This is particularly straightforward from Punta Langosta. If your ship uses a southern terminal, the ride back remains part of the itinerary even when the day feels like a walking tour. Finish browsing before the transport margin begins.</p>
      <h3>Water route: one park or beach, then back</h3>
      <p>Use Chankanaab or your chosen beach venue as the main commitment. Check the package before buying: equipment, food and particular activities may be separate. Leave time to change, collect belongings and reach the pickup point. Do not use the return allowance for one last swim.</p>
      <h3>Heritage route: San Gervasio without the island sweep</h3>
      <p>Make the ruins the reason for the outing and arrange the ride around that visit. Bring water and choose footwear for outdoor paths. An extended island circuit is a separate decision, not an automatic upgrade; add stops only when their driving and visiting time fit comfortably.</p>
      <PortEditorialPhotos slug={slug} photoSlug="san-gervasio-casa-grande" />
      <p><strong>Return transfer:</strong> Begin returning at least two hours before official all-aboard, earlier for distant stops, traffic or additional assistance. The guide’s typical 25-minute transfer is a planning estimate, not a journey time for every attraction. Follow the ship’s deadline and time zone.</p>
    </> : <>
      <h2>A Juneau plan that can change with the conditions</h2>
      <dl className={styles.decisions}>
        <div><dt>If the glacier is your priority</dt><dd>Reserve a workable round trip first, then choose walks that fit the time at the visitor area. Check access notices before leaving. Keep lunch downtown optional rather than booking it immediately after a tight shuttle return.</dd></div>
        <div><dt>If whales are your priority</dt><dd>Build the day around the operator’s full pickup-to-drop-off schedule. Ask about vessel facilities, boarding and cancellation terms. Wildlife is not a timetable: do not promise your group a particular sighting or behaviour.</dd></div>
        <div><dt>If you want both</dt><dd>Compare a coordinated combination outing with two separate bookings. Check actual glacier visiting time and the final drop-off. A longer port call helps, but does not remove the need to verify every connection.</dd></div>
        <div><dt>If the outing is cancelled or arrival is late</dt><dd>Recheck the time left before replacing it. Choose a downtown meal, browsing or a short walk with a known route to your berth. Do not assume a cancelled flight means boats or other activities are also cancelled; ask each operator.</dd></div>
      </dl>
      <PortEditorialPhotos slug={slug} photoSlug="downtown-juneau-docks" />
      <p>For a tram outing, check current operations and visibility before deciding whether the view is worth the time. A waterfront finish can be easier to shorten, but identify your actual dock: returning to downtown is not always the end of the journey to the ship.</p>
      <p><strong>Return rule:</strong> Allow at least two hours before all-aboard to begin the return journey, with more time where the route, transport or ship’s instructions require it. Count from the operator’s complete return time, not the end of the boat activity alone. Weather forecasts cannot guarantee a sailing or flight will operate.</p>
    </>}
  </section>;
}

export function DestinationTips({ slug }: Destination) {
  return <section id="local-tips" className={`section ${styles.copy}`}>
    <h2>{slug === "cozumel" ? "Cozumel cruise port tips before you go" : "Juneau: carry a weather-ready day bag"}</h2>
    {slug === "cozumel" ? <p>Save the terminal name, return entrance, tickets and pickup instructions offline. Confirm the fare currency before paying; when using a card or bank ATM, understand the conversion offered before accepting it. Pack sun protection, water and dry storage for a beach outing. Check current admission and opening hours rather than treating old photographs or reviews as a current price list.</p> : <p>Bring a waterproof outer layer, warm layers and footwear suitable for wet paths. Keep the operator’s contact, pickup details and ship time accessible without mobile service. Check boat facilities and boarding assistance before booking. For a downtown backup, verify opening hours on the day; do not rely on an indoor attraction being open simply because ships are in port.</p>}
  </section>;
}
