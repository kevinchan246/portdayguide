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

function AttractionPhoto({ imageUrl, photoUrl, photographer, photographerUrl, alt, place }: AttractionPhotoProps) {
  return <figure className="intent-attraction-photo" data-photo-source="Unsplash">
    {/* Unsplash-hosted editorial photography, with the photographer and source credited directly below. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={imageUrl} alt={alt} width="1600" height="1000" loading="lazy" decoding="async" />
    <figcaption>
      <a href={photoUrl} target="_blank" rel="noopener noreferrer">{place}</a>. Photo by{" "}
      <a href={photographerUrl} target="_blank" rel="noopener noreferrer">{photographer}</a>{" "}
      on Unsplash.
    </figcaption>
  </figure>;
}

export function YokohamaTerminalArticle({ guide, hub }: { guide: PortIntentGuide; hub: string }) {
  return <>
    <div className="intent-editorial-copy">
      <p>The Yokohama Cruise Terminal—also known as the Yokohama International Passenger Terminal at Osanbashi Pier—is a gateway to adventure. It is a bustling hub for travelers eager to explore Japan through Yokohama cruise port.</p>
      <p>Nestled in the heart of Yokohama, this terminal is more than a port: it is a starting point for discovering the city&apos;s hidden gems. From cultural landmarks to vibrant shopping districts, Yokohama offers a rich range of experiences within a practical cruise-day area.</p>
      <aside className="intent-editorial-note"><strong>Confirm your terminal first.</strong><p>This guide is centered on Osanbashi Pier. Yokohama calls can also use Shinko or Daikoku, whose first-mile transport is different. Use the exact terminal in your cruise documents before following a walking or pickup plan.</p></aside>

      <section aria-labelledby="terminal-overview">
        <h2 id="terminal-overview">Overview of Yokohama Cruise Terminal</h2>
        <p>The Yokohama Cruise Terminal, also known as Osanbashi Pier and the Osanbashi Yokohama International Passenger Terminal, is an impressive modern landmark and a significant entry point for international cruises. Its distinctive architectural design stands out on Yokohama&apos;s waterfront.</p>
        <p>Located in the heart of the city, the terminal offers panoramic views of Yokohama&apos;s skyline. It combines modern passenger facilities, access to public transport, and a rooftop garden that is open to the public.</p>
        <ul>
          <li>Modern facilities for cruise passengers</li>
          <li>Access to public transport and central Yokohama</li>
          <li>A public rooftop garden with harbor and skyline views</li>
        </ul>
        <p>The terminal is not only for boarding ships. Its rooftop serves as a public park with green space and seating, making it a useful place to relax before or after exploring the city.</p>
      </section>

      <section aria-labelledby="terminal-importance">
        <h2 id="terminal-importance">Why the Terminal Matters to Japan&apos;s Cruise Industry</h2>
        <p>Yokohama Cruise Terminal holds an important position in Japan&apos;s cruise network. Its proximity to Tokyo makes it a convenient starting or ending point for international itineraries, while its central Yokohama location also supports independent city exploration.</p>
        <ul>
          <li>Regional access from Tokyo and beyond</li>
          <li>Purpose-built facilities for international cruise travelers</li>
          <li>A major passenger gateway for Yokohama and the wider Tokyo area</li>
        </ul>
        <p>Cruise calls also bring travelers directly into Yokohama&apos;s restaurants, shops, museums, and waterfront attractions, connecting the port with the city&apos;s visitor economy.</p>
      </section>

      <section aria-labelledby="getting-to-terminal">
        <h2 id="getting-to-terminal">Getting to Yokohama Cruise Terminal</h2>
        <p>Reaching Osanbashi is generally straightforward because central Yokohama is connected with Tokyo and the wider region by frequent rail services. Your best option depends on luggage, group size, budget, and the exact terminal named by the cruise line.</p>

        <h3>Transportation options</h3>
        <p>Travelers can choose among trains, buses, taxis, and private transfers. Trains are usually the fastest economical choice between Tokyo and Yokohama. Taxis and private transfers offer a direct journey, which can be useful with several bags or a larger group.</p>
        <ul>
          <li><strong>Train:</strong> Frequent and economical for travelers who can manage their luggage</li>
          <li><strong>Bus:</strong> Useful on selected routes, though traffic can make timing less predictable</li>
          <li><strong>Taxi:</strong> Direct and convenient for the final leg in Yokohama</li>
          <li><strong>Private transfer:</strong> The lowest-friction option for groups, luggage, or a prearranged pickup</li>
        </ul>

        <h3>From Tokyo to Yokohama cruise port</h3>
        <p>Most visitors use rail service from Tokyo to Yokohama. Common choices include the JR Tokaido Line and the Keihin-Tohoku Line. The best station and final connection depend on where the Tokyo journey begins and whether the ship is at Osanbashi, Shinko, or Daikoku.</p>
        <p>A taxi or private car provides a door-to-door alternative. Before booking, confirm the terminal name, pickup procedure, waiting policy, luggage allowance, and what happens if a flight or train is delayed.</p>

        <h3>Local transport in Yokohama</h3>
        <p>The Yokohama Municipal Subway and local bus network cover central districts and places beyond the easiest walking radius. A compatible IC card simplifies fare payment across much of the local rail and bus system.</p>
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
        <p>The Cup Noodles Museum presents the history and design of instant noodles through interactive exhibits. Its custom cup-noodle activity is popular with families, but timed activities and opening details should be checked before the visit.</p>

        <h3>Sankeien Garden</h3>
        <AttractionPhoto
          imageUrl="https://images.unsplash.com/photo-1682787272912-ea48b2833358?auto=format&fit=crop&w=1600&q=82"
          photoUrl="https://unsplash.com/photos/a-path-leading-to-a-pavilion-in-a-park-daEJYP5I58M?utm_source=portdayguide&utm_medium=referral"
          photographer="Mmoka"
          photographerUrl="https://unsplash.com/@pedarun?utm_source=portdayguide&utm_medium=referral"
          alt="A garden path leading to a traditional pavilion in Sankeien Garden"
          place="Sankeien Garden"
        />
        <p>Sankeien Garden pairs landscaped grounds with historic Japanese buildings. It is farther from Osanbashi than the central waterfront sights, so it works best as a main outing rather than a quick add-on.</p>

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
        <h2 id="final-thoughts">Final Thoughts</h2>
        <p>Yokohama Cruise Terminal is a gateway to a city rich in culture and waterfront experiences. A well-paced day can combine Osanbashi views with Yamashita Park and Chinatown, or head toward the Red Brick Warehouse and Minato Mirai. Sankeien Garden is better treated as a separate main outing.</p>
        <p>Confirm the berth first, keep the final stop on the return route, and use the official all-aboard time rather than ship departure as the end of the day.</p>
      </section>

      <section className="intent-editorial-faq" aria-labelledby="yokohama-faq">
        <span>Common questions</span>
        <h2 id="yokohama-faq">Yokohama Cruise Terminal FAQ</h2>
        <div>{guide.faqs?.map((item, index) => <details open={index === 0} key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>
    </div>

    <section className="intent-related-parent" aria-labelledby="related-yokohama-guide">
      <div><span>Related guide</span><h2 id="related-yokohama-guide">Continue planning Yokohama port day</h2></div>
      <Link href={hub}>
        <PortScenicPhoto slug="yokohama-tokyo" name="Yokohama (Tokyo)" country="Japan" />
        <div><span>Complete port guide</span><h3>Yokohama (Tokyo) Cruise Port Guide</h3><p>Compare Osanbashi, Shinko, and Daikoku, then plan transport, excursions, timing, and a protected return to the ship.</p><b>Open the Yokohama port guide →</b></div>
      </Link>
    </section>
  </>;
}
