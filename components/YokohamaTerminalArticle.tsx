import Link from "next/link";
import { IntentViatorCards } from "@/components/IntentViatorCards";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import type { PortIntentGuide } from "@/lib/port-intent-guides";

type AttractionPhotoProps = {
  imageUrl: string;
  photoUrl: string;
  photographer: string;
  photographerUrl: string;
  alt: string;
  place: string;
};

function AttractionPhoto({ imageUrl, photoUrl, photographer, alt, place }: AttractionPhotoProps) {
  return <figure className="intent-attraction-photo" data-photo-source="Unsplash">
    {/* Unsplash-hosted editorial photography, with the photographer and source credited directly below. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={imageUrl} srcSet={`${imageUrl.replace("w=1600", "w=640")} 640w, ${imageUrl} 1600w`} sizes="(max-width: 820px) calc(100vw - 40px), 780px" alt={alt} title={place} width="1600" height="1000" loading="lazy" decoding="async" />
    <figcaption><a href={photoUrl} target="_blank" rel="noopener noreferrer">{photographer}</a></figcaption>
  </figure>;
}

export function YokohamaTerminalArticle({ guide, hub }: { guide: PortIntentGuide; hub: string }) {
  return <>
    <div className="intent-editorial-copy">
      <p><strong>From Osanbashi, choose Yamashita Park and Chinatown for a park-and-food walk, or the Red Brick Warehouse and Minato Mirai for a waterfront outing.</strong> These are alternative directions for a compact port day. Choose one main area, check the time left after disembarkation, and keep the return to your ship in the plan.</p>
      <aside className="intent-editorial-note"><strong>Confirm your terminal first.</strong><p>This guide is centered on Osanbashi Pier. Yokohama calls can also use Shinko or Daikoku, whose first-mile transport is different. Use the exact terminal in your cruise documents before following a walking or pickup plan.</p></aside>

      <section aria-labelledby="terminal-overview">
        <h2 id="terminal-overview">Start with the time you actually have ashore</h2>
        <p>Osanbashi is the Yokohama International Passenger Terminal. The <a href="https://www.yokohamajapan.com/cruise/terminal/osanbashi/" target="_blank" rel="noopener noreferrer">official visitor guide</a> places Yamashita Park, Chinatown and the Red Brick Warehouse within walking distance. That location helps you build a flexible outing, but your gangway, terminal exit and walking pace still determine when sightseeing begins.</p>
        <ul>
          <li><strong>A short or delayed call:</strong> keep a park or waterfront stop that can be shortened.</li>
          <li><strong>A meal is the priority:</strong> choose Chinatown and leave time to order and eat.</li>
          <li><strong>A timed museum activity:</strong> check the date and session before extending the walk.</li>
        </ul>
        <p>The rooftop observation deck offers a nearby place for harbor views. Keep it as a flexible final stop if permitted access and your boarding instructions allow. A sightseeing plan for a port call is different from filling spare time before embarkation: luggage and your check-in window come first.</p>
      </section>

      <section aria-labelledby="getting-to-terminal">
        <h2 id="getting-to-terminal">Arriving from Tokyo, or using a different berth?</h2>
        <p>For a Tokyo hotel-to-ship journey, use the <Link href="/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal">Tokyo to Yokohama Cruise Terminal guide</Link> to compare the complete train connection, luggage and vehicle pickup. This page focuses on what to do nearby after your terminal and available time are confirmed.</p>
        <p>If the ship uses Shinko or Daikoku, first check the <Link href={hub}>Yokohama port guide</Link> and your cruise line&apos;s passenger access arrangements. Do not apply an Osanbashi walking route to a distant berth or assume a shuttle is available for every sailing.</p>
      </section>
    </div>

    <div className="intent-editorial-copy">
      <section aria-labelledby="nearby-attractions">
        <h2 id="nearby-attractions">Attractions Near Yokohama Cruise Terminal</h2>
        <p>Osanbashi is surrounded by cultural landmarks, waterfront parks, museums, dining, and shopping. The most efficient cruise-day plan groups nearby places rather than crossing the city repeatedly.</p>

        <h3>Cultural landmarks</h3>
        <p>Yokohama&apos;s cultural attractions offer a view of the city&apos;s international history and modern creativity. Three well-known options are Yokohama Chinatown, the Cup Noodles Museum, and Sankeien Garden.</p>

        <h3>Yokohama Chinatown</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1529921725089-e25882771425?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/people-walking-pass-blue-chinese-gate-z2C9acfjvws?utm_source=portdayguide&utm_medium=referral"
          photographer="Yu Kato"
          photographerUrl="https://unsplash.com/@yukato?utm_source=portdayguide&utm_medium=referral"
          alt="People walking beneath a colorful gate in Yokohama Chinatown"
          place="Yokohama Chinatown"
        />
        <p>Yokohama Chinatown is one of the world&apos;s largest Chinatowns, with restaurants, temples, shops, colorful gates, and busy pedestrian streets. Visitors can sample regional Chinese dishes and see Kanteibyo Temple. It combines easily with Yamashita Park or the waterfront.</p>

        <h3>Cup Noodles Museum</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1566841518968-94f239e7cb1a?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/cup-noodles-drama-theater-neon-light-signage-7Z_vOw_z4ZY?utm_source=portdayguide&utm_medium=referral"
          photographer="Matt & Chris Pua"
          photographerUrl="https://unsplash.com/@pua_photos?utm_source=portdayguide&utm_medium=referral"
          alt="Cup Noodles display inside the Cup Noodles Museum in Yokohama"
          place="Cup Noodles Museum"
        />
        <p>The Cup Noodles Museum presents the history and design of instant noodles through interactive exhibits. Check the <a href="https://www.cupnoodles-museum.jp/en/yokohama/guide/admission/" target="_blank" rel="noopener noreferrer">official calendar</a> before making it the main stop: the regular closure is Tuesday, or the following day when Tuesday is a national holiday, with additional year-end closures.</p>
        <p>Museum admission and a noodle-making session are separate decisions. The <a href="https://www.cupnoodles-museum.jp/en/yokohama/guide/faq/" target="_blank" rel="noopener noreferrer">official booking FAQ</a> distinguishes admission from reserved activities; an online My CUPNOODLES Factory package includes a specified activity slot. Choose only a session that fits the walk there, the activity and your return. A general museum ticket does not promise immediate entry to every workshop.</p>

        <h3>Sankeien Garden</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1682787272912-ea48b2833358?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/a-path-leading-to-a-pavilion-in-a-park-daEJYP5I58M?utm_source=portdayguide&utm_medium=referral"
          photographer="Mmoka"
          photographerUrl="https://unsplash.com/@pedarun?utm_source=portdayguide&utm_medium=referral"
          alt="A garden path leading to a traditional pavilion in Sankeien Garden"
          place="Sankeien Garden"
        />
        <p>Sankeien Garden pairs landscaped grounds with historic Japanese buildings. Its <a href="https://www.sankeien.or.jp/en_access/" target="_blank" rel="noopener noreferrer">official access page</a> describes a separate journey by train and bus or road. Compare that journey in both directions before buying admission; treat the garden as the main outing rather than adding it after every central waterfront stop.</p>

        <h3>Waterfront parks and views</h3>
        <p>For a lower-commitment plan, Yokohama&apos;s waterfront provides green space, harbor scenery, and direct skyline views without requiring a long trip away from the ship.</p>

        <h3>Yamashita Park</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1759231439836-2208ff08b853?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/large-ship-docked-with-flowers-in-foreground-_yYkYgcZ-4k?utm_source=portdayguide&utm_medium=referral"
          photographer="Yanhao Fang"
          photographerUrl="https://unsplash.com/@alamanga?utm_source=portdayguide&utm_medium=referral"
          alt="Flowers and the Hikawa Maru ocean liner viewed from Yamashita Park"
          place="Yamashita Park"
        />
        <p>Yamashita Park stretches along the waterfront near Osanbashi. Its lawns, paths, benches, and harbor views make it an easy stop before Chinatown or on the walk back toward the terminal.</p>

        <h3>Osanbashi Pier rooftop views</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1608391355752-9e13c87c8d71?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/black-and-white-striped-textile-Ps3lhJyGhIY?utm_source=portdayguide&utm_medium=referral"
          photographer="bady abbas"
          photographerUrl="https://unsplash.com/@bady?utm_source=portdayguide&utm_medium=referral"
          alt="Geometric wooden deck pattern at Yokohama International Passenger Terminal"
          place="Osanbashi Pier rooftop"
        />
        <p>The terminal&apos;s rooftop promenade is an attraction in its own right. Open-air lawns, seating, and panoramic views make it a strong choice for a short call, a final photo stop, or time left before boarding.</p>
      </section>

      <section aria-labelledby="dining-shopping">
        <h2 id="dining-shopping">Dining and Shopping Near the Terminal</h2>
        <p>The districts around Osanbashi offer casual local food, international restaurants, modern malls, and historic shopping spaces. Yokohama specialties include shumai dumplings, seafood, and ramen, while Chinatown provides a much wider range of Chinese regional cooking.</p>

        <h3>Restaurants near the terminal</h3>
        <p>Travelers can choose from local eateries, international restaurants, and waterfront cafes. For a short port call, select a meal near the day&apos;s main attraction and keep the final stop on the route back to the terminal.</p>
        <ul>
          <li>Shumai dumplings and other Yokohama specialties</li>
          <li>Fresh seafood and ramen</li>
          <li>International restaurants and waterfront cafes</li>
        </ul>

        <IntentViatorCards portSlug={guide.sourcePortSlug} topic={guide.topic} portName="Yokohama" heading={guide.viator.heading} />

        <h3>Yokohama Red Brick Warehouse</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1608391141847-c02a3b11b077?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/city-skyline-across-body-of-water-during-daytime-EugO2lOSPG0?utm_source=portdayguide&utm_medium=referral"
          photographer="bady abbas"
          photographerUrl="https://unsplash.com/@bady?utm_source=portdayguide&utm_medium=referral"
          alt="Yokohama waterfront and Red Brick Warehouse area across the water"
          place="Yokohama Red Brick Warehouse"
        />
        <p>The Yokohama Red Brick Warehouse combines preserved industrial architecture with boutiques, craft stores, restaurants, cafes, and seasonal events. It is a convenient waterfront stop between Osanbashi and Minato Mirai.</p>

        <h3>Minato Mirai</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1775700245879-d6c5e63ffe0a?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/vibrant-cityscape-with-illuminated-skyscrapers-at-night-DrCUfWF4DG4?utm_source=portdayguide&utm_medium=referral"
          photographer="Bobby Youstra"
          photographerUrl="https://unsplash.com/@insighted?utm_source=portdayguide&utm_medium=referral"
          alt="Minato Mirai skyline and waterfront illuminated at night"
          place="Minato Mirai"
        />
        <p>Minato Mirai is Yokohama&apos;s modern waterfront district, with fashion, entertainment, museums, dining, and skyline views. It can fill several hours, so prioritize one or two places instead of treating the whole district as a single quick stop.</p>
      </section>

      <section aria-labelledby="final-thoughts">
        <h2 id="final-thoughts">Choose one direction and keep the final stop flexible</h2>
        <p>Pair Yamashita Park with Chinatown when a waterfront stroll and a meal are the priorities. Choose the Red Brick Warehouse and Minato Mirai when shopping or a museum is the main reason to go ashore. Sankeien is a separate transport-based plan. You do not need to complete every attraction on this page to have a useful port day.</p>
        <p>Confirm the berth first, keep the final stop on the return route, and use the official all-aboard time rather than ship departure as the end of the day.</p>
      </section>
      <section className="intent-sources" aria-labelledby="yokohama-nearby-sources">
        <h2 id="yokohama-nearby-sources">Attraction sources and visit checks</h2>
        <p>Terminal setting, park location, museum booking conditions and garden access reviewed October 7, 2026. Recheck the calendar and your ship&apos;s instructions for the actual visit date.</p>
        <ul>{guide.sources.filter(source => !source.url.startsWith("/")).map(source => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a><span>{source.note}</span></li>)}</ul>
      </section>

      <section className="intent-editorial-faq" aria-labelledby="yokohama-faq">
        <span>Common questions</span>
        <h2 id="yokohama-faq">Yokohama Cruise Terminal FAQ</h2>
        <div>{guide.faqs?.map((item, index) => <details open={index === 0} key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>
    </div>

    <section className="intent-related-parent" aria-labelledby="related-yokohama-guide">
      <div><span>Related guide</span><h2 id="related-yokohama-guide">Continue planning Yokohama port day</h2></div>
      <Link href="/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal">
        <PortScenicPhoto slug="yokohama-tokyo" name="Yokohama (Tokyo)" country="Japan" />
        <div><span>Embarkation transport</span><h3>Tokyo to Yokohama Cruise Terminal: Train, Taxi &amp; Transfers</h3><p>Compare train connections, luggage needs, and hotel pickup for your exact Yokohama cruise terminal.</p><b>Read the Tokyo to Yokohama transfer guide →</b></div>
      </Link>
      <Link href={hub}>
        <PortScenicPhoto slug="yokohama-tokyo" name="Yokohama (Tokyo)" country="Japan" />
        <div><span>Complete port guide</span><h3>Yokohama (Tokyo) Cruise Port Guide</h3><p>Compare Osanbashi, Shinko, and Daikoku, then plan transport, excursions, timing, and a protected return to the ship.</p><b>Open the Yokohama port guide →</b></div>
      </Link>
    </section>
  </>;
}
