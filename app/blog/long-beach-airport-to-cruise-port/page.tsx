import type { Metadata } from "next";
import Link from "next/link";
import { LocalPhotoImage } from "@/components/LocalPhotoImage";
import { longBeachTransferPath, longBeachTransferPost as post } from "@/lib/long-beach-transfer";
import { siteUrl } from "@/lib/seo";
import styles from "./page.module.css";

const canonical = `${siteUrl}${longBeachTransferPath}`;
const airport = "https://www.longbeach.gov/lgb/airlines-destinations/transportation/";
const sanPedro = "https://portoflosangeles.org/business/terminals/passenger/cruise";
const carnival = "https://www.carnival.com/shore-excursions/long-beach-los-angeles/transportation-long-beach-airport-to-port-lgb-113025";
const products = [
  { code: "320728P1520", title: "LGB Airport → Carnival Long Beach terminal", supplier: "taxiGo DMC", destination: "231 Windsor Way, Long Beach", duration: "About 15 minutes advertised", url: "https://www.viator.com/tours/Long-Beach/Los-Angeles-World-Cruise-Center-to-Los-Angeles-RoundTrip-Transfer/d5409-320728P1520" },
  { code: "128285P2397", title: "LGB Airport → World Cruise Center, San Pedro", supplier: "taxiGo.online", destination: "100 Swinford Street, San Pedro", duration: "About 20 minutes advertised", url: "https://www.viator.com/tours/Long-Beach/Long-Beach-Airport-LGB-to-World-Cruise-Center-Arrival-Private-Transfer/d5409-128285P2397" },
];
export const metadata: Metadata = {
  title: post.seoTitle, description: post.description, alternates: { canonical },
  openGraph: { title: post.title, description: post.description, url: canonical, type: "article", publishedTime: post.published, modifiedTime: post.modified, images: [{ url: post.image, width: post.imageWidth, height: post.imageHeight, alt: post.imageAlt }] },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [post.image] },
};
function TransferCard({ index }: { index: number }) {
  const product = products[index];
  const href = `${product.url}?mcid=42383&pid=P00311056&campaign=pdg-lgb-correct-cruise-port&medium=api&api_version=2.0`;
  return <div className={styles.recommendation}>
    <div className="intent-viator-grid"><a className="intent-viator-card" href={href} data-affiliate-placement={index === 0 ? "lgb-carnival-arrival" : "lgb-san-pedro-arrival"} data-affiliate-product={product.code} target="_blank" rel="sponsored nofollow noopener noreferrer">
      <div className={styles.cardImage}><LocalPhotoImage src={post.image} alt="Long Beach Airport in 2009, shown as airport context rather than a transfer vehicle" width={post.imageWidth} height={post.imageHeight} sizes="(max-width:600px) calc(100vw - 40px), 210px" /><small>LGB airport context · 2009</small></div>
      <div><span>Private arrival transfer · {product.duration}</span><h3>{product.title}</h3><p>{product.supplier} lists an airport arrival transfer to <strong>{product.destination}</strong>. Match this address to your sailing.</p><b>Check date, vehicle &amp; party total on Viator ↗</b></div>
    </a></div>
    <p className={styles.credit}><Link href={post.imageCreditHref}>{post.imageAuthor}</Link></p>
    <p className={styles.conditions}>The listing charges <strong>per person, varying with party size</strong>, despite private vehicle use. Fees/taxes are listed as included. It describes an arrival-hall nameboard meeting after baggage collection; confirm the exact point, flight-delay waiting and pickup time. Supply luggage count, ship and terminal. Infant seats are listed, but request the appropriate seat; the service is <strong>not wheelchair accessible</strong>. Cancellation is advertised up to 24 hours before the experience.</p>
  </div>;
}
export default function LongBeachTransferPage() {
  const schema = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.description, image: `${siteUrl}${post.image}`, datePublished: post.published, dateModified: post.modified, mainEntityOfPage: canonical, inLanguage: "en-US", isAccessibleForFree: true, author: { "@type": "Organization", name: "PortdayGuide", url: `${siteUrl}/about` }, publisher: { "@type": "Organization", name: "PortdayGuide", url: siteUrl } };
  const breadcrumbs = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: siteUrl }, { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` }, { "@type": "ListItem", position: 3, name: post.title, item: canonical }] };
  return <main className="blog-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    <header className="simple-header"><Link className="brand" href="/">PortdayGuide<span>.</span></Link><nav><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/planner">Free planner</Link></nav></header>
    <header className="blog-article-hero"><div className="blog-article-heading"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Blog</Link><span>/</span><span aria-current="page">LGB cruise transfers</span></nav><p className="eyebrow"><span />{post.category}</p><h1>{post.title}</h1><p className="blog-article-deck">{post.excerpt}</p><div className="blog-article-meta"><span>{post.publishedLabel}</span><span>{post.readTime}</span><span>By {post.author}</span></div></div>
      <figure className="blog-article-cover" style={{ position: "relative" }}><LocalPhotoImage src={post.image} alt={post.imageAlt} width={post.imageWidth} height={post.imageHeight} sizes="(max-width:800px) calc(100vw - 48px), 42vw" priority /><figcaption className="port-card-photo-credit"><Link href={post.imageCreditHref}>{post.imageAuthor}</Link></figcaption></figure></header>
    <article className={`blog-article-body ${styles.body}`}>
      <p><strong>From Long Beach Airport (LGB), take a taxi, rideshare or reserved transfer to the exact terminal on your cruise documents. Long Beach Cruise Terminal beside the Queen Mary and the Los Angeles World Cruise Center in San Pedro are different destinations.</strong> Flying into LGB does not mean your ship leaves from Long Beach. Set the port first; then compare the ride for your people, bags and boarding window.</p>
      <p className={styles.note}>Official pages and both product listings checked October 15, 2026. This guide covers direct road transfers from LGB, not LAX. The photograph shows the airport in 2009; it is not a current curb or terminal map. Prices and service rules can change.</p>

      <h2 id="correct-port">Put one of these addresses on the booking</h2>
      <div className={styles.addresses}>
        <section><h3>Long Beach Cruise Terminal</h3><address>231 Windsor Way<br />Long Beach, CA 90802</address><p>Carnival identifies this as its terminal at the Queen Mary. Verify the address in your own sailing instructions.</p><a href="https://www.carnival.com/help?topicid=1196" target="_blank" rel="noopener noreferrer">Carnival terminal directions ↗</a></section>
        <section><h3>World Cruise Center, San Pedro</h3><address>100 Swinford Street<br />San Pedro, CA 90731</address><p>The Port of Los Angeles identifies its cruise terminal here at Berths 91–93. Confirm your ship&apos;s assigned berth.</p><a href={sanPedro} target="_blank" rel="noopener noreferrer">Port of Los Angeles terminal information ↗</a></section>
      </div>
      <p>The <a href={sanPedro} target="_blank" rel="noopener noreferrer">port authority explicitly distinguishes the two ports</a>. Do not use a generic “Los Angeles cruise port” search result, hotel neighborhood or the airport code as your final instruction to a driver. Save the ship, date, terminal name and street address together. If your line changes the berth, update the transfer rather than assuming the original confirmation follows the change.</p>

      <h2>At LGB: a curb pickup and an arrival-hall meeting are different</h2>
      <p>The <a href={airport} target="_blank" rel="noopener noreferrer">airport&apos;s ground-transportation page</a> places the taxi stand outside the terminal next to Parking Structure A and app-based transportation on the outer curb in front of the terminal. Collect your bags first, then follow current signs and the app&apos;s assigned point. A reserved chauffeur may instead ask you to meet inside; use that provider&apos;s confirmation, not the rideshare curb by default.</p>
      <p>For a family, choose the vehicle using both passenger seats and cargo space. Give a private operator the number and size of cases, stroller and any mobility equipment before paying. Request an appropriate child seat explicitly; do not assume that an available car has one. The airport says wheelchair-accessible taxis and shuttles need advance reservations. A standard private-transfer listing is not evidence of an accessible vehicle.</p>
      <p>A rental car adds collection and return arrangements. For a direct airport–ship trip, compare a door-to-door ride before renting; if you need a car for an overnight stay or sightseeing, check the actual return branch, hours and onward terminal transfer separately. Public transport is another trip-planning exercise: use the airport&apos;s transit links rather than treating a bus to downtown as a direct service to either ship.</p>

      <h2>If your ship leaves from Carnival&apos;s Long Beach terminal</h2>
      <p><a href={carnival} target="_blank" rel="noopener noreferrer">Carnival&apos;s LGB transfer page</a>, checked October 15, starts at <strong>US$31.99 per person one way</strong>. It lists a 12:30 p.m. flight-arrival cutoff, 9:30 a.m.–1 p.m. service and baggage claim 1 pickup. These are transfer conditions, not a safe-flight recommendation.</p>
      <p>Purchase is allowed until two days before sailing; parties of four or more use Cruise Manager. Earlier arrivals must return to LGB by noon on sailing day and coordinate pickup. An introductory sentence says LAX despite the LGB title and detailed instructions: confirm the airport and sailing before paying. Do not assume hotel collection.</p>
      <p>A private ride is a different purchase: you reserve for your own party rather than buying seats on that cruise-line transfer. The following listing&apos;s displayed destination is the Long Beach address above.</p>
      <TransferCard index={0} />

      <h2>If your ship leaves from San Pedro</h2>
      <p>The <a href={airport} target="_blank" rel="noopener noreferrer">airport publishes a US$50 taxi flat-rate entry labelled “San Pedro/Cruise Ships”</a>. It does not identify every eligible berth, vehicle capacity, surcharge or effective date. Confirm the destination, complete vehicle price and luggage fit with the dispatcher. Do not apply that entry to Carnival&apos;s separate Long Beach terminal or assume the reverse journey has the same tariff.</p>
      <p>For a reserved arrival service, this separate product lists drop-off at the World Cruise Center in San Pedro. It is the relevant branch of this comparison only when that is your ship&apos;s destination.</p>
      <TransferCard index={1} />
      <p className={styles.note}>Both Viator pages displayed an upcoming two-person option for October 16 when reviewed. That confirms an offering observed at one time, not inventory for your sailing. Their legacy URL wording can differ from the current title: verify the displayed airport, direction and drop-off address. Neither card includes a return journey or hotel stop. Advertised 15/20-minute durations are not airport-to-boarding allowances; traffic, bags, meeting and check-in add time.</p>

      <h2 id="party-total">Compare the total only after the destination matches</h2>
      <p>For four standard-fare travelers, four US$31.99 Carnival seats give a <strong>US$127.96 one-way starting reference</strong>, before any applicable changes or extras. Compare it with an actual quote for a suitable vehicle to <em>the same Long Beach terminal</em>. The airport&apos;s US$50 San Pedro entry is a different route; using those two figures as competing fares would be misleading.</p>
      <p>For the same route, record the amount for everyone, included fees, waiting after a delayed flight, cancellation deadline, luggage/seat arrangements and any extra vehicle. A “private” ride may still be priced per person, as the two listings above are. Rideshare quotes are live and vehicle-specific; compare the app&apos;s current total instead of a fare reported by another traveler. Keep USD amounts separate from any foreign-currency card conversion.</p>
      <p>Choose the cruise shuttle when its dates, meeting process and flight conditions fit; consider a taxi or rideshare when you want to depart after collecting bags and can confirm a suitable vehicle; consider reserved transport when a written meeting plan or specific vehicle is important. None of those choices removes the need to check the terminal.</p>

      <h2>Protect the boarding window—and plan the airport ride home separately</h2>
      <p>Start with the cruise line&apos;s required terminal arrival time. Before it, allow for landing, baggage collection, meeting the vehicle, the current road estimate and disruption. Do not make a same-day flight workable simply by substituting a product&apos;s shortest advertised drive. Arriving the day before gives room for flight disruption; include the hotel and the next morning&apos;s correct terminal ride in that plan.</p>
      <p>For a San Pedro sailing, <a href="https://www.royalcaribbean.com/faq/questions/port-arrival-travel-options" target="_blank" rel="noopener noreferrer">Royal Caribbean describes its own guest transfers as sailing-day and debarkation-day services</a>. Ask whether LGB, your flight and your ship are served; that general policy does not establish a particular LGB shuttle or hotel pickup.</p>
      <p>On the return, a ship&apos;s scheduled arrival is not your vehicle pickup time. Add disembarkation, bags, the correct port meeting point, road time and the airline&apos;s check-in/security allowance. Ask the cruise line about your proposed flight before purchasing it. An airport-arrival transfer cannot be reversed simply by reusing its booking. Keep provider instructions offline and tell them about flight or berth changes.</p>
      <p>For other embarkation journeys, see our <Link href="/blog/hobby-airport-to-galveston-cruise">Hobby–Galveston overnight transfer guide</Link> and <Link href="/blog/future-of-cruise-ship-terminals/mco-to-port-canaveral">MCO–Port Canaveral guide</Link>. The <Link href="/planner">free cruise planner</Link> can help organize shore days separately from getting to the ship.</p>
    </article>
    <section className="blog-back-link"><Link href="/blog">← More cruise planning guides</Link></section>
    <footer><Link className="brand" href="/">PortdayGuide<span>.</span></Link><div><Link href="/ports">Port guides</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div><small>© 2026 PortdayGuide. Check your sailing and booking conditions.</small></footer>
  </main>;
}
