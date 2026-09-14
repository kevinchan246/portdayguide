import Link from "next/link";
import type { PortIntentGuide } from "@/lib/port-intent-guides";
import { IntentViatorCards } from "./IntentViatorCards";
import { PortScenicPhoto } from "./PortScenicPhoto";
import styles from "./TokyoYokohamaTransferArticle.module.css";

const accessUrl = "https://osanbashi.jp/en/access/";
const terminalUrl = "https://www.city.yokohama.lg.jp/lang/overseas/port/cruise/terminal_info.html";
const nearbyGuide = "/ports/yokohama-tokyo/things-to-do-near-yokohama-cruise-terminal";

const origins = [
  { name: "Tokyo Station", route: "JR Tokaido Line → Yokohama → Minatomirai Line", detail: "The terminal lists about 25 minutes for the Tokyo–Yokohama rail leg. At Yokohama, change to the Minatomirai Line for your waterfront station." },
  { name: "Shinagawa", route: "JR Tokaido or Yokosuka Line → Yokohama → Minatomirai Line", detail: "The published reference is about 20 minutes to Yokohama. Choose a service stopping there and allow time to find the next platform with your bags." },
  { name: "Shibuya", route: "Tokyu Toyoko Line → Minatomirai Line through service", detail: "On a through service, you can remain on the train at Yokohama. Check the destination and stopping pattern before boarding. Osanbashi lists about 40 minutes from Shibuya to Nihon-odori." },
  { name: "Shinjuku", route: "JR Shonan-Shinjuku Line → Yokohama → Minatomirai Line", detail: "The terminal gives about 30 minutes for the rail leg to Yokohama. Use a southbound service stopping at Yokohama; add time for the station transfer." },
];

