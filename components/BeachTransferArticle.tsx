import Link from "next/link";
import type { PortIntentGuide } from "@/lib/port-intent-guides";
import { IntentViatorCards } from "./IntentViatorCards";
import { PortEditorialPhotos } from "./PortEditorialPhotos";
import styles from "./PortLocalEditorial.module.css";
import jumpStyles from "./IntentBookingLinks.module.css";

function Copy({ section }: { section: PortIntentGuide["sections"][number] }) {
  return <section className="intent-copy-section"><h2>{section.heading}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}{section.bullets && <ul>{section.bullets.map(b => <li key={b}>{b}</li>)}</ul>}</section>;
}

export function BeachTransferArticle({ guide }: { guide: PortIntentGuide }) {
  const westBay = guide.topic === "west-bay-beach-from-cruise-port";
  const booking = <IntentViatorCards portSlug={guide.sourcePortSlug} topic={guide.topic} portName={westBay ? "Roatán" : "Grand Cayman"} heading={guide.viator.heading} />;
  if (westBay) return <div className={styles.copy} data-beach-article="west-bay-terminal-briefing">
    <section className="intent-copy-section">
      <h2>Start with your Roatán terminal</h2>
      <div className={styles.decisions}>
        <div><h3>Coxen Hole: confirm the Town Center pickup</h3><p>Give the driver your ship name and the Coxen Hole terminal, then use the meeting instructions supplied for that booking. The shorter quoted road trip does not include walking off the ship, finding the guide or waiting for other passengers.</p></div>
        <div><h3>Mahogany Bay / Isla Tropicale: check the meeting walk</h3><p>Ask whether your provider meets inside the cruise complex or beyond its exit, and how much walking that involves. If stairs, slopes or vehicle steps are a concern, settle the access arrangements before paying for a beach pass.</p></div>
      </div>
      <p>Discover Roatán quotes approximately 20 minutes from Coxen Hole and 30 minutes from Mahogany Bay for its West Bay excursion. These are operator estimates for the road leg, not promised ship-to-beach times. Compare the <Link href="/ports/roatan/mahogany-bay-vs-coxen-hole">two cruise terminals</Link> if your documents use an unfamiliar name.</p>
    </section>
    <Copy section={guide.sections[0]} />
    <Copy section={guide.sections[1]} />
    <section className="intent-copy-section" data-booking-checklist="west-bay">
      <h2 id="west-bay-booking-checks" tabIndex={-1} className={jumpStyles.target}>What should be written in a West Bay booking?</h2>
      <p>Compare the complete beach day, not just the transfer price. A low fare can become a different purchase once a chair, facilities and the journey back are added. Before choosing a taxi, retained driver or resort package, get these details in the confirmation:</p>
      <ul>
        <li><strong>One named beach venue:</strong> the exact resort or access point, rather than only “West Bay” or “Tabyana.”</li>
        <li><strong>Included facilities:</strong> chair, shade, toilets and shower access; ask separately about food, drinks and snorkel equipment.</li>
        <li><strong>The transport arrangement:</strong> private or shared vehicle, whether it waits, and whether the quoted total is per passenger or for your group.</li>
        <li><strong>The return appointment:</strong> meeting landmark, departure time, terminal drop-off and a contact if the vehicle does not arrive.</li>
        <li><strong>Changed-call terms:</strong> what happens if the ship changes terminals, arrives late or misses Roatán.</li>
      </ul>
      <p>A combination tour can suit a group that wants more than swimming, but ask how much time remains on the beach after the other stops. A sanctuary visit, zipline and island loop are not free additions to a beach transfer: each uses part of the usable call.</p>
    </section>
    {booking}
    <Copy section={guide.sections[2]} />
    <section className="intent-copy-section">
      <h2>Before leaving the sand</h2>
      <p>Set an alarm for packing up before the pickup appointment. Allow time to change, settle any bill and reach the vehicle; a driver waiting at the road cannot see whether your group is still in the water. Carry a dry bag and keep the return contact available without relying on beach Wi-Fi.</p>
      <p>If the return ride is missing, contact the provider while there is still time to arrange another vehicle. Shorten the beach visit when roads or weather deteriorate. For a very short call from Mahogany Bay, its own beach can be the simpler alternative; it is a different outing from West Bay.</p>
    </section>
    <section className="intent-verdict"><h2>Is the West Bay transfer worth it?</h2><p>{guide.decision}</p></section>
  </div>;
  return <div className={styles.copy} data-beach-article="seven-mile-access-selector">
    <section className="intent-copy-section">
      <h2>Choose the access before choosing the vehicle</h2>
      <p>Ask what your group needs on arrival: an uncomplicated swim, a confirmed chair and restroom, or a particular beach setting. A public access name identifies where to go; it does not reserve resort equipment or guarantee that today’s facilities suit your group.</p>
      <div className={styles.scroll}><table><caption>Turn the beach plan into a specific destination</caption><thead><tr><th scope="col">Your priority</th><th scope="col">Destination to investigate</th><th scope="col">Check before setting off</th></tr></thead><tbody>
        <tr><th scope="row">Bring your own beach basics</th><td>A named public access such as Governor’s or Cemetery Beach</td><td>Current entrance, walking distance, shade and the pickup landmark</td></tr>
        <tr><th scope="row">Reserved facilities</th><td>A commercial venue with a confirmed day booking</td><td>Whether chairs, restrooms, showers and transport are included</td></tr>
        <tr><th scope="row">Limited walking tolerance</th><td>An access whose route has been confirmed directly</td><td>Curb-to-sand distance, surfaces and any boarding assistance</td></tr>
      </tbody></table></div>
      <p>Send the access name to everyone in the group and keep a map pin for the road pickup. Avoid asking a driver simply for the “best part” without explaining your needs. A scenic drop-off and a convenient return pickup are separate things to confirm.</p>
    </section>
    <Copy section={guide.sections[0]} />
    <PortEditorialPhotos slug="george-town-grand-cayman" photoSlug="seven-mile-beach-north" />
    <Copy section={guide.sections[1]} />
    <section className="intent-copy-section">
      <h2>What does the lower bus fare leave you to arrange?</h2>
      <p>Routes 1 and 2 serve the Seven Mile Beach / West Bay corridor; the tourism department lists fares starting at CI$2.50. That starting fare is not a private transfer quote or a guaranteed price to every stop. Confirm your destination, fare currency and return direction with the driver.</p>
      <p>With a taxi, agree on the fare and the pickup method before the outbound trip ends. With a bundled beach transfer, check the facility package and fixed return. Keep funds for an alternative ride whichever option you choose; a budget plan still needs a workable way back to George Town.</p>
    </section>
    {booking}
    <Copy section={guide.sections[2]} />
    <section className="intent-copy-section" data-return-check="seven-mile">
      <h2>Use two return checkpoints</h2>
      <dl className={styles.decisions}>
        <div><dt>Leaving the beach</dt><dd>Be dressed, packed and at the road pickup in time for the journey to George Town. Include waiting for transport; the light-traffic drive estimate starts only when the vehicle moves.</dd></div>
        <div><dt>Reaching the tender landing</dt><dd>Return to the correct landing early enough for security, the queue and boarding before your ship’s last tender. Arrival at the waterfront is not the same as being back aboard.</dd></div>
      </dl>
      <p>Record the ship’s last-tender time before leaving George Town and follow any updates. If landing took longer than expected, reduce the beach block rather than compressing these checkpoints. Read the <Link href="/ports/grand-cayman/tender-guide">tender guide</Link> for the arrival and boarding process.</p>
      <p>Have lunch near the landing only if the return allowance remains intact. Never replace a last-tender instruction with the later time printed for the ship’s departure. Current sea conditions and the cruise line’s directions take priority over a sample shore-day plan.</p>
    </section>
    <section className="intent-verdict"><h2>Which transport fits your beach day?</h2><p>{guide.decision}</p></section>
  </div>;
}
