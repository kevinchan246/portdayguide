import Link from "next/link";
import type { PortIntentGuide } from "@/lib/port-intent-guides";
import { CozumelTransportBudget } from "./CozumelTransportBudget";
import { IntentViatorCards } from "./IntentViatorCards";
import styles from "./CozumelTaxiArticle.module.css";
import jumpStyles from "./IntentBookingLinks.module.css";

function Copy({ section }: { section: PortIntentGuide["sections"][number] }) {
  return <section className="intent-copy-section"><h2>{section.heading}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}{section.bullets && <ul>{section.bullets.map(text => <li key={text}>{text}</li>)}</ul>}</section>;
}

export function CozumelTaxiArticle({ guide }: { guide: PortIntentGuide }) {
  return <div className={styles.article} data-taxi-article="whole-party-quote">
    <Copy section={guide.sections[0]} />
    <section className="intent-copy-section">
      <h2>Read the fare against your actual pier</h2>
      <p>Punta Langosta, International Pier and Puerta Maya are different starting points. The <Link href="/ports/cozumel/which-cruise-terminal">terminal comparison</Link> helps identify yours. At the stand, name the destination and number of travelers, then ask for the total for everyone and every vehicle required.</p>
      <p>Puerta Maya&apos;s <a href="https://www.puertamayaport.com/taxi-and-rental-car-information/" target="_blank" rel="noopener noreferrer">official taxi information</a> provides a taxi contact, but no fare table. The reference below comes from EverythingCozumel; its page shows a May 2025 update. We have not verified these amounts against a September 2026 terminal fare board.</p>
      {guide.comparison && <div className={styles.table}><table><caption>Published reference: one way from International Pier or Puerta Maya, up to four passengers, USD. Confirm the current board.</caption><thead><tr>{guide.comparison.columns.map(text => <th scope="col" key={text}>{text}</th>)}</tr></thead><tbody>{guide.comparison.rows.map(row => <tr key={row[0]}>{row.map((text, index) => index === 0 ? <th scope="row" key={text}>{text}</th> : <td key={text}>{text}</td>)}</tr>)}</tbody></table></div>}
      <p>Do not apply that four-person reference to a party of five, assume a van has the same fare, or automatically double the outward price. Ask for the return quote separately. A beach admission or resort day pass is a separate purchase unless expressly included.</p>
    </section>
    <section className="intent-copy-section">
      <h2>Which arrangement fits the day you actually want?</h2>
      <div className={styles.choices}>
        <div><h3>One destination: arrange two taxi rides</h3><p>A point-to-point taxi can fit a beach club or downtown visit when you know how to get the return ride. Confirm pickup availability with the venue before spending the afternoon there; the outward fare does not reserve a vehicle for later.</p></div>
        <div><h3>Several stops: compare reserved driver time</h3><p>A private driver quote buys a different arrangement: a vehicle and a block of time. Confirm who drives, how many hours are included, which stops are realistic, and the price of waiting or extra time. A guide, attraction tickets and lunch are separate details to check.</p></div>
        <div><h3>One organized activity: check its transfer first</h3><p>Before adding a taxi budget, check whether the activity already includes transport, exactly where it meets, and where it returns you. An included transfer may follow a fixed timetable; leaving early or staying late may require your own taxi.</p></div>
      </div>
    </section>
    <CozumelTransportBudget />
    <section className="intent-copy-section">
      <h2 id="cozumel-driver-checks" tabIndex={-1} className={jumpStyles.target}>Compare the quote with the booking confirmation</h2>
      <p>For example, <a href="https://cozumelcruiseexcursions.com/cozumel/cozumel-private-island-tours/" target="_blank" rel="noopener noreferrer">Cozumel Cruise Excursions&apos; private island tour</a> separates passenger bands and reserved hours, and lists an air-conditioned van and driver/guide while excluding admissions, food and drinks. That seller&apos;s inclusions do not automatically apply to the Viator products below.</p>
      <ul><li><strong>Group and unit:</strong> a total for your complete party, with the vehicle count and any child or accessibility arrangements confirmed.</li><li><strong>Time and route:</strong> pickup time, included hours, chosen stops and any overtime charges.</li><li><strong>Meeting and return:</strong> the named pier, exact meeting landmark, walking distance and agreed return location and time.</li><li><strong>Extra costs:</strong> admissions, beach facilities, equipment, food and any charges not already in the quote.</li></ul>
      <p>“Private” alone does not mean a chauffeur is included. A Jeep or buggy experience may require a traveler to drive. Read that requirement before treating it as an alternative to a taxi or hired driver.</p>
    </section>
    <IntentViatorCards portSlug="cozumel" topic="taxi-rates" portName="Cozumel" heading={guide.viator.heading} />
    <Copy section={guide.sections[2]} />
    <section className="intent-verdict"><h2>Pay for the arrangement you need</h2><p>{guide.decision}</p><p>A higher package price is useful only when its route, time and inclusions solve your group&apos;s problem. Keep the simpler taxi plan when it already covers the day comfortably.</p></section>
  </div>;
}