export function TokyoYokohamaTransferArticle({ guide, hub }: { guide: PortIntentGuide; hub: string }) {
  return <div className={styles.guide} data-transfer-guide="tokyo-to-yokohama-embarkation">
    <section className={styles.answer} aria-labelledby="tokyo-transfer-answer">
      <h2 id="tokyo-transfer-answer">How do I get from Tokyo to Yokohama Cruise Terminal?</h2>
      <p>{guide.quickAnswer}</p>
      <p className={styles.scope}>This guide starts at a Tokyo hotel or city station and ends at your embarkation terminal. If you are arriving at Haneda or Narita, look up the airport-origin route separately before choosing a city transfer.</p>
    </section>

    <section aria-labelledby="confirm-yokohama-terminal">
      <h2 id="confirm-yokohama-terminal">Your cruise documents decide the destination</h2>
      <p>Copy the terminal name, address and assigned arrival window into your journey plan. “Yokohama cruise port” covers three different terminals. A train route that works well for Osanbashi can leave you far from the entrance for Daikoku.</p>
      <div className={styles.tableWrap} role="region" aria-label="Yokohama terminal access comparison" tabIndex={0}>
        <table><caption>Match the final approach to the named terminal</caption><thead><tr><th scope="col">Terminal</th><th scope="col">Where to aim</th><th scope="col">Last part of the journey</th></tr></thead><tbody>
          <tr><th scope="row">Osanbashi<br /><small>Yokohama International Passenger Terminal</small></th><td>Nihon-odori station<br /><small>1-1-4 Kaigandori, Naka-ku</small></td><td>The terminal estimates a 7-minute walk from exits 3 or 4. Use the station map to find an elevator route if needed.</td></tr>
          <tr><th scope="row">Shinko Pier Cruise Terminal</th><td>Bashamichi station<br /><small>2-11-4 Shinko, Naka-ku</small></td><td>The city estimates a 10-minute walk. Follow the cruise check-in directions for Shinko.</td></tr>
          <tr><th scope="row">Daikoku Pier Cruise Terminal</th><td>A confirmed vehicle connection<br /><small>13 Daikoku-Futo, Tsurumi-ku</small></td><td>The city describes taxi access from Motomachi-Chukagai or Shin-Koyasu, about 15 minutes from either. Arrange the final vehicle leg.</td></tr>
        </tbody></table>
      </div>
      <p className={styles.sourceNote}>Addresses and terminal connections: <a href={terminalUrl} target="_blank" rel="noopener noreferrer">City of Yokohama</a>. Osanbashi walking guidance: <a href={accessUrl} target="_blank" rel="noopener noreferrer">terminal access page</a>. Published journey estimates are approximate.</p>
    </section>

    <section aria-labelledby="tokyo-starting-station">
      <h2 id="tokyo-starting-station">Choose the route from your Tokyo base</h2>
      <p>Start with the station that is practical from your hotel. The corridors below reach Yokohama; your terminal determines where you finish. Osanbashi uses Nihon-odori, Shinko is closer to Bashamichi, and Daikoku needs a planned vehicle connection.</p>
      <ol className={styles.routes}>{origins.map(origin => <li key={origin.name}><h3>{origin.name}</h3><p className={styles.route}>{origin.route}</p><p>{origin.detail}</p></li>)}</ol>
      <p>For Osanbashi, the terminal lists about 6 minutes on the Minatomirai Line from Yokohama to Nihon-odori, followed by the outdoor walk. Add hotel-to-station travel, waiting, platform changes and luggage handling to those individual legs when planning your arrival.</p>
      <p className={styles.sourceNote}>Route references: <a href={accessUrl} target="_blank" rel="noopener noreferrer">Osanbashi access</a>. <a href="https://www.mm21railway.co.jp/global/english/info/" target="_blank" rel="noopener noreferrer">Minatomirai Railway</a> confirms through running with the Toyoko Line. Check a current journey planner for your date and departure time.</p>
    </section>

    <aside className={styles.daikoku} aria-labelledby="daikoku-arrival">
      <h2 id="daikoku-arrival">If your ship uses Daikoku, settle the final connection first</h2>
      <p>Daikoku sits inside a restricted logistics area. The terminal instructs passengers to carry boarding documentation, such as an e-ticket, for entry; only passengers may enter, and send-offs at the terminal are not permitted.</p>
      <p>Follow the organizer&apos;s stated arrival time. The official instructions say to arrive after the specified time, so an early arrival at the port gate may not be useful. Ask your cruise line whether your sailing offers a transfer and confirm its pickup, eligibility and schedule. For a booked car, give the provider the exact berth and entry instructions. <a href="https://osanbashi.jp/en/other/" target="_blank" rel="noopener noreferrer">Check the official Daikoku instructions →</a></p>
    </aside>

    <section aria-labelledby="luggage-transport-choice">
      <h2 id="luggage-transport-choice">Let the luggage decide how many connections to make</h2>
      <dl className={styles.choices}>
        <div><dt>Train and walk</dt><dd>Consider this for Osanbashi or Shinko when everyone can handle their own bags through stations and along the outdoor approach. Choose manageable connections over a small saving in scheduled train time.</dd></div>
        <div><dt>Train and taxi</dt><dd>Use rail for the longer journey, then a vehicle for the terminal approach. Confirm the taxi pickup point at your chosen station and allow for finding a car large enough for the complete party.</dd></div>
        <div><dt>A car from your Tokyo hotel</dt><dd>Compare this when bags, children or walking needs make transfers difficult. Confirm the hotel pickup address, the named Yokohama terminal, vehicle capacity and every suitcase before paying.</dd></div>
      </dl>
      <p>Minatomirai Railway states that its stations have elevators between street and platform, with some wider gates. The shortest numbered exit can differ from the accessible route. Use the <a href="https://www.mm21railway.co.jp/global/english/station/nihonodori/stationmap.html" target="_blank" rel="noopener noreferrer">Nihon-odori station map</a> when planning Osanbashi access, and ask a provider directly about any wheelchair or boarding assistance.</p>
    </section>

    <IntentViatorCards portSlug={guide.sourcePortSlug} topic={guide.topic} portName="Tokyo to Yokohama" heading={guide.viator.heading} />

    <section aria-labelledby="transfer-costs">
      <h2 id="transfer-costs">Compare the full fare before choosing</h2>
      <p>A Tokyo-to-Yokohama rail fare may be only part of the trip. Check the complete origin-to-final-station itinerary, including any Minatomirai connection. Suica and PASMO are accepted on that line; paper-ticket and IC fares can differ. The railway&apos;s <a href="https://www.mm21railway.co.jp/global/english/info/ticket.html" target="_blank" rel="noopener noreferrer">ticket information</a> explains the payment options.</p>
      <p>For rail plus taxi, add the final vehicle quote and any extra vehicles your group needs. For a car from Tokyo, ask whether the confirmed total includes tolls, waiting, luggage, child seats and the chosen terminal. A starting price for one traveler does not establish the price for a family and its bags.</p>
      <p>Before booking a transfer, match the pickup direction, hotel address and drop-off terminal to your cruise documents. Check the cancellation deadline and what the provider will do if your sailing changes its berth or arrival arrangements.</p>
    </section>

    <figure className="intent-attraction-photo" data-photo-source="Unsplash">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://images.unsplash.com/photo-1608391355752-9e13c87c8d71?auto=format&fit=crop&w=1600&q=82" alt="Geometric wooden rooftop deck at Osanbashi passenger terminal in Yokohama" width={1600} height={1000} loading="lazy" decoding="async" />
      <figcaption><a href="https://unsplash.com/photos/black-and-white-striped-textile-Ps3lhJyGhIY?utm_source=portdayguide&utm_medium=referral" target="_blank" rel="noopener noreferrer">Osanbashi&apos;s rooftop deck</a>. Photo by <a href="https://unsplash.com/@bady?utm_source=portdayguide&utm_medium=referral" target="_blank" rel="noopener noreferrer">bady abbas</a> on Unsplash. Follow your cruise line&apos;s passenger check-in directions when arriving with luggage.</figcaption>
    </figure>

    <section aria-labelledby="embarkation-arrival-window">
      <h2 id="embarkation-arrival-window">Work backward from the check-in window</h2>
      <p>Use the arrival window and final check-in deadline in your cruise documents. The ship&apos;s departure time is too late to use as a terminal-arrival target. Neither a generic journey estimate nor a public berth schedule replaces the instructions for your sailing.</p>
      <ol className={styles.arrivalPlan}><li><strong>Confirm the destination:</strong> named terminal, address, entry documents and any sailing-specific transfer pickup.</li><li><strong>Build the complete journey:</strong> hotel checkout, station access, train waiting and changes, then the terminal walk or taxi.</li><li><strong>Allow for disruption:</strong> choose a departure that leaves room for slower luggage handling or a missed connection while respecting your arrival window.</li></ol>
      <p>Keep the cruise line&apos;s contact and the provider&apos;s pickup instructions available offline. If a train disruption or road delay threatens check-in, contact the cruise line promptly and ask about your options.</p>
    </section>

    <section className={styles.faq} aria-labelledby="tokyo-transfer-faq"><h2 id="tokyo-transfer-faq">Before you leave Tokyo</h2>{guide.faqs?.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>

    <section className={styles.sources} aria-labelledby="tokyo-transfer-sources"><h2 id="tokyo-transfer-sources">Route sources and checks</h2><p>Checked against the official terminal, city and railway pages in September 2026. Recheck your travel date and cruise documents for service changes, terminal assignments and check-in instructions.</p><ul>{guide.sources.map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><span>{source.note}</span></li>)}</ul></section>

    <section className={styles.related} aria-labelledby="tokyo-transfer-related"><h2 id="tokyo-transfer-related">Related Yokohama guides</h2><div>
      <Link href={hub}><PortScenicPhoto slug="yokohama-tokyo" name="Yokohama (Tokyo)" country="Japan" /><div><h3>Yokohama (Tokyo) Cruise Port Guide</h3><p>Explore the wider port, local transport and shore-day choices.</p></div></Link>
      <Link href={nearbyGuide}><PortScenicPhoto slug="yokohama-tokyo" name="Yokohama (Tokyo)" country="Japan" /><div><h3>Things to do near Yokohama Cruise Terminal</h3><p>Plan nearby sights and dining when your luggage and boarding arrangements allow.</p></div></Link>
    </div></section>
  </div>;
}
