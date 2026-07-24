export type PortIntentGuide = {
  sourcePortSlug: string;
  urlPortSlug: string;
  topic: string;
  eyebrow: string;
  title: string;
  seoTitle: string;
  description: string;
  lede: string;
  quickAnswer: string;
  reviewed: string;
  facts: Array<{ label: string; value: string }>;
  fit: {
    bestFor: string;
    minimumWindow: string;
    diyLevel: string;
    mobility: string;
    weather: string;
    mainRisk: string;
  };
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }>;
  comparison?: {
    heading: string;
    columns: string[];
    rows: string[][];
  };
  steps: Array<{ title: string; text: string }>;
  decision: string;
  viator: {
    heading: string;
    copy: string;
    query: string;
    campaign: string;
  };
  sources: Array<{ label: string; url: string; note: string }>;
};

export const portIntentGuides: PortIntentGuide[] = [
  {
    sourcePortSlug: "costa-maya",
    urlPortSlug: "costa-maya",
    topic: "to-mahahual",
    eyebrow: "Costa Maya transport decision",
    title: "Costa Maya Port to Mahahual: Taxi, Walking & Return Plan",
    seoTitle: "Costa Maya Port to Mahahual: Taxi, Time & Return Guide",
    description: "How to get from Costa Maya cruise port to Mahahual by taxi, what the ride usually costs, why walking is rarely the best cruise-day choice, and when to return.",
    lede: "Mahahual is the nearby beach town most cruise visitors mean when they say they want to leave the Costa Maya port complex. The distance is short, but the long pier, port exit, heat, taxi pickup, and return queue all belong in the plan.",
    quickAnswer: "Take a taxi from the signed transport area near the port exit. Recent visitor guides describe a 5–10 minute ride and a fare around US$4–5 per person, but the posted fare on your visit controls. Walking can take roughly 30–45 minutes after you reach the port exit, so it usually spends too much of a short call in heat and traffic exposure.",
    reviewed: "July 2026",
    facts: [
      { label: "Typical road time", value: "5–10 min after the port exit" },
      { label: "Planning fare", value: "About US$4–5 pp; confirm current board" },
      { label: "Walking estimate", value: "Roughly 30–45 min from the exit" },
      { label: "Return target", value: "Back inside port 90+ min before all-aboard" },
    ],
    fit: {
      bestFor: "A relaxed beach, lunch, or malecón day without a long inland excursion",
      minimumWindow: "4 hours ashore; 5–6 hours feels less rushed",
      diyLevel: "Easy once the correct taxi area and return point are understood",
      mobility: "The cruise pier can be long; Mahahual adds sand and uneven edges",
      weather: "Rain and sargassum can change the value of a beach-first plan",
      mainRisk: "Leaving the beach too late and meeting a taxi queue or port-entry walk",
    },
    sections: [
      {
        heading: "Where the trip actually starts",
        paragraphs: [
          "The ship does not place you on the road beside Mahahual. First comes the pier, then the Costa Maya visitor complex, and finally the signed exit and transport area. That first-mile sequence matters for anyone with limited walking tolerance or a fixed beach-club check-in.",
          "Use the cruise line's all-aboard time—not departure time—as the hard deadline. Photograph the port entrance or save a map pin before leaving so the return driver receives the exact destination rather than only “Costa Maya.”",
        ],
        bullets: [
          "Follow current signs to authorized ground transportation.",
          "Ask whether the quoted fare is per person or per vehicle and in USD or MXN.",
          "Agree on the fare before entering and keep small bills.",
          "Choose a Mahahual return landmark that a taxi can actually reach; the beachfront malecón itself has pedestrian-only sections.",
        ],
      },
      {
        heading: "Taxi or walk: the cruise-day tradeoff",
        paragraphs: [
          "The walk is possible for some travelers, but “walkable” is not the same as useful on a port call. The estimate begins after the port exit and does not erase the long ship-to-terminal walk. Midday heat, limited shade, traffic, and the same walk back can turn a nominally free option into the largest time cost of the day.",
          "A taxi makes the most sense for a focused Mahahual day. A prearranged beach transfer makes more sense when the price includes a reserved chair, clear meeting instructions, and round-trip timing that you have verified. A golf cart adds flexibility but also navigation, parking, rental, and return responsibilities; it is not necessary for a simple beach-and-lunch plan.",
        ],
      },
      {
        heading: "How much return buffer to keep",
        paragraphs: [
          "For an independent Mahahual visit, aim to be back at the port entrance at least 90 minutes before official all-aboard. Leave the beach earlier when several ships are in port, rain is developing, someone walks slowly, or the taxi supply looks thin.",
          "Do not use the 5–10 minute road estimate as the total return time. Add time to request or find a taxi, travel, pass port controls, cross the visitor complex, and walk the pier. The buffer is deliberately conservative because a cheap taxi ride is not worth a missed-ship risk.",
        ],
      },
    ],
    comparison: {
      heading: "Best way to reach Mahahual",
      columns: ["Option", "Best for", "Real cost", "Cruise-day limitation"],
      rows: [
        ["Taxi", "Independent beach and lunch", "Current posted fare each way", "Return is your responsibility"],
        ["Beach transfer", "Reserved amenities and simpler pickup", "Higher bundled price", "Read the exact meeting point and return schedule"],
        ["Walk", "Fit adults with ample time and mild weather", "No fare", "Long pier plus 30–45 min each way from the exit"],
      ],
    },
    steps: [
      { title: "Confirm all-aboard", text: "Write down the ship's local all-aboard time and set a return alarm before leaving Wi-Fi." },
      { title: "Reach the signed taxi area", text: "Allow for the pier and port complex; do not arrange a pickup at a vague “cruise port” pin." },
      { title: "Agree on fare and drop-off", text: "Confirm per-person versus per-vehicle pricing, currency, and the Mahahual landmark." },
      { title: "Choose one beach zone", text: "Keep lunch, swimming, and the malecón in one compact area instead of adding a distant second route." },
      { title: "Start back early", text: "Target the port entrance 90 minutes or more before official all-aboard." },
    ],
    decision: "Choose Mahahual when you want a less enclosed, more local-feeling beach day and accept a short independent taxi ride. Stay in the port complex when minimizing walking uncertainty and transport decisions matters more than local atmosphere.",
    viator: {
      heading: "Mahahual beach options with port transport",
      copy: "These live results are limited to Mahahual or Costa Maya beach experiences that may reduce the transport planning burden. Verify the exact terminal meeting point and return schedule before booking.",
      query: "Mahahual beach Costa Maya cruise port transportation",
      campaign: "pdg-costa-maya-to-mahahual",
    },
    sources: [
      { label: "Cruzely Costa Maya port guide", url: "https://www.cruzely.com/port-guide-costa-maya-mahahual-mexico/", note: "Recent observed taxi time, fare, walking estimate, and port-crowding context." },
      { label: "Costa Maya Tourbase transport guide", url: "https://costamayatourbase.com/travel-tips/costa-maya-transportation-and-navigation-advice", note: "Independent cross-check for the short road transfer and walking estimate." },
      { label: "PortdayGuide Costa Maya hub", url: "/ports/costa-maya", note: "Terminal, return-margin, weather, mobility, and excursion context." },
    ],
  },
  {
    sourcePortSlug: "costa-maya",
    urlPortSlug: "costa-maya",
    topic: "port-vs-mahahual",
    eyebrow: "Costa Maya stay-or-go decision",
    title: "Costa Maya Port vs Mahahual: Which Is Better for a Cruise Day?",
    seoTitle: "Costa Maya Port vs Mahahual: Cruise-Day Comparison",
    description: "Compare the Costa Maya cruise port complex with Mahahual beach town by atmosphere, cost, transport, mobility, food, beach access, and missed-ship risk.",
    lede: "Costa Maya port and Mahahual are close on a map but deliver two different days. One is a controlled cruise complex beside the ship; the other is a small beachfront town reached by a short taxi ride.",
    quickAnswer: "Choose the port complex for the simplest, lowest-transport-risk day with pools, shops, food, and shade in one managed area. Choose Mahahual for a more local beachfront atmosphere, a longer malecón, and more choice among independent restaurants and beach setups. The tradeoff is a taxi each way and more responsibility for the return.",
    reviewed: "July 2026",
    facts: [
      { label: "Port complex", value: "Simplest logistics; busiest near ship arrivals" },
      { label: "Mahahual", value: "Short taxi ride; more local beach-town feel" },
      { label: "Best short call", value: "Port complex" },
      { label: "Best 5–7 hour call", value: "Mahahual if weather and mobility fit" },
    ],
    fit: {
      bestFor: "Travelers deciding whether leaving the port adds enough value",
      minimumWindow: "Port: 2–3 hours; Mahahual: 4+ hours ashore",
      diyLevel: "Port is very easy; Mahahual is easy with a taxi and return alarm",
      mobility: "Port has a long pier; Mahahual adds sand and uneven beachfront surfaces",
      weather: "Port offers more immediate shelter; Mahahual is more weather-dependent",
      mainRisk: "Treating nearby Mahahual as if no transport or return buffer is needed",
    },
    sections: [
      {
        heading: "What staying inside Costa Maya port is really like",
        paragraphs: [
          "The port complex is designed to keep the day self-contained. Shops, restaurants, bars, pools, photo stops, and excursion dispatch sit beyond the pier. You avoid a road transfer and can start the return walk whenever conditions change.",
          "That convenience is also the compromise. On multi-ship days the complex can feel crowded and highly curated. Prices and atmosphere reflect a captive cruise market, and the pool or lounger you imagined may not be as calm as it looked before several ships unloaded.",
        ],
        bullets: ["Best for a short call or uncertain weather", "Lowest transport complexity", "Easy to abandon the plan and return to the ship", "Less useful if your priority is a local town or long public beach walk"],
      },
      {
        heading: "What changes when you go to Mahahual",
        paragraphs: [
          "Mahahual spreads activity along the waterfront rather than containing it in one cruise village. You can choose a restaurant, beach setup, massage, or simple walk on the malecón, and spending reaches more businesses outside the terminal complex.",
          "The beach is public, but chairs, restrooms, shade, and service are often tied to a restaurant or beach-club purchase. Ask what a minimum spend or day pass includes before sitting down. Seaweed, rocky sections, crowds, and vendor activity vary by location and day, so inspect the exact stretch before committing.",
        ],
      },
      {
        heading: "The decision by traveler type",
        paragraphs: [
          "Families who need predictable restrooms, mixed-mobility groups, and anyone with a short or delayed call may value the port more. Travelers who want a local lunch, a less enclosed setting, and several hours by the water are more likely to prefer Mahahual.",
          "Neither option requires filling the day with a second inland attraction. Chacchoben and Bacalar are separate geographic decisions with much more road time. If Mahahual is the choice, let it be the main direction and return before the buffer becomes uncomfortable.",
        ],
      },
    ],
    comparison: {
      heading: "Costa Maya port and Mahahual side by side",
      columns: ["Decision", "Costa Maya port", "Mahahual"],
      rows: [
        ["Atmosphere", "Curated cruise complex", "Small beach town and malecón"],
        ["Transport", "No road transfer", "Taxi each way"],
        ["Swimming setup", "Pool and managed amenities", "Beachfront restaurants and clubs"],
        ["Food", "Convenient port venues", "Broader independent local choice"],
        ["Weather fallback", "More immediate shelter", "Depends on the chosen venue"],
        ["Return risk", "Lowest", "Low when you leave early; still independent"],
      ],
    },
    steps: [
      { title: "Check the usable window", text: "Subtract ship clearance time, the pier, and a 90-minute minimum port-entry target from the call." },
      { title: "Check conditions", text: "Rain, wind, heat, sargassum, and the number of ships can change which option feels better." },
      { title: "Choose one environment", text: "Do not pay for a Mahahual setup and then rush back to duplicate the same activities in port." },
      { title: "Price the full choice", text: "For Mahahual, include round-trip taxi plus any minimum spend or day-pass charge." },
      { title: "Protect the return", text: "Set a leave-the-beach alarm, not only an all-aboard alarm." },
    ],
    decision: "For most first-time visitors with at least five comfortable hours ashore, Mahahual offers the more distinctive day. For short calls, uncertain mobility, poor weather, or travelers who want zero ground-transport decisions, the port complex is the better fit.",
    viator: {
      heading: "Bookable Mahahual alternatives",
      copy: "Use these results to compare the cost of a bundled beach experience with a DIY taxi day. Only book after confirming what is included and how the return is handled.",
      query: "Mahahual beach day Costa Maya shore excursion",
      campaign: "pdg-costa-maya-port-vs-mahahual",
    },
    sources: [
      { label: "Cruzely Costa Maya port guide", url: "https://www.cruzely.com/port-guide-costa-maya-mahahual-mexico/", note: "Observed layout, taxi, beach-access, and multi-ship crowd context." },
      { label: "Costa Maya Tourbase transport guide", url: "https://costamayatourbase.com/travel-tips/costa-maya-transportation-and-navigation-advice", note: "Transport comparison and independent-access context." },
      { label: "PortdayGuide Costa Maya hub", url: "/ports/costa-maya", note: "Return timing, weather fallback, and longer-excursion comparison." },
    ],
  },
  {
    sourcePortSlug: "roatan",
    urlPortSlug: "roatan",
    topic: "mahogany-bay-vs-coxen-hole",
    eyebrow: "Roatán terminal decision",
    title: "Mahogany Bay vs Coxen Hole: Roatán Cruise Ports Compared",
    seoTitle: "Mahogany Bay vs Coxen Hole: Roatán Port Guide",
    description: "Compare Roatán's Mahogany Bay and Coxen Hole cruise terminals by location, beach access, pickup rules, nearby atmosphere, and travel time to West Bay.",
    lede: "Roatán has two main cruise terminals, and they are not interchangeable pickup points. Mahogany Bay is a resort-style Carnival-family complex on the south shore; the Port of Roatán sits in Coxen Hole, the island's capital and working town.",
    quickAnswer: "Mahogany Bay is the easier stay-near-ship choice because its landscaped complex includes a cruise-passenger beach reached by a walking route or chairlift. Coxen Hole is better connected to local town life and independent operators. For West Bay, wildlife, or an island tour, either terminal still requires the correct pickup instructions and a substantial road-time buffer.",
    reviewed: "July 2026",
    facts: [
      { label: "Mahogany Bay", value: "South-shore cruise complex with port beach" },
      { label: "Coxen Hole", value: "Capital-town terminal with local street access" },
      { label: "West Bay planning", value: "About 20 min from Coxen; 30 min from Mahogany in light traffic" },
      { label: "Return buffer", value: "PortdayGuide protects 120 min ship-side" },
    ],
    fit: {
      bestFor: "Anyone whose tour instructions mention a Roatán port without naming the terminal",
      minimumWindow: "4+ hours for an off-port activity; longer for a two-stop route",
      diyLevel: "Moderate because terminal exits and outside-gate pickups differ",
      mobility: "Hills, gangways, terminal paths, vehicles, sand, and docks vary",
      weather: "A near-port day is easier to simplify when rain slows island roads",
      mainRisk: "Waiting at the wrong terminal or underestimating traffic on the return",
    },
    sections: [
      {
        heading: "Mahogany Bay: easiest when the port is the destination",
        paragraphs: [
          "Mahogany Bay was built as a contained cruise environment with landscaping, shops, food, bars, excursion areas, and a private beach for cruise passengers. The Roatán Tourism Bureau describes access to the beach by walking trail or chairlift. This makes it the clear low-transfer option for travelers who want sun and water without crossing the island.",
          "Independent operator pickup may be outside the controlled port gate rather than beside the ship. Read the operator's directions literally, allow for the walk, and do not assume a sign saying “Mahogany Bay” means the same meeting area used by cruise-line excursions.",
        ],
      },
      {
        heading: "Coxen Hole: closer to town and independent operators",
        paragraphs: [
          "The Port of Roatán opens into Coxen Hole, the island's capital. Local shops, eateries, taxis, and tour dispatch are closer to daily island activity than at Mahogany Bay. The Tourism Bureau also identifies direct transport links toward West End, West Bay, Sandy Bay, and other island zones.",
          "Coxen Hole is not automatically a beach day. West Bay and the reef still need road transport, and the terminal area does not replace a confirmed beach-club or boat meeting point. Use the exact terminal name in every message with a driver or operator.",
        ],
      },
      {
        heading: "Do not choose a terminal—the cruise line does",
        paragraphs: [
          "Travelers often search which port is “better,” but the practical task is learning which one their ship uses. Carnival Corporation brands commonly use Mahogany Bay, while Royal Caribbean, Norwegian, MSC, and others commonly use Coxen Hole; assignments and operational changes still happen, so the itinerary and operator confirmation control.",
          "Some 2026 materials may also use the name Isla Tropicale for the Mahogany Bay development. Treat that as a naming update, not a third Roatán terminal. If the cruise document, tour voucher, and map pin disagree, ask the operator to restate the pickup using the ship name and terminal gate.",
        ],
      },
    ],
    comparison: {
      heading: "Roatán terminal comparison",
      columns: ["Decision", "Mahogany Bay", "Coxen Hole"],
      rows: [
        ["Setting", "Landscaped cruise complex", "Working capital-town waterfront"],
        ["Near-port beach", "Cruise-passenger beach in the complex", "No equivalent terminal beach"],
        ["Independent pickup", "Often involves the terminal exit or outside gate", "More direct access to taxis and independent operators"],
        ["Best no-tour day", "Beach, pool-style amenities, food, shopping", "Local town browse and driver-led island route"],
        ["West Bay", "Plan about 30 min in light traffic", "Plan about 20 min in light traffic"],
      ],
    },
    steps: [
      { title: "Read the cruise itinerary", text: "Find Mahogany Bay, Isla Tropicale, or Port of Roatán/Coxen Hole in the official call details." },
      { title: "Send the ship name", text: "Ask an independent operator to confirm the terminal and meeting point in writing." },
      { title: "Map the gate, not only the island", text: "Terminal-controlled pickup and outside-gate pickup are different instructions." },
      { title: "Choose one island zone", text: "West Bay, West End, wildlife, and east-island stops should not all be stacked into a short call." },
      { title: "Keep the largest return margin", text: "Roatán's narrow roads justify an earlier return than the map distance suggests." },
    ],
    decision: "If the ship uses Mahogany Bay and your goal is a simple beach day, staying near the terminal is genuinely competitive. If the goal is West Bay, wildlife, reef, or local island life, compare excursions by exact terminal pickup rather than by headline price.",
    viator: {
      heading: "Roatán tours with terminal pickup",
      copy: "These results emphasize port pickup and island routes. Confirm whether the listing names Mahogany Bay/Isla Tropicale, Coxen Hole, or both before booking.",
      query: "Roatan private island tour cruise port pickup Mahogany Bay Coxen Hole",
      campaign: "pdg-roatan-terminal-comparison",
    },
    sources: [
      { label: "Roatán Tourism Bureau terminal guide", url: "https://roatantourismbureau.com/community-updates/cruise-ports-roatan-coxen-hole-mahogany-bay", note: "Terminal locations, cruise-line patterns, amenities, and transport context." },
      { label: "Roatán Tourism Bureau", url: "https://roatantourismbureau.com/", note: "Local destination and cruise schedule context." },
      { label: "PortdayGuide Roatán hub", url: "/ports/roatan", note: "Return buffer, mobility, weather, and activity planning." },
    ],
  },
  {
    sourcePortSlug: "roatan",
    urlPortSlug: "roatan",
    topic: "west-bay-beach-from-cruise-port",
    eyebrow: "Roatán beach transport decision",
    title: "West Bay Beach From Roatán Cruise Port: Transport & Timing",
    seoTitle: "West Bay Beach From Roatán Cruise Port: 2026 Guide",
    description: "Plan West Bay Beach from Mahogany Bay or Coxen Hole with realistic drive times, taxi versus transfer choices, beach access, and a conservative ship-return plan.",
    lede: "West Bay is Roatán's headline beach and reef zone, but it is not the beach attached to Mahogany Bay. Reaching it means a road transfer from either cruise terminal and a deliberate return plan.",
    quickAnswer: "Plan roughly 20 minutes from Coxen Hole or 30 minutes from Mahogany Bay in light traffic, then add pickup and congestion time. For a cruise day, a round-trip transfer or port-aware driver is usually stronger than relying on two unrelated taxi rides. Leave West Bay early enough to be ship-side about two hours before official all-aboard when roads are busy or weather is changing.",
    reviewed: "July 2026",
    facts: [
      { label: "From Coxen Hole", value: "About 20 min in light traffic" },
      { label: "From Mahogany Bay", value: "About 30 min in light traffic" },
      { label: "Comfortable beach block", value: "3–4 hours plus transfers" },
      { label: "Return rule", value: "Protect the full Roatán 120-min margin" },
    ],
    fit: {
      bestFor: "Travelers prioritizing beach quality, reef access, and a resort day pass",
      minimumWindow: "5 hours ashore; 6–8 hours gives a real beach block",
      diyLevel: "Moderate; strongest with a confirmed round-trip driver",
      mobility: "Sand, resort access, boat entries, and vehicle steps vary",
      weather: "Rain can slow roads; wind and sea state affect snorkeling",
      mainRisk: "Assuming map time equals dependable return time on island roads",
    },
    sections: [
      {
        heading: "West Bay, Tabyana, and West End are not the same stop",
        paragraphs: [
          "West Bay is the beach zone at the island's western end. Tabyana is a marketed section of West Bay used by some excursion and cruise-line products. West End is a separate village and boat-diving hub farther along the coast. Product titles sometimes combine the names, so read the actual drop-off, included chair or resort, and transport details.",
          "A water taxi can connect West End and West Bay, but it does not replace the road transfer from Mahogany Bay or Coxen Hole. Adding West End is only sensible when the operator builds it into the route and the return time remains protected.",
        ],
      },
      {
        heading: "Taxi, driver, or resort transfer",
        paragraphs: [
          "A taxi can work, especially from Coxen Hole, but agree on price, passenger count, waiting, and the return arrangement before leaving. A dedicated driver offers more control for a family or mixed-mobility group. A resort transfer or excursion costs more but may bundle the chair, facilities, and a scheduled return.",
          "The words “round trip” are not enough. Verify the exact terminal gate, the West Bay venue, who to contact, the last return, and whether the vehicle waits or returns later. Port pickup claims must name your terminal, because Mahogany Bay and Coxen Hole have different gates and operator procedures.",
        ],
        bullets: ["Save the driver's WhatsApp contact offline", "Screenshot the terminal pickup instructions", "Confirm whether the beach chair, restroom, shower, snorkel gear, or entrance is included", "Carry a dry bag and a change of clothes if snorkeling"],
      },
      {
        heading: "Build the day around the return road",
        paragraphs: [
          "The outward ride often feels easy because everyone is leaving the port. The return can concentrate beach departures, island traffic, and weather at the same time. Treat the quoted drive time as a best-case movement estimate, not the full buffer.",
          "PortdayGuide uses a 120-minute ship-side margin for Roatán. A conservative plan leaves West Bay earlier than that margin so there is time for road travel, the terminal gate, and the walk to the ship. Do not add a sanctuary, zipline, and island loop unless one operator controls the complete route and the ship window clearly supports it.",
        ],
      },
    ],
    comparison: {
      heading: "West Bay transport choices",
      columns: ["Option", "Best for", "What to confirm", "Main drawback"],
      rows: [
        ["Taxi", "Flexible independent day", "Fare, return pickup, terminal", "You manage both timing and availability"],
        ["Private driver", "Families and custom timing", "Waiting time, contact, vehicle", "Higher total cost"],
        ["Resort transfer", "Chairs and facilities bundled", "Exact inclusions and return", "Less flexible schedule"],
        ["Combo excursion", "Wildlife plus beach", "Stop order and beach time", "Beach block can become very short"],
      ],
    },
    steps: [
      { title: "Confirm the terminal", text: "Mahogany Bay/Isla Tropicale and Coxen Hole require different pickup instructions." },
      { title: "Choose a specific West Bay venue", text: "Know whether the product uses Tabyana, a resort, or another beach access point." },
      { title: "Book the return before leaving", text: "A known driver or scheduled transfer is stronger than searching for a ride at the last minute." },
      { title: "Keep the beach day focused", text: "Add only one nearby activity when the route and return still fit." },
      { title: "Depart before the crowd", text: "Use an alarm and begin the road return before the protected ship-side margin starts." },
    ],
    decision: "West Bay is worth the transfer when beach quality and reef access are the main reason for going ashore. Mahogany Bay's own beach is the better choice when a traveler wants the lowest-effort day or when the usable call is too short for a relaxed West Bay block.",
    viator: {
      heading: "West Bay transfers and beach breaks",
      copy: "Compare only products that state a Roatán cruise-port pickup and identify the beach or resort. The live price should be weighed against round-trip transport and included facilities.",
      query: "West Bay Beach Roatan cruise port pickup resort pass",
      campaign: "pdg-roatan-west-bay-from-port",
    },
    sources: [
      { label: "Discover Roatán West Bay guide", url: "https://discoverroatan.net/west-bay-beach-excursion/", note: "Beach-zone identity, light-traffic estimates from both terminals, and day-pass context." },
      { label: "Roatán Tourism Bureau terminal guide", url: "https://roatantourismbureau.com/community-updates/cruise-ports-roatan-coxen-hole-mahogany-bay", note: "Terminal differences and transport availability." },
      { label: "PortdayGuide Roatán hub", url: "/ports/roatan", note: "Full port-return and weather framework." },
    ],
  },
  {
    sourcePortSlug: "cozumel",
    urlPortSlug: "cozumel",
    topic: "which-cruise-terminal",
    eyebrow: "Cozumel terminal decision",
    title: "Which Cozumel Cruise Terminal? Punta Langosta, International & Puerta Maya",
    seoTitle: "Which Cozumel Cruise Terminal? Pier Comparison Guide",
    description: "Identify your Cozumel cruise terminal and compare Punta Langosta, International Pier, and Puerta Maya by access, taxis, pickups, and beach routes.",
    lede: "Cozumel has three main cruise piers. A plan that works from downtown Punta Langosta can fail when copied to International Pier or Puerta Maya several miles south.",
    quickAnswer: "Punta Langosta is the downtown pier and is roughly a five-minute walk from San Miguel's main square. International Pier (SSA) and Puerta Maya are south of downtown and normally need a short taxi for San Miguel. All three have taxi access, but tour pickup instructions and fares begin from the exact pier, so confirm the terminal in the cruise app before booking.",
    reviewed: "July 2026",
    facts: [
      { label: "Punta Langosta", value: "Downtown; easiest for San Miguel on foot" },
      { label: "International Pier", value: "South hotel zone; taxi-first for downtown" },
      { label: "Puerta Maya", value: "Southern cruise complex with its own amenities" },
      { label: "Assignment rule", value: "Cruise itinerary and same-day operations control" },
    ],
    fit: {
      bestFor: "Every independent tour, taxi plan, ferry idea, and downtown walking route",
      minimumWindow: "Terminal check takes minutes and should happen before booking",
      diyLevel: "Easy after the correct pier and gate are saved",
      mobility: "Pier length and terminal plazas add walking before outside transport",
      weather: "A wrong pickup is harder to fix in rain or peak ship traffic",
      mainRisk: "Using a generic Cozumel port pin or meeting at the wrong pier",
    },
    sections: [
      {
        heading: "Punta Langosta: the downtown arrival",
        paragraphs: [
          "Punta Langosta sits beside San Miguel. After the pier and terminal crossing, the main square, waterfront, shops, restaurants, and many downtown meeting points are reachable on foot. This is the only one of the three main cruise piers where “walk into town” is a dependable starting assumption for many travelers.",
          "Downtown access does not make every excursion walkable. Beach clubs, Chankanaab, Punta Sur, San Gervasio, and the east side still require transport. The ferry to Playa del Carmen also uses a separate passenger-ferry pier; a mainland trip adds ferry schedules and sea conditions to the ship-return risk.",
        ],
      },
      {
        heading: "International Pier and Puerta Maya: south of town",
        paragraphs: [
          "International Pier, often labeled SSA, and Puerta Maya sit in the southern cruise corridor. Local Cozumel guidance places both about a short taxi ride from the main square. They are near each other but are still separate terminals with different gates and meeting landmarks.",
          "Puerta Maya is a large cruise complex with shops, dining, and current port schedules on its official site. International Pier has its own shopping and taxi area. For independent excursions, “meet outside the port” may mean crossing the full terminal area and gate before seeing the operator's sign.",
        ],
      },
      {
        heading: "How to confirm the terminal without guessing by cruise line",
        paragraphs: [
          "Cruise lines have common pier patterns, but operational assignments can change. Do not build a taxi budget or meeting plan from an old list of which brand “always” uses which pier. The official cruise itinerary, ship app, daily announcement, and operator confirmation are stronger evidence.",
          "Save the terminal name as text and a map screenshot. When messaging a tour operator, include the ship name, call date, and terminal. Ask whether pickup is inside the terminal, at a named business, or outside the port gate. Those details matter more than a promise of “port pickup.”",
        ],
        bullets: ["Look for Punta Langosta, Muelle Internacional/SSA, or Puerta Maya", "Match the voucher's landmark to the same terminal", "Photograph the pier name before entering a taxi", "Use the terminal—not only “Cozumel”—for the return destination"],
      },
    ],
    comparison: {
      heading: "Cozumel cruise terminals at a glance",
      columns: ["Terminal", "Downtown access", "Best independent fit", "Common planning mistake"],
      rows: [
        ["Punta Langosta", "About 5 min walk to the main square", "San Miguel, food, museum, waterfront", "Assuming southern beaches are walkable"],
        ["International Pier (SSA)", "Short taxi south of downtown", "Taxis, tours, southern attractions", "Confusing its gate with Puerta Maya"],
        ["Puerta Maya", "Short taxi south of downtown", "Port amenities, taxis, beach-club route", "Using a downtown meeting point without transfer time"],
      ],
    },
    steps: [
      { title: "Check the official itinerary", text: "Record the named Cozumel pier before paying for a pickup or making a walking plan." },
      { title: "Cross-check the voucher", text: "The terminal name and meeting landmark should describe the same place." },
      { title: "Save an offline pin", text: "Keep the terminal name and gate available without cellular service." },
      { title: "Price transport from that pier", text: "Taxi rates are origin-and-zone based; another terminal's quote is not your quote." },
      { title: "Return to the exact terminal", text: "Show the saved pier name to the driver and preserve a ship-side margin." },
    ],
    decision: "The terminal does not decide whether Cozumel is a good port day, but it changes the first and last mile. Punta Langosta favors a downtown DIY plan; International and Puerta Maya favor taxi-based beach, reef, or island routes.",
    viator: {
      heading: "Cozumel excursions with a terminal-aware pickup",
      copy: "Compare products only after the meeting instructions identify your pier or a specific nearby landmark. A generic “Cozumel port pickup” is not enough detail.",
      query: "Cozumel shore excursion cruise port pickup terminal",
      campaign: "pdg-cozumel-which-terminal",
    },
    sources: [
      { label: "Puerta Maya official port site", url: "https://www.puertamayaport.com/", note: "Current Puerta Maya location, port schedule, and transport information." },
      { label: "This Is Cozumel pier guide", url: "https://thisiscozumel.com/tourist-info/91-transport/419-piers-and-cruise-terminals", note: "Three-pier layout and downtown access comparison." },
      { label: "Cruise Critic Cozumel terminal guide", url: "https://www.cruisecritic.com/articles/cozumel-cruise-port-parking-address-amenity-info", note: "Independent cross-check for the three terminal names, locations, and passenger facilities." },
    ],
  },
  {
    sourcePortSlug: "cozumel",
    urlPortSlug: "cozumel",
    topic: "taxi-rates",
    eyebrow: "Cozumel ground-transport decision",
    title: "Cozumel Taxi Rates From Each Cruise Terminal",
    seoTitle: "Cozumel Taxi Rates From Cruise Ports: 2026 Guide",
    description: "Understand Cozumel cruise-port taxi rates by terminal and destination, including per-vehicle pricing, posted fare boards, group surcharges, and planning ranges.",
    lede: "Cozumel taxis do not use meters for cruise-port trips. Fares are organized by origin, destination zone, and group size, which is why a price copied from another pier or another passenger count can be wrong.",
    quickAnswer: "Check the posted board at your own terminal and agree on the total before entering. Current local references describe cruise-pier fares as covering up to four passengers, with higher charges for five to eight. A useful planning baseline from International Pier or Puerta Maya is about US$8 to downtown, $12 to Chankanaab, $15–17 to several southern beach clubs, and $35 to Punta Sur; posted same-day rates control and Punta Langosta can differ.",
    reviewed: "July 2026",
    facts: [
      { label: "Meter", value: "No; cruise fares use posted destination pricing" },
      { label: "Base group", value: "Commonly up to 4 passengers" },
      { label: "Larger groups", value: "Higher posted rate or taxi-van pricing" },
      { label: "Payment", value: "Confirm USD vs MXN and carry small bills" },
    ],
    fit: {
      bestFor: "DIY beach clubs, San Miguel, Chankanaab, Punta Sur, and island drives",
      minimumWindow: "Add queue and return time, not only the road estimate",
      diyLevel: "Easy when the fare board, group size, and return are explicit",
      mobility: "Ask for a suitable vehicle and verify step/storage needs",
      weather: "Rain can lengthen queues and reduce available vehicles",
      mainRisk: "Confusing a per-vehicle board with per-person pricing—or using an old fare",
    },
    sections: [
      {
        heading: "How Cozumel taxi pricing works",
        paragraphs: [
          "The cruise terminals use destination-based pricing rather than a meter. The fare changes with the starting pier, destination, and passenger count. Local Cozumel references state that the cruise-pier schedule commonly includes up to four passengers, while larger parties pay more or use a van.",
          "Read the board at the taxi stand because online tables can lag changes. Point to the destination, state the number of passengers, ask whether the amount is the total for the vehicle, and confirm the currency. Photographing the board is useful for the return conversation, but the return may begin in a different fare zone.",
        ],
      },
      {
        heading: "Useful planning rates—not a substitute for the board",
        paragraphs: [
          "EverythingCozumel's published Taxi Union table lists rides from International Pier or Puerta Maya at US$8 to downtown, $12 to Chankanaab, $15 to Paradise or San Francisco Beach, $17 to Playa Mia, Mr. Sanchos, or Nachi Cocom, $25 to Playa Palancar, and $35 to Punta Sur for up to four passengers. It says Punta Langosta fares in that table add $1, while another 2026 local guide reports broader market ranges for beach clubs and Punta Sur.",
          "Those numbers are a budget tool, not a guarantee. Venue names, zones, group size, road conditions, and current union schedules can change. If the posted board differs, ask the dispatcher to confirm before entering rather than arguing from a screenshot of an old webpage.",
        ],
      },
      {
        heading: "Round-trip cost and return strategy",
        paragraphs: [
          "A one-way fare is only half the transport budget. Ask the destination how return taxis work, whether staff call them, and how long pickup can take. For remote locations or a multi-stop island loop, a negotiated driver or bookable excursion may be more predictable than several point-to-point rides.",
          "Keep the final stop on the terminal side of the island. Punta Sur and the east coast deserve earlier departures because the return route is longer and there are fewer fallback vehicles than in San Miguel or the southern beach-club corridor.",
        ],
        bullets: ["Do not enter before the total is agreed", "Confirm vehicle total versus per-person amount", "Ask whether USD or MXN is being quoted", "Keep small bills and avoid relying on change", "Save the exact terminal name for the return"],
      },
    ],
    comparison: {
      heading: "Cruise-pier taxi budget baseline",
      columns: ["Destination", "Published baseline", "Planning note"],
      rows: [
        ["San Miguel downtown", "About US$8", "Punta Langosta is already downtown; confirm your origin"],
        ["Chankanaab", "About US$12", "Admission is separate"],
        ["Paradise / San Francisco Beach", "About US$15", "Confirm the exact club name"],
        ["Playa Mia / Mr. Sanchos / Nachi Cocom", "About US$17", "Day pass or minimum spend is separate"],
        ["Playa Palancar", "About US$25", "Return taxi availability matters"],
        ["Punta Sur", "About US$35", "Park admission and a longer return route are separate"],
      ],
    },
    steps: [
      { title: "Identify the terminal", text: "Punta Langosta, International, and Puerta Maya are different fare origins." },
      { title: "Read the current board", text: "Find the destination and the correct passenger-count column." },
      { title: "Confirm the total", text: "State the group size, currency, and whether the price is for the vehicle." },
      { title: "Plan the return", text: "Know who will call the taxi and how early to request it." },
      { title: "Compare the full cost", text: "For multiple stops, compare two-way taxis with a private driver or port-aware excursion." },
    ],
    decision: "Use taxis for one clear destination and a simple return. For a family visiting multiple zones, a remote park, or an east-island loop, compare the total taxi budget with a driver-led option that states the terminal and return plan.",
    viator: {
      heading: "When a driver-led Cozumel tour costs less friction",
      copy: "These live private and small-group options are alternatives to stacking several taxis. Compare the official price unit—per group or per person—with your full round-trip taxi budget.",
      query: "Cozumel private island tour cruise port pickup",
      campaign: "pdg-cozumel-taxi-rates",
    },
    sources: [
      { label: "EverythingCozumel taxi table", url: "https://everythingcozumel.com/taxis-city/", note: "Published Taxi Union schedule, passenger-count rules, and pier-origin table." },
      { label: "2026 Cozumel taxi guide", url: "https://jetskicozumel.com/taxi-in-cozumel-mexico/", note: "Current planning ranges and zone-based, no-meter explanation." },
      { label: "PortdayGuide terminal comparison", url: "/ports/cozumel/which-cruise-terminal", note: "How to identify the correct fare origin and pickup gate." },
    ],
  },
  {
    sourcePortSlug: "george-town-grand-cayman",
    urlPortSlug: "grand-cayman",
    topic: "tender-guide",
    eyebrow: "Grand Cayman tender decision",
    title: "Grand Cayman Tender Guide: George Town Timing & Pickup",
    seoTitle: "Grand Cayman Tender Guide: George Town Cruise Port",
    description: "How tendering works in George Town, Grand Cayman, how it changes pickup times, which terminals are used, and how early to return for the last tender.",
    lede: "Grand Cayman is not a walk-off pier call. Ships anchor offshore and move passengers to George Town by tender, so scheduled arrival is not the same as the time you can meet a driver or tour.",
    quickAnswer: "Expect a tender boat from the anchored ship to one of the closely grouped George Town landings, commonly North, South, or Royal Watler. Tender priority, queues, sea conditions, and ship clearance can delay the usable start. For an independent booking, follow the operator's cruise-specific meeting instructions and return to the landing well before the cruise line's last-tender deadline.",
    reviewed: "July 2026",
    facts: [
      { label: "Port type", value: "Tender; ships anchor offshore" },
      { label: "George Town landings", value: "North, South, and Royal Watler area" },
      { label: "Start time", value: "When ashore—not scheduled ship arrival" },
      { label: "Return deadline", value: "Cruise line's last tender controls" },
    ],
    fit: {
      bestFor: "Anyone booking an independent tour, taxi, beach transfer, or timed entry",
      minimumWindow: "Subtract tendering on both ends before judging the usable day",
      diyLevel: "Moderate; easy downtown, but ship-to-shore timing is variable",
      mobility: "Tender steps, gangways, boat motion, and boarding assistance vary",
      weather: "Wind and sea state can slow, relocate, or cancel tender operations",
      mainRisk: "Promising a fixed pickup at scheduled arrival or missing the last tender",
    },
    sections: [
      {
        heading: "What tendering changes in the morning",
        paragraphs: [
          "A published 8:00 a.m. arrival means the ship is scheduled to reach the anchorage. It does not promise that every passenger will stand in George Town at 8:00. The ship must clear, tenders must load, and cruise-line excursions or priority groups may disembark first.",
          "Independent operators familiar with Grand Cayman usually write pickup rules around the actual tender. Prefer instructions such as “meet after you come ashore” with a named landmark and contact method over a rigid time that assumes immediate disembarkation.",
        ],
        bullets: ["Read the ship's tender-ticket or priority procedure", "Keep the operator's contact and meeting image offline", "Do not use the ship's arrival time as the pickup promise", "Tell the operator if the tender queue or sea state changes"],
      },
      {
        heading: "Where tenders arrive in George Town",
        paragraphs: [
          "George Town uses closely grouped waterfront tender facilities commonly identified as North, South, and Royal Watler. They place passengers near central George Town, but a tour vendor's meeting point may be outside the immediate landing or at a separate dispatch area.",
          "The landings are close enough that a mistaken terminal is fixable more easily than at a multi-pier island such as Cozumel, yet it still costs time in a crowded arrival. Match the operator's map or landmark rather than looking only for a company name among dozens of signs.",
        ],
      },
      {
        heading: "The return is controlled by the last tender",
        paragraphs: [
          "All-aboard and last-tender instructions from the cruise line are the controlling deadlines. The return trip may include road traffic, a walk through George Town, security, a tender queue, and the boat ride. Arriving at the waterfront at the deadline is not a safe plan.",
          "PortdayGuide protects a large margin in Grand Cayman because the tender is an extra moving part. For Seven Mile Beach, return to George Town early. For Stingray City or other boat tours, use an operator that explicitly serves cruise passengers and states how it handles a delayed tender and return timing.",
        ],
      },
    ],
    comparison: {
      heading: "Tender-aware booking choices",
      columns: ["Booking type", "Timing strength", "What must be written"],
      rows: [
        ["Cruise-line excursion", "Priority and ship coordination are strongest", "Meeting deck/time and return instruction"],
        ["Cruise-specialist local tour", "Often adapts to actual tender arrival", "Named landing area, contact, last return"],
        ["Generic timed tour", "Weakest for early fixed starts", "Late-arrival policy and exact meeting point"],
        ["DIY taxi or bus", "Flexible outward trip", "Your own leave-by time for the waterfront"],
      ],
    },
    steps: [
      { title: "Read the tender procedure", text: "Know whether the ship uses tickets, priority groups, or open boarding." },
      { title: "Use an ashore-based pickup", text: "Choose instructions tied to actual landing, not scheduled arrival." },
      { title: "Save the meeting landmark", text: "North, South, Royal Watler, or another named point should appear in writing." },
      { title: "Record the last tender", text: "Use the cruise line's same-day announcement and set more than one alarm." },
      { title: "Return before the queue", text: "Allow for road time, security, and tender boarding—not only the boat ride." },
    ],
    decision: "Grand Cayman works well independently when the activity has a flexible start and the return is conservative. Avoid an early fixed-time booking that penalizes a delayed tender or gives vague “near the port” instructions.",
    viator: {
      heading: "Grand Cayman tours built for cruise arrivals",
      copy: "These results favor shore-excursion language and George Town pickup. Verify how each operator handles delayed tender arrival and the last return before booking.",
      query: "Grand Cayman shore excursion George Town cruise tender pickup",
      campaign: "pdg-grand-cayman-tender-guide",
    },
    sources: [
      { label: "Cayman Islands official tourism: George Town", url: "https://www.visitcaymanislands.com/things-to-do/popular-attractions/george-town", note: "Official George Town and cruise-arrival context." },
      { label: "Grand Cayman terminal overview", url: "https://www.cruisecritic.com/articles/grand-cayman-cruise-port-terminal-information", note: "Cross-check for tender status and the grouped waterfront terminals." },
      { label: "PortdayGuide Grand Cayman hub", url: "/ports/grand-cayman", note: "Return buffer, top activities, and weather fallback." },
    ],
  },
  {
    sourcePortSlug: "george-town-grand-cayman",
    urlPortSlug: "grand-cayman",
    topic: "seven-mile-beach-from-port",
    eyebrow: "Grand Cayman beach transport decision",
    title: "Seven Mile Beach From Grand Cayman Cruise Port",
    seoTitle: "Seven Mile Beach From Grand Cayman Cruise Port Guide",
    description: "Reach Seven Mile Beach from George Town cruise port by taxi or public bus, choose the right beach access, and return in time for the last tender.",
    lede: "Seven Mile Beach is close to George Town but not one single entrance with one set of facilities. The right plan chooses a specific access point and leaves enough time for road traffic and the tender back to the ship.",
    quickAnswer: "From central George Town, Seven Mile Beach is about a 10-minute drive in light traffic. Taxis are simplest; public bus routes 1 and 2 serve the Seven Mile Beach/West Bay corridor and official fares start at CI$2.50. Choose a named access such as Governor's Beach or Cemetery Beach, check facilities, and return to the tender area well before the cruise line's last-tender time.",
    reviewed: "July 2026",
    facts: [
      { label: "Light-traffic drive", value: "About 10 min from George Town center" },
      { label: "Public bus", value: "Routes 1 and 2; fares start at CI$2.50" },
      { label: "Beach type", value: "Long coastline with multiple public access points" },
      { label: "Return constraint", value: "Road plus tender queue and last-tender deadline" },
    ],
    fit: {
      bestFor: "A flexible, low-complexity beach day near George Town",
      minimumWindow: "4+ hours ashore; 5–6 hours gives a useful beach block",
      diyLevel: "Easy by taxi; moderate by public bus on a strict ship clock",
      mobility: "Sand access, shade, restrooms, and curb-to-beach distance vary",
      weather: "Wind, rain, heat, and sea conditions can change the value quickly",
      mainRisk: "Saying only “Seven Mile Beach” and being dropped at the wrong access",
    },
    sections: [
      {
        heading: "Pick a beach access before choosing transport",
        paragraphs: [
          "Seven Mile Beach is a coastline, not a single attraction gate. Governor's Beach is an official public access known for sand, water, and some natural shade; Cemetery Beach is another public access farther north. Hotel and beach-club areas may attach chairs, food, restrooms, or fees to their facilities even though the shoreline itself is public.",
          "Ask what matters to your group: restroom, restaurant, chair rental, reliable taxi pickup, snorkeling, shade, or the shortest ride. A driver who hears only “Seven Mile Beach” may choose a convenient commercial stop that is not the quiet public beach you expected.",
        ],
      },
      {
        heading: "Taxi versus public bus",
        paragraphs: [
          "A taxi is the strongest cruise-day choice for families, mobility needs, beach gear, or anyone who wants a specific access point. Agree on the destination and fare before leaving, and ask how to arrange the return. Shared cruise-day vans may also operate, but confirm the exact beach and price.",
          "The Cayman Islands Department of Tourism states that public bus routes 1 and 2 connect George Town with Seven Mile Beach and West Bay, with fares starting at CI$2.50. Buses can be flagged along the route and accept Cayman or U.S. dollars. The lower price comes with less control over waiting, stop location, space, and return timing.",
        ],
      },
      {
        heading: "Build the last tender into the beach day",
        paragraphs: [
          "The official tourism site describes Seven Mile Beach as about a 10-minute drive from George Town center, but light-traffic road time is not the whole return. Add time to leave the sand, find transport, move through traffic, walk to the correct tender area, clear security, and queue for the boat.",
          "Use the cruise line's last-tender announcement as the hard limit and aim to reach the waterfront much earlier. On a crowded multi-ship day, the return queue itself can be part of the port experience. A final downtown meal after the beach is only sensible when it keeps you beside the tender landing with the buffer intact.",
        ],
        bullets: ["Save the exact beach-access name", "Carry small USD or Cayman dollars", "Ask about restrooms and chair access before committing", "Set a leave-the-beach alarm", "Recheck last tender after returning ashore"],
      },
    ],
    comparison: {
      heading: "Seven Mile Beach access choices",
      columns: ["Option", "Best for", "Cost pattern", "Cruise-day tradeoff"],
      rows: [
        ["Taxi", "Specific access, families, gear", "Fare agreed before travel", "Costs more but gives more control"],
        ["Public bus 1 or 2", "Budget travelers with time", "Starts at CI$2.50", "Waiting and stop location are less predictable"],
        ["Beach transfer", "Simple round trip and facilities", "Bundled per-person price", "Less flexible and inclusions vary"],
        ["Walk", "Not recommended as the default beach plan", "No fare", "Uses too much of a tender-port day"],
      ],
    },
    steps: [
      { title: "Land by tender", text: "Start the usable clock only after reaching George Town." },
      { title: "Name the access", text: "Choose Governor's, Cemetery, or a specific commercial venue before boarding transport." },
      { title: "Confirm the return method", text: "Know whether to flag a bus, call a taxi, or meet a scheduled transfer." },
      { title: "Watch the weather and crowd", text: "Shorten the beach block when road or tender conditions become less predictable." },
      { title: "Reach George Town early", text: "Return well before the last tender and use downtown only as a flexible final stop." },
    ],
    decision: "Taxi is the best default for a first visit because it reduces uncertainty and reaches a named beach access. Public bus is a real budget option for experienced independent travelers who leave early and accept a less exact schedule.",
    viator: {
      heading: "Seven Mile Beach transfers and beach stops",
      copy: "Compare a bundled transfer with the full taxi or bus plan. Check the named beach access, facilities, pickup, and return time rather than booking only from the words “Seven Mile Beach.”",
      query: "Seven Mile Beach Grand Cayman cruise port transportation",
      campaign: "pdg-grand-cayman-seven-mile-beach",
    },
    sources: [
      { label: "Cayman Islands official transport guide", url: "https://www.visitcaymanislands.com/planning/getting-around", note: "Public bus routes, starting fare, payment, and operating context." },
      { label: "Official George Town guide", url: "https://www.visitcaymanislands.com/things-to-do/popular-attractions/george-town", note: "Official 10-minute light-traffic drive estimate from George Town." },
      { label: "Official Seven Mile Beach guide", url: "https://www.visitcaymanislands.com/things-to-do/beaches/seven-mile-beach", note: "Beach identity and public-access context." },
    ],
  },
];

export function intentGuide(urlPortSlug: string, topic: string) {
  return portIntentGuides.find((guide) => guide.urlPortSlug === urlPortSlug && guide.topic === topic);
}

export function intentGuidesForPort(sourcePortSlug: string) {
  return portIntentGuides.filter((guide) => guide.sourcePortSlug === sourcePortSlug);
}

export function intentGuidePath(guide: PortIntentGuide) {
  return `/ports/${guide.urlPortSlug}/${guide.topic}`;
}
