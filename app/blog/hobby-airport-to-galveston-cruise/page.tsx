import type { Metadata } from "next";
import Link from "next/link";
import { LocalPhotoImage } from "@/components/LocalPhotoImage";
import { galvestonTransferPath, galvestonTransferPost as post } from "@/lib/galveston-transfer";
import { siteUrl } from "@/lib/seo";
import styles from "./page.module.css";

const canonical = `${siteUrl}${galvestonTransferPath}`;
const rates = "https://galvestonexpress.com/galveston-taxi-rates-schedule/";
const services = "https://galvestonexpress.com/transportation-houston-galveston/";
const port = "https://www.portofgalveston.com/cruise-parking/arrival-departure-guide/";
const carnival = "https://www.carnival.com/airport-transfers/galveston";
const transfer = "https://www.viator.com/tours/Houston/Galveston-Port-to-William-Hobby-Airport-HOU-Departure-Transfer/d5186-320728P1546?mcid=42383&pid=P00311056&campaign=pdg-hobby-galveston-three-rides&medium=api&api_version=2.0";
export const metadata: Metadata = {
  title: post.seoTitle, description: post.description, alternates: { canonical },
  openGraph: { title: post.title, description: post.description, url: canonical, type: "article", publishedTime: post.published, modifiedTime: post.modified, images: [{ url: post.image, width: post.imageWidth, height: post.imageHeight, alt: post.imageAlt }] },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image] },
};
export default function GalvestonTransferPage() {
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, image: `${siteUrl}${post.image}`, datePublished: post.published, dateModified: post.modified, mainEntityOfPage: canonical, inLanguage: "en-US", isAccessibleForFree: true, author: { "@type": "Organization", name: "PortdayGuide", url: `${siteUrl}/about` }, publisher: { "@type": "Organization", name: "PortdayGuide", url: siteUrl } };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [ { "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: canonical } ] };
  return <main className="blog-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>
    <header className="blog-article-hero">
      <div className="blog-article-heading"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span aria-current="page">Hobby to Galveston</span></nav><p className="eyebrow"><span />{post.category}</p><h1>{post.title}</h1><p className="blog-article-deck">{post.excerpt}</p><div className="blog-article-meta"><span>{post.publishedLabel}</span><span>{post.readTime}</span><span>By {post.author}</span></div></div>
      <figure className="blog-article-cover" style={{ position: "relative" }}><LocalPhotoImage src={post.image} alt={post.imageAlt} width={post.imageWidth} height={post.imageHeight} sizes="(max-width: 800px) calc(100vw - 48px), 42vw" priority /><figcaption className="port-card-photo-credit"><Link href={post.imageCreditHref}>{post.imageAuthor}</Link></figcaption></figure>
    </header>
    <article className={`blog-article-body ${styles.body}`}>
      <p><strong>If you fly into Houston Hobby (HOU) the day before a Galveston cruise, arrange three rides: airport to your overnight hotel, hotel to your assigned cruise terminal, then terminal back to HOU after the cruise.</strong> A shared airport shuttle can suit that plan if it serves your hotel and dates. A private car or rideshare can simplify luggage handling, but compare the complete party price. An airport–port “round trip” does not, by itself, include the separate hotel–port ride.</p>
      <p>This guide is for a party staying on Galveston Island before embarkation, with a separate note for travelers sleeping near Hobby. It does not cover IAH arrivals: check the airport code on both flights before reserving. <a href="https://www.visitgalveston.com/cruising/airport-transportation/" target="_blank" rel="noopener noreferrer">Visit Galveston</a> puts HOU about 40 miles from the terminals, with a typical 45-minute to one-hour drive. That is road time, not the time from landing to hotel check-in or from ship arrival to an airport gate.</p>
      <p className={styles.note}>Sources and product listing checked October 13, 2026. USD prices below are published planning references, not quotes for your dates. The cover shows Royal Caribbean Terminal 10 in August 2023; it is not a current pickup map.</p>

      <h2 id="three-rides">Put three separate journeys on the reservation</h2>
      <div className={styles.journeys}>
        <section><h3>Arrival day: HOU → your Galveston hotel</h3><p>Give the operator the hotel name and street address, flight number, landing time, passenger count and bags. Book a departure that allows for baggage collection and any arrival formalities. Ask what happens if the flight misses the last scheduled shuttle: a later seat, a paid private ride and a refund are different outcomes.</p></section>
        <section><h3>Embarkation morning: hotel → named terminal</h3><p>Ask the hotel whether it provides this ride, which terminals it serves, whether seats must be reserved and what it costs for everyone. If it does not, book a local transfer or plan a taxi/rideshare. Do not infer that an airport shuttle ticket pays for this leg.</p></section>
        <section><h3>Disembarkation day: named terminal → HOU</h3><p>Reserve using the return date, ship, terminal, flight time and complete party. The pickup needs to follow your actual release from the ship, baggage collection and exit procedures. Confirm the meeting location and a contact method before sailing.</p></section>
      </div>
      <p><a href={services} target="_blank" rel="noopener noreferrer">Galveston Express describes hotel drop-offs and a separate hotel-to-port service</a>. Its service area has exceptions: Termini San Luis Pass Road, Jamaica Beach, Crystal Beach, Tiki Island, Pirate’s Beach and locations west of 95th and Seawall need direct approval; its services page also excludes Holiday Inn Club Vacation on Termini-San Luis Road. Obtain confirmation for the exact address instead of relying on a broad “Galveston hotel” description.</p>
      <h3>If your hotel is near Hobby instead</h3>
      <p>Your overnight stop is still in the Houston area. Check the hotel’s airport-shuttle hours and reservation rules, then arrange the longer journey to Galveston the next morning. Galveston Express’s <a href={rates} target="_blank" rel="noopener noreferrer">rate page</a> lists select airport-hotel service with an additional $50 per reservation, not per person. Ask which leg and hotel that charge covers.</p>
      <p>A cruise-line airport transfer can involve returning to HOU. For example, <a href={carnival} target="_blank" rel="noopener noreferrer">Carnival’s Galveston instructions</a> limit transfers to embarkation/debarkation days. Earlier arrivals using its HOU transfer must return near baggage claim 4 by 11 a.m. on sailing day. This is Carnival-specific, not a rule for every line. Returning to the airport from an island hotel would add substantial backtracking; arrange the local hotel–terminal leg instead.</p>

      <h2>For four travelers, compare $180 with a vehicle total</h2>
      <p>Galveston Express’s <a href={rates} target="_blank" rel="noopener noreferrer">published shared-shuttle table</a>, checked October 13, lists HOU–Galveston at <strong>US$45 per person one way</strong> and <strong>US$80–85 per person round trip</strong>. Four standard-fare travelers therefore start at <strong>$180 for one airport leg</strong>, or <strong>$320–340 for the advertised round trip</strong>, before any separately priced hotel–terminal ride or applicable extras. Ask whether the round-trip booking can use your hotel on arrival and cruise terminal on return.</p>
      <p>The operator lists age-based round-trip discounts and a Sunday 9, 10 and 11 a.m. return surcharge with discounts excluded. It also warns that Sunday port pickup/drop-off is limited to 9 a.m.–2 p.m. Use the actual booking total for your dates and ages, not the bottom of the range.</p>
      <div className={styles.formula}><strong>Your transport budget = arrival airport ride + hotel-to-terminal ride + return airport ride + charges not already included.</strong><p>Keep each amount in USD and label it “whole party,” “per seat” or “per vehicle.” Add the cost of a second vehicle if the people and luggage cannot fit together.</p></div>
      <p>For a useful comparison, an all-in private-vehicle quote below $180 would beat that four-person, $45-per-seat reference for the <em>same single airport journey</em>. It would not establish that all three rides are cheaper. Rideshare fares and vehicle availability vary; check the app for the correct endpoints and vehicle size rather than treating another traveler’s fare as a tariff. Confirm whether tolls, airport/port charges, waiting and gratuity are included in any quote.</p>
      <p>Passenger capacity is only half the question. Four people with four large cases, carry-ons and a stroller may need a different vehicle from four people traveling light. Send bag counts and sizes before paying a private operator. Request the correct child seats or boarding assistance explicitly; “SUV,” “private” and “accessible” are not interchangeable promises.</p>

      <h2>At Hobby, follow the pickup instructions for the service you booked</h2>
      <p>Collect bags before heading outside. <a href="https://www.fly2houston.com/hou/ground-transportation/taxi-and-ride-apps/" target="_blank" rel="noopener noreferrer">Houston Airports’ HOU page</a> places taxis at <strong>Curb Zone 2</strong> and ride-app pickups at <strong>Curb Zone 5</strong>, both outside baggage claim on the Arrivals level. For ride apps it directs passengers toward the exit nearest carousel 4. Follow current signs and the app’s assigned point if arrangements change.</p>
      <p>A booked shuttle or chauffeur may use a different meeting procedure. Save that operator’s instructions and phone number offline, including whether the driver meets inside or at a curb. Do not stand in the ride-app zone simply because you booked a private vehicle. If you need to change flights or arrive late, contact the booked provider before making a second transport purchase.</p>

      <h2>The next morning, the ship decides which terminal</h2>
      <p>The <a href={port} target="_blank" rel="noopener noreferrer">Port of Galveston’s arrival guide</a> identifies terminals <strong>25, 28, 16 and 10</strong>. Use the terminal and address in your sailing documents, then reconfirm any last-minute change with the cruise line. The terminal pictured here is one example, not the destination for every ship.</p>
      <p>Arrange hotel checkout, luggage loading and the local journey around your assigned check-in window. An island hotel is not automatically walkable to your berth, and the port says the Galveston trolley does not stop at the port. Its complimentary parking-lot shuttles are not a general hotel-transfer service. For a hotel shuttle, ask where it unloads and whether its departure actually fits your arrival slot.</p>
      <p>Book reserved transport once your flights, hotel and sailing are settled if you need a particular vehicle, child seat or assistance arrangement. There is no verified universal “book X days ahead” rule or guaranteed cheaper booking hour. Review change, cancellation and missed-flight terms before committing, and save the confirmation for each leg separately.</p>

      <h2>Work backward from the flight home</h2>
      <p>Do not choose a flight by adding one hour to the ship’s scheduled arrival. Add the time to leave the ship, collect bags, meet transport, travel to HOU and meet your airline’s check-in/security requirements, with room for delay. Ask your cruise line and transfer operator whether the specific flight works; use the stricter instruction.</p>
      <p>For its own Galveston transfer, <a href={carnival} target="_blank" rel="noopener noreferrer">Carnival currently requires return flights no earlier than 1:30 p.m.</a> This is a condition of that service, not a universal guarantee that a 1:30 p.m. flight is suitable for every ship or independent transfer. Recheck your sailing before buying air tickets.</p>
      <aside className={styles.transfer} data-affiliate-placement="galveston-return-hou" data-affiliate-product="320728P1546">
        <h3>A private return transfer to investigate</h3>
        <p>Viator product <strong>320728P1546</strong>, supplied by taxiGo DMC, describes a <strong>one-way Port of Galveston → HOU</strong> private transfer with a nameplate meeting, approximately 55 minutes’ travel and fees/taxes included. It asks for the ship, terminal, bag count and pickup time. This covers the third ride only; it is not an airport-to-hotel or three-leg package.</p>
        <p>The listing says infant seats are available and the service is not wheelchair accessible. It advertises cancellation up to 24 hours before the experience. Its headline price is <strong>per person and varies with the party</strong>, despite the vehicle being private. Enter everyone and confirm the total, suitable vehicle, exact meeting point, waiting policy and flight timing.</p>
        <p><strong>No selected-date availability or family quote has been verified.</strong> The seller’s suggested pickup at least three hours before the flight still needs to fit disembarkation and your airline’s requirements. Obtain confirmation before paying.</p>
        <p><a href={transfer} target="_blank" rel="sponsored nofollow noopener noreferrer">Check the Galveston-to-HOU transfer details on Viator ↗</a></p>
      </aside>
      <p>Before leaving home, save the three confirmations together: each date, pickup address, destination, passenger/bag count, total, cancellation cutoff and provider contact. An empty hotel-to-port row is the missing booking to resolve, even when both airport journeys say “confirmed.”</p>
      <p>If your sailing includes them, plan the separate shore days with our <Link href="/ports/cozumel/taxi-rates">Cozumel taxi budget guide</Link> and <Link href="/ports/roatan/mahogany-bay-vs-coxen-hole">Roatan terminal and pickup comparison</Link>. Still comparing departure plans? Our <Link href="/blog/future-of-cruise-ship-terminals/mco-to-port-canaveral">MCO–Port Canaveral transport guide</Link> covers that Florida airport route separately.</p>
    </article>
    <section className="blog-back-link"><Link href="/blog">← More cruise planning guides</Link></section>
    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Verify your sailing and booking conditions.</small></footer>
  </main>;
}
