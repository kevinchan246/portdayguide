export type PortName = string;
export type PortSlug = string;
export type PortRegion = "Caribbean & Bahamas" | "Alaska & Pacific Northwest" | "Mexican Pacific" | "Mediterranean & Atlantic" | "Asia";
export type Interest = "Beach + water" | "Culture + history" | "Food + local life" | "Wildlife + nature" | "Accessible highlights";
export type Pace = "Relaxed" | "Balanced" | "Active";
export type Mobility = "Standard walking" | "Limited walking" | "Wheelchair / step-free preferred";
export type Weather = "Typical / dry" | "Rain likely" | "High heat";

export type Activity = { place: string; note: string; duration: number };
export type ExcursionIdea = {
  title: string;
  category: Interest;
  duration: string;
  price: string;
  bestFor: string;
  description: string;
};

export type PortProfile = {
  name: PortName;
  slug: PortSlug;
  region: PortRegion;
  country: string;
  pier: string;
  focus: string;
  buffer: number;
  transfer: number;
  transport: string;
  cost: Record<string, string>;
  rain: string;
  heat: string;
  mobility: string;
  headline: string;
  intro: string;
  viatorUrl: string;
  highlights: string[];
  activities: Record<Interest, [Activity, Activity]>;
  excursions: ExcursionIdea[];
};

export type WeatherForecast = {
  date: string;
  summary: string;
  lowC: number;
  highC: number;
  windKph: number;
  precipitationMm: number;
  planNote: string;
};

export type PortCallInput = { port: PortName; date?: string; arrival: string; allAboard: string };
export type PlannerInput = {
  ship: string;
  sailingDate: string;
  travelers: number;
  party: string;
  pace: Pace;
  interest: Interest;
  mobility: Mobility;
  budget: string;
  weather: Weather;
  calls: PortCallInput[];
};

export type PlanStop = Activity & { time: string };
export type PortDayPlan = {
  port: PortName;
  slug: PortSlug;
  country: string;
  arrival: string;
  allAboard: string;
  date: string;
  bufferMinutes: number;
  returnTarget: string;
  title: string;
  cost: string;
  warning: string | null;
  transport: string;
  backup: string;
  mobilityNote: string;
  stops: PlanStop[];
  matches: ExcursionIdea[];
  viatorUrl: string;
  forecast?: WeatherForecast;
};

export type CruisePlan = {
  id: string;
  createdAt: string;
  ship: string;
  sailingDate: string;
  travelers: number;
  party: string;
  pace: Pace;
  interest: Interest;
  mobility: Mobility;
  budget: string;
  weather: Weather;
  days: PortDayPlan[];
};

export const interests: Interest[] = ["Beach + water", "Culture + history", "Food + local life", "Wildlife + nature", "Accessible highlights"];

export const portProfiles: Record<PortName, PortProfile> = {
  Cozumel: {
    name: "Cozumel", slug: "cozumel", region: "Caribbean & Bahamas", country: "Mexico", pier: "Punta Langosta, International Pier, or Puerta Maya", focus: "Reefs, beach clubs, and San Miguel", buffer: 90, transfer: 25,
    headline: "Confirm your terminal, choose one main experience, and protect the return.",
    intro: "Cozumel has three separate cruise terminals. A reliable port day starts by identifying the exact pier, then choosing one reef, beach, nature, or heritage anchor and beginning the return at least 120 minutes before official all-aboard.",
    transport: "Use an authorized taxi stand, confirm the fare before leaving, and photograph your exact pier name for the return.",
    cost: { "$": "$35–75 pp", "$$": "$75–150 pp", "$$$": "$150+ pp" },
    rain: "Use a cacao workshop, island museum, and covered lunch near San Miguel instead of a long outdoor block.",
    heat: "Keep the first outdoor block early, add a shaded lunch, and shorten the afternoon walk.",
    mobility: "Central San Miguel and some beach clubs offer easier routes, but surfaces and vehicle access vary. Confirm step-free access directly.",
    viatorUrl: "https://www.viator.com/Cozumel/d632-ttd",
    highlights: ["Chankanaab", "San Miguel", "Punta Sur", "San Gervasio"],
    activities: {
      "Beach + water": [{ place: "Reef or beach-club block", note: "Choose one bookable water experience with port pickup details confirmed", duration: 150 }, { place: "San Miguel waterfront", note: "Easy final stop with reliable taxis nearby", duration: 55 }],
      "Culture + history": [{ place: "San Gervasio or island heritage tour", note: "Use pre-arranged transport and build in shaded breaks", duration: 135 }, { place: "San Miguel", note: "Museum or central plaza loop before returning", duration: 60 }],
      "Food + local life": [{ place: "San Miguel tasting route", note: "Local bites and a compact town loop", duration: 115 }, { place: "Waterfront finish", note: "Keep the final stop near reliable return transport", duration: 65 }],
      "Wildlife + nature": [{ place: "Punta Sur nature route", note: "Pre-arrange transport and confirm current park conditions", duration: 165 }, { place: "East-coast viewpoint", note: "Add only if road timing remains comfortable", duration: 45 }],
      "Accessible highlights": [{ place: "Driver-led island panorama", note: "Lower-transition route with confirmed accessible vehicle", duration: 110 }, { place: "Pier-side lunch", note: "Keep the final block close to the ship", duration: 70 }],
    },
    excursions: [
      { title: "Reef snorkel with port transfer", category: "Beach + water", duration: "3–4 hours", price: "$$", bestFor: "First-time visitors", description: "One water activity, equipment, and a clearly documented return transfer." },
      { title: "Private island highlights drive", category: "Accessible highlights", duration: "3–5 hours", price: "$$$", bestFor: "Families and mixed mobility", description: "A flexible driver-led route with fewer fixed walking transitions." },
      { title: "San Gervasio and island culture", category: "Culture + history", duration: "3–4 hours", price: "$$", bestFor: "History-focused travelers", description: "Maya heritage paired with a compact town or tasting stop." },
    ],
  },
  Nassau: {
    name: "Nassau", slug: "nassau", region: "Caribbean & Bahamas", country: "Bahamas", pier: "Prince George Wharf", focus: "Old town, food, and short beach escapes", buffer: 75, transfer: 18,
    headline: "History, beach, or boats—without missing the easy return.",
    intro: "Nassau offers both walkable downtown sights and boat-based excursions. Pick one geographic direction for the main experience and avoid combining distant islands with a rushed downtown checklist.",
    transport: "Central Nassau is walkable for many guests. Use licensed taxis or the operator’s documented pickup for beach and boat transfers.",
    cost: { "$": "$25–60 pp", "$$": "$60–130 pp", "$$$": "$130+ pp" },
    rain: "Use Pirates of Nassau, the Straw Market, and a covered downtown lunch instead of beach time.",
    heat: "Do the historic loop first, then use a shaded or air-conditioned lunch and a shorter waterfront finish.",
    mobility: "Downtown sidewalks can be uneven and the Queen’s Staircase has many steps. Choose waterfront and taxi-based alternatives where needed.",
    viatorUrl: "https://www.viator.com/Nassau/d420-ttd",
    highlights: ["Queen’s Staircase", "Junkanoo Beach", "Arawak Cay", "Nassau waterfront"],
    activities: {
      "Beach + water": [{ place: "Beach or half-day boat experience", note: "Confirm meeting point, duration, and return transfer before booking", duration: 145 }, { place: "Nassau waterfront", note: "Easy final browse close to the ship", duration: 50 }],
      "Culture + history": [{ place: "Old Nassau loop", note: "Queen’s Staircase, fort exterior, and downtown landmarks", duration: 125 }, { place: "Pirates of Nassau", note: "Indoor history stop near the return route", duration: 65 }],
      "Food + local life": [{ place: "Downtown tasting route", note: "Bahamian bites and a compact market loop", duration: 115 }, { place: "Waterfront café", note: "Finish near the pier with a comfortable margin", duration: 65 }],
      "Wildlife + nature": [{ place: "Ardastra or marine experience", note: "Confirm current operating times independently", duration: 125 }, { place: "Junkanoo Beach", note: "Short optional coastal finish", duration: 55 }],
      "Accessible highlights": [{ place: "Taxi panorama loop", note: "Driver-led highlights with fewer walking transitions", duration: 105 }, { place: "Nassau waterfront", note: "Lower-step final route near the pier", duration: 70 }],
    },
    excursions: [
      { title: "Old Nassau food and history walk", category: "Food + local life", duration: "3 hours", price: "$$", bestFor: "Couples and food lovers", description: "A compact downtown experience that avoids long return transfers." },
      { title: "Rose Island or reef half-day", category: "Beach + water", duration: "4–5 hours", price: "$$$", bestFor: "Active travelers", description: "A single boat-based day with pickup and cruise timing checked carefully." },
      { title: "Private Nassau highlights drive", category: "Accessible highlights", duration: "2–4 hours", price: "$$$", bestFor: "Mixed mobility groups", description: "A flexible overview that can reduce hills and long walking sections." },
    ],
  },
  "Costa Maya": {
    name: "Costa Maya", slug: "costa-maya", region: "Caribbean & Bahamas", country: "Mexico", pier: "Costa Maya Cruise Port", focus: "Maya ruins, Bacalar, and Mahahual", buffer: 105, transfer: 35,
    headline: "Choose ruins, lagoon, or beach—and protect the road time.",
    intro: "Costa Maya’s best-known experiences sit in different directions and often require meaningful road time. A strong cruise-day plan chooses one main zone and returns to the port complex before the margin feels tight.",
    transport: "For Chacchoben or Bacalar, use a reputable pre-booked transfer and locate the meeting point before sailing. Mahahual uses taxis from the port area.",
    cost: { "$": "$35–80 pp", "$$": "$80–155 pp", "$$$": "$155+ pp" },
    rain: "Stay in the port complex for covered shops and lunch, or use a sheltered Mahahual restaurant if transport is operating normally.",
    heat: "Prioritize the earliest ruins departure, carry water, and keep the final block shaded and close to port.",
    mobility: "The long pier, port exit, sand, and archaeological paths can add effort. Confirm shuttle and step-free arrangements before the day.",
    viatorUrl: "https://www.viator.com/Costa-Maya/d4345-ttd",
    highlights: ["Chacchoben", "Mahahual", "Bacalar Lagoon", "Port village"],
    activities: {
      "Beach + water": [{ place: "Mahahual beach block", note: "Use a documented taxi or club transfer plan", duration: 145 }, { place: "Port village", note: "Return early for a low-risk final browse", duration: 50 }],
      "Culture + history": [{ place: "Chacchoben ruins", note: "Pre-booked visit with road-time margin protected", duration: 150 }, { place: "Port village", note: "Add only a short final stop after the transfer", duration: 45 }],
      "Food + local life": [{ place: "Mahahual boardwalk", note: "Local lunch and a relaxed village walk", duration: 130 }, { place: "Port village", note: "Easy final stop after the taxi return", duration: 50 }],
      "Wildlife + nature": [{ place: "Bacalar lagoon route", note: "Long-transfer option only with a vetted operator", duration: 165 }, { place: "Port village", note: "Keep the final block inside the port complex", duration: 40 }],
      "Accessible highlights": [{ place: "Port village", note: "Lower-transfer day focused on port amenities and shade", duration: 115 }, { place: "Mahahual taxi panorama", note: "Use only if accessible transport is confirmed", duration: 65 }],
    },
    excursions: [
      { title: "Chacchoben shore excursion", category: "Culture + history", duration: "4–5 hours", price: "$$", bestFor: "First-time visitors", description: "A focused ruins day with port pickup and road timing clearly documented." },
      { title: "Mahahual beach day", category: "Beach + water", duration: "3–5 hours", price: "$$", bestFor: "Relaxed travelers", description: "A flexible beach block that avoids stacking a second long transfer." },
      { title: "Bacalar lagoon experience", category: "Wildlife + nature", duration: "5–6 hours", price: "$$$", bestFor: "Long port calls", description: "A rewarding but distant option only when the ship window is comfortably long." },
    ],
  },
  "St. Thomas": {
    name: "St. Thomas", slug: "st-thomas", region: "Caribbean & Bahamas", country: "U.S. Virgin Islands", pier: "Havensight, Crown Bay, or tender pier", focus: "Island views, bays, and Charlotte Amalie", buffer: 90, transfer: 28,
    headline: "Match the right beach or viewpoint to your actual pier.",
    intro: "St. Thomas works best when you confirm the berth first. Traffic around Charlotte Amalie and cross-island beach rides can change the day, so PortdayGuide keeps the last block near the return route.",
    transport: "Confirm Havensight, Crown Bay, or tender arrangements. Shared safari taxis are common; allow extra time near Charlotte Amalie.",
    cost: { "$": "$40–85 pp", "$$": "$85–160 pp", "$$$": "$160+ pp" },
    rain: "Use central Charlotte Amalie sights, covered arcades, and a relaxed lunch rather than a distant beach.",
    heat: "Start with the viewpoint, limit midday walking, and keep the final stop close to your confirmed pier.",
    mobility: "Historic streets can be steep or uneven. A taxi panorama and pier-side finish can reduce walking; confirm vehicle access.",
    viatorUrl: "https://www.viator.com/St-Thomas/d965-ttd",
    highlights: ["Magens Bay", "Mountain Top", "Charlotte Amalie", "Sapphire Beach"],
    activities: {
      "Beach + water": [{ place: "Magens Bay or snorkel block", note: "Use a scheduled pickup and protect traffic time", duration: 150 }, { place: "Pier-side finish", note: "Snack or browse near your confirmed berth", duration: 45 }],
      "Culture + history": [{ place: "Charlotte Amalie", note: "Historic core route adjusted for hills and heat", duration: 120 }, { place: "Scenic overlook", note: "Taxi viewpoint stop before the pier return", duration: 55 }],
      "Food + local life": [{ place: "Charlotte Amalie food stop", note: "Local lunch with a compact central loop", duration: 115 }, { place: "Waterfront", note: "Final drink or browse on the return route", duration: 55 }],
      "Wildlife + nature": [{ place: "Coral World area", note: "Pre-arranged taxi to the marine park area", duration: 145 }, { place: "Scenic overlook", note: "Add only if traffic remains light", duration: 40 }],
      "Accessible highlights": [{ place: "Taxi island panorama", note: "Lower-walking route with planned photo stops", duration: 110 }, { place: "Pier-side lunch", note: "Keep the final block close to the ship", duration: 70 }],
    },
    excursions: [
      { title: "Magens Bay and island highlights", category: "Beach + water", duration: "4–5 hours", price: "$$", bestFor: "First-time visitors", description: "A classic beach-and-view route with pickup matched to the correct pier." },
      { title: "Turtle snorkel or catamaran", category: "Wildlife + nature", duration: "3–5 hours", price: "$$$", bestFor: "Active travelers", description: "A water-first day that should not be combined with a distant island loop." },
      { title: "Private accessible panorama", category: "Accessible highlights", duration: "3–4 hours", price: "$$$", bestFor: "Mixed mobility groups", description: "Driver-led viewpoints with the vehicle and step access confirmed in advance." },
    ],
  },
  Roatán: {
    name: "Roatán", slug: "roatan", region: "Caribbean & Bahamas", country: "Honduras", pier: "Coxen Hole or Mahogany Bay", focus: "Wildlife, reef, and West Bay", buffer: 120, transfer: 35,
    headline: "Wildlife and reef plans built around island-road uncertainty.",
    intro: "Roatán’s two cruise terminals and narrow island roads make pickup details especially important. Choose one main zone, keep the driver’s contact details, and use the largest return buffer in PortdayGuide’s current coverage.",
    transport: "Confirm Coxen Hole or Mahogany Bay. Pre-book island transport, keep the driver’s contact details, and protect extra road-time margin.",
    cost: { "$": "$45–90 pp", "$$": "$90–170 pp", "$$$": "$170+ pp" },
    rain: "Use a covered wildlife sanctuary visit and lunch around West End; avoid stacking distant stops when roads are slow.",
    heat: "Use the morning for the main activity, choose a shaded lunch, and shorten the second stop.",
    mobility: "Island vehicles, docks, sand, and sanctuary paths vary widely. Confirm step-free access with the operator before booking.",
    viatorUrl: "https://www.viator.com/Roatan/d4132-ttd",
    highlights: ["West Bay", "West End", "Wildlife sanctuaries", "Island viewpoints"],
    activities: {
      "Beach + water": [{ place: "West Bay beach or reef block", note: "Pre-book transport and confirm the return pickup", duration: 155 }, { place: "Pier-side finish", note: "Return with extra island-road margin", duration: 40 }],
      "Culture + history": [{ place: "Island highlights route", note: "Driver-led loop with village and viewpoint context", duration: 135 }, { place: "West End", note: "Short local lunch or browse before returning", duration: 50 }],
      "Food + local life": [{ place: "West End", note: "Local lunch and compact village exploration", duration: 125 }, { place: "Scenic roadside stop", note: "Add only if the driver confirms a comfortable return", duration: 45 }],
      "Wildlife + nature": [{ place: "Wildlife sanctuary", note: "Pre-booked visit with transport timing confirmed", duration: 125 }, { place: "West Bay", note: "Short beach finish before the protected return window", duration: 65 }],
      "Accessible highlights": [{ place: "Driver-led island panorama", note: "Lower-walking viewpoints and a flexible route", duration: 115 }, { place: "Pier-side lunch", note: "Reduce road risk with a close final block", duration: 65 }],
    },
    excursions: [
      { title: "Wildlife sanctuary and West Bay", category: "Wildlife + nature", duration: "4–5 hours", price: "$$", bestFor: "Families", description: "One sanctuary plus one beach zone, with both terminal and driver details confirmed." },
      { title: "Private island highlights driver", category: "Accessible highlights", duration: "3–5 hours", price: "$$$", bestFor: "Flexible groups", description: "A customizable route that can reduce transfers and adapt to traffic." },
      { title: "Reef snorkel and beach", category: "Beach + water", duration: "4–5 hours", price: "$$$", bestFor: "Water-focused travelers", description: "A single coastal experience with operator-managed return transportation." },
    ],
  },
};

type PortSeed = {
  name: string;
  slug: string;
  region: PortRegion;
  country: string;
  pier: string;
  highlights: [string, string, string, string];
  buffer?: number;
  transfer?: number;
};

const additionalPortSeeds: PortSeed[] = [
  { name: "San Juan", slug: "san-juan", region: "Caribbean & Bahamas", country: "Puerto Rico", pier: "Old San Juan cruise piers or Pan American Pier", highlights: ["Old San Juan", "El Morro", "Condado", "El Yunque"], buffer: 90, transfer: 25 },
  { name: "Philipsburg", slug: "philipsburg", region: "Caribbean & Bahamas", country: "St. Maarten", pier: "Dr. A.C. Wathey Cruise Facility", highlights: ["Great Bay", "Maho Beach", "Marigot", "Orient Bay"], buffer: 105, transfer: 30 },
  { name: "George Town", slug: "george-town-grand-cayman", region: "Caribbean & Bahamas", country: "Cayman Islands", pier: "George Town tender terminals", highlights: ["Seven Mile Beach", "Stingray City", "Camana Bay", "George Town"], buffer: 120, transfer: 30 },
  { name: "Falmouth", slug: "falmouth-jamaica", region: "Caribbean & Bahamas", country: "Jamaica", pier: "Historic Falmouth Cruise Port", highlights: ["Historic Falmouth", "Good Hope", "Martha Brae", "Montego Bay"], buffer: 120, transfer: 40 },
  { name: "Ocho Rios", slug: "ocho-rios", region: "Caribbean & Bahamas", country: "Jamaica", pier: "Ocho Rios Cruise Port or Reynolds Pier", highlights: ["Dunn's River Falls", "Blue Hole", "Mystic Mountain", "Turtle Beach"], buffer: 105, transfer: 35 },
  { name: "Montego Bay", slug: "montego-bay", region: "Caribbean & Bahamas", country: "Jamaica", pier: "Montego Bay Freeport terminal", highlights: ["Doctor's Cave Beach", "Hip Strip", "Rose Hall", "Martha Brae"], buffer: 120, transfer: 40 },
  { name: "Amber Cove", slug: "amber-cove", region: "Caribbean & Bahamas", country: "Dominican Republic", pier: "Amber Cove Cruise Center", highlights: ["Puerto Plata", "Damajagua Falls", "Mount Isabel", "Amber Cove"], buffer: 120, transfer: 40 },
  { name: "Puerto Plata", slug: "puerto-plata", region: "Caribbean & Bahamas", country: "Dominican Republic", pier: "Taíno Bay or Amber Cove", highlights: ["Fortaleza San Felipe", "Umbrella Street", "Cable car", "Damajagua Falls"], buffer: 120, transfer: 40 },
  { name: "Belize City", slug: "belize-city", region: "Caribbean & Bahamas", country: "Belize", pier: "Fort Street Tourism Village tender terminal", highlights: ["Altun Ha", "Cave tubing", "Belize Barrier Reef", "Museum of Belize"], buffer: 135, transfer: 45 },
  { name: "Key West", slug: "key-west", region: "Caribbean & Bahamas", country: "United States", pier: "Mallory Square, Pier B, or Outer Mole", highlights: ["Old Town", "Southernmost Point", "Truman Little White House", "Duval Street"], buffer: 75, transfer: 15 },
  { name: "Oranjestad", slug: "oranjestad-aruba", region: "Caribbean & Bahamas", country: "Aruba", pier: "Oranjestad Cruise Terminal", highlights: ["Eagle Beach", "California Lighthouse", "Arikok", "Oranjestad"], buffer: 90, transfer: 30 },
  { name: "Willemstad", slug: "willemstad-curacao", region: "Caribbean & Bahamas", country: "Curaçao", pier: "Mega Pier or Mathey Wharf", highlights: ["Handelskade", "Queen Emma Bridge", "Mambo Beach", "Westpunt"], buffer: 90, transfer: 30 },
  { name: "Kralendijk", slug: "kralendijk-bonaire", region: "Caribbean & Bahamas", country: "Bonaire", pier: "North or South Pier, Kralendijk", highlights: ["Klein Bonaire", "Salt flats", "Lac Bay", "Kralendijk"], buffer: 90, transfer: 25 },
  { name: "Bridgetown", slug: "bridgetown", region: "Caribbean & Bahamas", country: "Barbados", pier: "Bridgetown Cruise Terminal", highlights: ["Carlisle Bay", "Harrison's Cave", "Bathsheba", "Historic Bridgetown"], buffer: 105, transfer: 35 },
  { name: "Castries", slug: "castries", region: "Caribbean & Bahamas", country: "Saint Lucia", pier: "Point Seraphine or La Place Carenage", highlights: ["Pitons", "Marigot Bay", "Pigeon Island", "Castries Market"], buffer: 135, transfer: 45 },
  { name: "St. John's", slug: "st-johns-antigua", region: "Caribbean & Bahamas", country: "Antigua and Barbuda", pier: "Heritage Quay or Redcliffe Quay", highlights: ["Nelson's Dockyard", "Shirley Heights", "Dickenson Bay", "St. John's"], buffer: 105, transfer: 35 },
  { name: "Basseterre", slug: "basseterre", region: "Caribbean & Bahamas", country: "St. Kitts and Nevis", pier: "Port Zante", highlights: ["Brimstone Hill", "South Friars Bay", "Scenic Railway", "Basseterre"], buffer: 105, transfer: 35 },
  { name: "Road Town", slug: "road-town-tortola", region: "Caribbean & Bahamas", country: "British Virgin Islands", pier: "Tortola Pier Park", highlights: ["Cane Garden Bay", "Sage Mountain", "The Baths", "Road Town"], buffer: 120, transfer: 40 },
  { name: "St. George's", slug: "st-georges-grenada", region: "Caribbean & Bahamas", country: "Grenada", pier: "Melville Street Cruise Terminal", highlights: ["Grand Anse", "Fort George", "Annandale Falls", "Spice estates"], buffer: 105, transfer: 35 },
  { name: "Roseau", slug: "roseau-dominica", region: "Caribbean & Bahamas", country: "Dominica", pier: "Roseau Cruise Ship Berth or Woodbridge Bay", highlights: ["Trafalgar Falls", "Morne Bruce", "Champagne Reef", "Roseau Market"], buffer: 120, transfer: 40 },
  { name: "Juneau", slug: "juneau", region: "Alaska & Pacific Northwest", country: "United States", pier: "Juneau downtown docks or AJ Dock", highlights: ["Mendenhall Glacier", "Whale watching", "Mount Roberts", "Downtown Juneau"], buffer: 90, transfer: 30 },
  { name: "Ketchikan", slug: "ketchikan", region: "Alaska & Pacific Northwest", country: "United States", pier: "Downtown berths or Ward Cove", highlights: ["Creek Street", "Totem Bight", "Misty Fjords", "Saxman Village"], buffer: 105, transfer: 35 },
  { name: "Skagway", slug: "skagway", region: "Alaska & Pacific Northwest", country: "United States", pier: "Railroad, Broadway, or Ore docks", highlights: ["White Pass Railway", "Klondike district", "Dyea", "Lower Reid Falls"], buffer: 90, transfer: 30 },
  { name: "Sitka", slug: "sitka", region: "Alaska & Pacific Northwest", country: "United States", pier: "Sitka Sound Cruise Terminal or tender dock", highlights: ["Sitka National Historical Park", "Fortress of the Bear", "Raptor Center", "Russian Bishop's House"], buffer: 105, transfer: 35 },
  { name: "Icy Strait Point", slug: "icy-strait-point", region: "Alaska & Pacific Northwest", country: "United States", pier: "Wilderness Landing or Ocean Landing", highlights: ["Hoonah", "Whale watching", "ZipRider", "Cannery district"], buffer: 90, transfer: 25 },
  { name: "Victoria", slug: "victoria-bc", region: "Alaska & Pacific Northwest", country: "Canada", pier: "Ogden Point", highlights: ["Inner Harbour", "Butchart Gardens", "Beacon Hill Park", "Government Street"], buffer: 105, transfer: 35 },
  { name: "Cabo San Lucas", slug: "cabo-san-lucas", region: "Mexican Pacific", country: "Mexico", pier: "Cabo San Lucas tender marina", highlights: ["El Arco", "Medano Beach", "San José del Cabo", "Marina"], buffer: 120, transfer: 35 },
  { name: "Puerto Vallarta", slug: "puerto-vallarta", region: "Mexican Pacific", country: "Mexico", pier: "Puerto Vallarta Maritime Terminal", highlights: ["Malecón", "Zona Romántica", "Los Arcos", "Botanical Garden"], buffer: 105, transfer: 35 },
  { name: "Mazatlán", slug: "mazatlan", region: "Mexican Pacific", country: "Mexico", pier: "Mazatlán cruise terminal", highlights: ["Centro Histórico", "Malecón", "Stone Island", "El Faro"], buffer: 105, transfer: 35 },
  { name: "Ensenada", slug: "ensenada", region: "Mexican Pacific", country: "Mexico", pier: "Ensenada Cruiseport Village", highlights: ["La Bufadora", "Riviera del Pacífico", "First Street", "Valle de Guadalupe"], buffer: 105, transfer: 35 },
  { name: "Progreso", slug: "progreso", region: "Mexican Pacific", country: "Mexico", pier: "Progreso Cruise Port", highlights: ["Mérida", "Dzibilchaltún", "Progreso Beach", "El Corchito"], buffer: 135, transfer: 45 },
  { name: "Barcelona", slug: "barcelona", region: "Mediterranean & Atlantic", country: "Spain", pier: "Moll Adossat or World Trade Center terminals", highlights: ["Sagrada Família", "Gothic Quarter", "Park Güell", "La Rambla"], buffer: 120, transfer: 40 },
  { name: "Civitavecchia (Rome)", slug: "civitavecchia-rome", region: "Mediterranean & Atlantic", country: "Italy", pier: "Port of Civitavecchia", highlights: ["Colosseum", "Vatican City", "Trevi Fountain", "Civitavecchia"], buffer: 180, transfer: 70 },
  { name: "Naples", slug: "naples", region: "Mediterranean & Atlantic", country: "Italy", pier: "Stazione Marittima", highlights: ["Pompeii", "Historic Naples", "Capri", "Amalfi Coast"], buffer: 150, transfer: 55 },
  { name: "Livorno (Florence)", slug: "livorno-florence", region: "Mediterranean & Atlantic", country: "Italy", pier: "Port of Livorno", highlights: ["Florence", "Pisa", "Lucca", "Livorno canals"], buffer: 180, transfer: 70 },
  { name: "Marseille", slug: "marseille", region: "Mediterranean & Atlantic", country: "France", pier: "Marseille Provence Cruise Terminal", highlights: ["Vieux-Port", "Notre-Dame de la Garde", "Le Panier", "Cassis"], buffer: 120, transfer: 40 },
  { name: "Palma de Mallorca", slug: "palma-de-mallorca", region: "Mediterranean & Atlantic", country: "Spain", pier: "Estació Marítima terminals", highlights: ["Palma Cathedral", "Old Town", "Bellver Castle", "Sóller"], buffer: 120, transfer: 40 },
  { name: "Piraeus (Athens)", slug: "piraeus-athens", region: "Mediterranean & Atlantic", country: "Greece", pier: "Piraeus cruise terminals", highlights: ["Acropolis", "Plaka", "Acropolis Museum", "Piraeus"], buffer: 150, transfer: 55 },
  { name: "Santorini", slug: "santorini", region: "Mediterranean & Atlantic", country: "Greece", pier: "Old Port tender landing", highlights: ["Oia", "Fira", "Akrotiri", "Caldera viewpoints"], buffer: 150, transfer: 50 },
  { name: "Mykonos", slug: "mykonos", region: "Mediterranean & Atlantic", country: "Greece", pier: "Tourlos New Port or tender landing", highlights: ["Mykonos Town", "Little Venice", "Delos", "Windmills"], buffer: 120, transfer: 35 },
  { name: "Dubrovnik", slug: "dubrovnik", region: "Mediterranean & Atlantic", country: "Croatia", pier: "Port Gruž or Old Port tender", highlights: ["City Walls", "Old Town", "Mount Srđ", "Lokrum"], buffer: 120, transfer: 40 },
  { name: "Valletta", slug: "valletta", region: "Mediterranean & Atlantic", country: "Malta", pier: "Valletta Waterfront", highlights: ["Upper Barrakka Gardens", "St. John's Co-Cathedral", "Mdina", "Three Cities"], buffer: 105, transfer: 35 },
  { name: "Lisbon", slug: "lisbon", region: "Mediterranean & Atlantic", country: "Portugal", pier: "Lisbon Cruise Terminal, Santa Apolónia, or Alcântara", highlights: ["Belém", "Alfama", "Baixa", "Sintra"], buffer: 120, transfer: 40 },
  { name: "Yokohama (Tokyo)", slug: "yokohama-tokyo", region: "Asia", country: "Japan", pier: "Osanbashi, Shinko, or Daikoku cruise terminal", highlights: ["Tokyo", "Yokohama waterfront", "Kamakura", "Sankeien Garden"], buffer: 150, transfer: 55 },
  { name: "Osaka", slug: "osaka", region: "Asia", country: "Japan", pier: "Tempozan Cruise Terminal", highlights: ["Osaka Castle", "Dotonbori", "Kyoto", "Shinsekai"], buffer: 150, transfer: 55 },
  { name: "Kobe", slug: "kobe", region: "Asia", country: "Japan", pier: "Kobe Port Terminal or Naka Pier", highlights: ["Kitano", "Nunobiki", "Arima Onsen", "Himeji Castle"], buffer: 120, transfer: 40 },
  { name: "Nagasaki", slug: "nagasaki", region: "Asia", country: "Japan", pier: "Matsugae International Cruise Terminal", highlights: ["Peace Park", "Glover Garden", "Dejima", "Mount Inasa"], buffer: 105, transfer: 35 },
  { name: "Fukuoka", slug: "fukuoka", region: "Asia", country: "Japan", pier: "Hakata Port International Terminal", highlights: ["Dazaifu", "Ohori Park", "Kushida Shrine", "Canal City"], buffer: 105, transfer: 35 },
  { name: "Busan", slug: "busan", region: "Asia", country: "South Korea", pier: "Busan Port International Passenger Terminal", highlights: ["Gamcheon Culture Village", "Haedong Yonggungsa", "Jagalchi Market", "Haeundae"], buffer: 120, transfer: 40 },
  { name: "Jeju", slug: "jeju", region: "Asia", country: "South Korea", pier: "Jeju or Seogwipo Gangjeong cruise terminal", highlights: ["Seongsan Ilchulbong", "Jeju folk village", "Hallasan viewpoints", "Dongmun Market"], buffer: 135, transfer: 45 },
  { name: "Hong Kong", slug: "hong-kong", region: "Asia", country: "Hong Kong", pier: "Kai Tak or Ocean Terminal", highlights: ["Victoria Peak", "Star Ferry", "Temple Street", "Lantau"], buffer: 120, transfer: 40 },
  { name: "Singapore", slug: "singapore", region: "Asia", country: "Singapore", pier: "Marina Bay Cruise Centre or Singapore Cruise Centre", highlights: ["Gardens by the Bay", "Chinatown", "Marina Bay", "Kampong Glam"], buffer: 120, transfer: 40 },
  { name: "Keelung (Taipei)", slug: "keelung-taipei", region: "Asia", country: "Taiwan", pier: "Keelung East or West Passenger Terminal", highlights: ["Taipei 101", "Jiufen", "National Palace Museum", "Keelung Night Market"], buffer: 150, transfer: 55 },
  { name: "Shanghai", slug: "shanghai", region: "Asia", country: "China", pier: "Shanghai Port International Cruise Terminal or Wusongkou", highlights: ["The Bund", "Yu Garden", "French Concession", "Shanghai Tower"], buffer: 150, transfer: 55 },
  { name: "Laem Chabang (Bangkok)", slug: "laem-chabang-bangkok", region: "Asia", country: "Thailand", pier: "Laem Chabang Cruise Terminal", highlights: ["Grand Palace", "Wat Pho", "Bangkok canals", "Pattaya"], buffer: 210, transfer: 90 },
  { name: "Phú Mỹ (Ho Chi Minh City)", slug: "phu-my-ho-chi-minh-city", region: "Asia", country: "Vietnam", pier: "Phú Mỹ port terminal", highlights: ["Ho Chi Minh City", "Reunification Palace", "Ben Thanh Market", "Vũng Tàu"], buffer: 210, transfer: 90 },
  { name: "Chan May (Huế & Da Nang)", slug: "chan-may-hue-da-nang", region: "Asia", country: "Vietnam", pier: "Chan May Port", highlights: ["Imperial City of Huế", "Da Nang", "Hội An", "Lang Co Bay"], buffer: 180, transfer: 70 },
  { name: "Benoa (Bali)", slug: "benoa-bali", region: "Asia", country: "Indonesia", pier: "Benoa Cruise Terminal", highlights: ["Ubud", "Uluwatu", "Nusa Dua", "Sanur"], buffer: 180, transfer: 65 },
  { name: "Phuket", slug: "phuket", region: "Asia", country: "Thailand", pier: "Phuket Deep Sea Port or Patong tender landing", highlights: ["Phang Nga Bay", "Old Phuket Town", "Wat Chalong", "Patong"], buffer: 150, transfer: 55 },
];

function searchViator(name: string, country: string) {
  return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(`${name} ${country} shore excursion`)}`;
}

function createAdditionalProfile(seed: PortSeed): PortProfile {
  const buffer = seed.buffer ?? 105;
  const transfer = seed.transfer ?? 35;
  const [primary, secondary, third, fourth] = seed.highlights;
  const finalStop = transfer >= 45 ? `${seed.name} port area` : secondary;
  return {
    ...seed,
    buffer,
    transfer,
    focus: `${primary}, ${secondary}, and ${third}`,
    headline: `Build a realistic ${seed.name} day around transfer time and the ship's clock.`,
    intro: `${seed.name} offers several very different shore-day directions. PortdayGuide keeps the plan intentionally focused: one main experience, one flexible finish, and a port-specific return margin before official all-aboard.`,
    transport: `Confirm the exact ${seed.pier} berth or tender arrangement. Use a licensed taxi, cruise shuttle, or operator pickup with the return meeting point documented before leaving.`,
    cost: { "$": "$35–80 pp", "$$": "$80–165 pp", "$$$": "$165+ pp" },
    rain: `Choose a shorter covered or city-based route around ${secondary}, and keep the final block close to ${seed.pier}.`,
    heat: `Start the longest outdoor block early, protect a shaded midday break, and shorten the final stop if conditions are uncomfortable.`,
    mobility: `Surfaces, vehicle steps, tender access, and attraction routes vary. Confirm step-free arrangements directly with the operator and cruise line.`,
    viatorUrl: searchViator(seed.name, seed.country),
    highlights: seed.highlights,
    activities: {
      "Beach + water": [{ place: `${seed.name} waterfront or water-focused option`, note: "Choose this category only when the product description clearly confirms a real water or coastal activity", duration: 150 }, { place: finalStop, note: "Keep the final stop on the reliable return route", duration: 50 }],
      "Culture + history": [{ place: `${primary} and local heritage`, note: "Use a focused route rather than stacking distant attractions", duration: 140 }, { place: secondary, note: "Add a compact second stop only if timing remains comfortable", duration: 55 }],
      "Food + local life": [{ place: `${seed.name} food and neighborhood route`, note: "Pair local food with a compact, walkable or driver-led loop", duration: 125 }, { place: finalStop, note: "Finish near dependable return transport", duration: 60 }],
      "Wildlife + nature": [{ place: `${seed.name} scenic or nature-focused option`, note: "Choose this category only when the product description confirms the habitat or nature experience", duration: 155 }, { place: finalStop, note: "Use a low-risk final block close to the ship", duration: 45 }],
      "Accessible highlights": [{ place: `Driver-led ${seed.name} panorama`, note: "Request a lower-transition route and confirm the vehicle setup", duration: 120 }, { place: finalStop, note: "Choose the easiest practical finish near the return route", duration: 65 }],
    },
    excursions: [
      { title: `${seed.name} guided shore overview`, category: "Culture + history", duration: "3–5 hours", price: "$$", bestFor: "First-time visitors", description: `Look for a focused route with the named sights, terminal pickup, language, and return timing confirmed in the live listing.` },
      { title: `${seed.name} scenic small-group route`, category: "Wildlife + nature", duration: "3–5 hours", price: "$$$", bestFor: "Scenery-focused travelers", description: `Verify the actual stops, activity type, pickup point, and return transportation rather than relying on the category name.` },
      { title: `Private ${seed.name} highlights`, category: "Accessible highlights", duration: "3–5 hours", price: "$$$", bestFor: "Families and flexible groups", description: `A customizable overview; confirm that ${secondary} and ${fourth} are realistic for the available port window.` },
    ],
  };
}

for (const seed of additionalPortSeeds) portProfiles[seed.name] = createAdditionalProfile(seed);

export const portNames = Object.keys(portProfiles) as PortName[];
export const profilesBySlug = Object.fromEntries(Object.values(portProfiles).map((profile) => [profile.slug, profile])) as Record<PortSlug, PortProfile>;
export const portRegions = ["Caribbean & Bahamas", "Alaska & Pacific Northwest", "Mexican Pacific", "Mediterranean & Atlantic", "Asia"] as const;
export const portsByRegion = Object.fromEntries(portRegions.map((region) => [region, portNames.filter((name) => portProfiles[name].region === region)])) as Record<PortRegion, PortName[]>;

export const portCoordinates: Record<string, [number, number]> = {
  cozumel: [20.423, -86.923], nassau: [25.079, -77.344], "costa-maya": [18.714, -87.709], "st-thomas": [18.341, -64.93], roatan: [16.324, -86.535],
  "san-juan": [18.466, -66.106], philipsburg: [18.026, -63.047], "george-town-grand-cayman": [19.286, -81.374], "falmouth-jamaica": [18.493, -77.652], "ocho-rios": [18.408, -77.104],
  "montego-bay": [18.471, -77.918], "amber-cove": [19.828, -70.733], "puerto-plata": [19.795, -70.688], "belize-city": [17.505, -88.184], "key-west": [24.555, -81.78],
  "oranjestad-aruba": [12.518, -70.037], "willemstad-curacao": [12.109, -68.935], "kralendijk-bonaire": [12.151, -68.276], bridgetown: [13.097, -59.617], castries: [14.01, -60.987],
  "st-johns-antigua": [17.122, -61.844], basseterre: [17.296, -62.725], "road-town-tortola": [18.428, -64.618], "st-georges-grenada": [12.05, -61.752], "roseau-dominica": [15.301, -61.388],
  juneau: [58.302, -134.42], ketchikan: [55.342, -131.647], skagway: [59.458, -135.314], sitka: [57.053, -135.33], "icy-strait-point": [58.129, -135.46], "victoria-bc": [48.416, -123.37],
  "cabo-san-lucas": [22.89, -109.916], "puerto-vallarta": [20.654, -105.239], mazatlan: [23.201, -106.421], ensenada: [31.86, -116.624], progreso: [21.282, -89.666],
  barcelona: [41.354, 2.165], "civitavecchia-rome": [42.093, 11.79], naples: [40.839, 14.259], "livorno-florence": [43.551, 10.301], marseille: [43.307, 5.367],
  "palma-de-mallorca": [39.566, 2.626], "piraeus-athens": [37.94, 23.634], santorini: [36.416, 25.433], mykonos: [37.45, 25.327], dubrovnik: [42.66, 18.086], valletta: [35.896, 14.512], lisbon: [38.71, -9.13],
  "yokohama-tokyo": [35.451, 139.646], osaka: [34.655, 135.43], kobe: [34.68, 135.19], nagasaki: [32.742, 129.87], fukuoka: [33.604, 130.398],
  busan: [35.104, 129.04], jeju: [33.514, 126.526], "hong-kong": [22.306, 114.191], singapore: [1.264, 103.82], "keelung-taipei": [25.132, 121.741],
  shanghai: [31.244, 121.493], "laem-chabang-bangkok": [13.083, 100.883], "phu-my-ho-chi-minh-city": [10.59, 107.03], "chan-may-hue-da-nang": [16.317, 107.99], "benoa-bali": [-8.75, 115.216], phuket: [7.828, 98.399],
};

function minutesFromTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(total: number) {
  const normalized = ((total % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${hours >= 12 ? "PM" : "AM"}`;
}

export function buildCruisePlan(input: PlannerInput): CruisePlan {
  const days = input.calls.map((call) => {
    const profile = portProfiles[call.port];
    const arrival = minutesFromTime(call.arrival);
    const allAboard = minutesFromTime(call.allAboard);
    const mobilityBuffer = input.mobility === "Standard walking" ? 0 : 15;
    const configuredShipMargin = profile.buffer + mobilityBuffer;
    const start = arrival + (input.mobility === "Wheelchair / step-free preferred" ? 45 : 30);
    const transfer = profile.transfer + (input.mobility === "Standard walking" ? 0 : 10);
    const returnLeadMinutes = Math.max(120, configuredShipMargin + transfer);
    const leaveForShipMinutes = allAboard - returnLeadMinutes;
    const returnTargetMinutes = leaveForShipMinutes + transfer;
    const bufferMinutes = allAboard - returnTargetMinutes;
    const available = leaveForShipMinutes - start;
    const impossibleWindow = returnTargetMinutes <= arrival || leaveForShipMinutes <= start;
    const [primary, secondary] = profile.activities[input.interest];
    const paceFactor = input.pace === "Relaxed" ? .84 : input.pace === "Active" ? 1.08 : 1;
    const primaryDuration = Math.max(70, Math.round(primary.duration * paceFactor / 5) * 5);
    const lunchDuration = input.pace === "Relaxed" ? 75 : 60;
    const stops: PlanStop[] = [];
    let cursor = start;
    let warning: string | null = null;

    if (impossibleWindow) {
      warning = "Unsafe port window: there is not enough time to preserve the configured return transfer and ship-side margin. Do not use this as a shore itinerary.";
      stops.push({ time: timeFromMinutes(arrival), place: "Remain ship-side", note: "Recheck the arrival and official all-aboard times with the cruise line", duration: 0 });
    } else if (available < 150 || available - transfer < 90) {
      warning = "Short port window after return travel and the protected ship-side margin: stay near the terminal and avoid a distant fixed-time booking.";
      stops.push({ time: timeFromMinutes(cursor), place: profile.pier, note: "Confirm the official all-aboard time and return point", duration: 25 });
      cursor += 25;
      const nearbyDuration = Math.max(0, leaveForShipMinutes - cursor);
      if (nearbyDuration >= 30) stops.push({ time: timeFromMinutes(cursor), place: "Pier-side highlights", note: "Use a flexible nearby walk, meal, or viewpoint", duration: nearbyDuration });
    } else {
      stops.push({ time: timeFromMinutes(cursor), place: profile.pier, note: `Exit the ship and allow about ${transfer} minutes for the first transfer`, duration: transfer });
      cursor += transfer;
      const usable = leaveForShipMinutes - cursor;
      const plannedLunch = usable >= 150 ? Math.min(lunchDuration, usable - 75) : 0;
      const safePrimary = Math.min(primaryDuration, usable - plannedLunch - 30);
      if (safePrimary >= 60) {
        stops.push({ ...primary, time: timeFromMinutes(cursor), duration: safePrimary });
        cursor += safePrimary;
      }
      if (plannedLunch >= 45) {
        stops.push({ time: timeFromMinutes(cursor), place: "Flexible local lunch", note: `Keep the stop on-route · ${input.budget} budget setting`, duration: plannedLunch });
        cursor += plannedLunch;
      }
      const remaining = leaveForShipMinutes - cursor;
      if (remaining >= 45 && input.pace !== "Relaxed") {
        const secondaryDuration = Math.min(secondary.duration, remaining);
        stops.push({ ...secondary, time: timeFromMinutes(cursor), note: `${secondary.note}; skip it if transport has slowed`, duration: secondaryDuration });
        cursor += secondaryDuration;
      }
    }

    if (!impossibleWindow) {
      stops.push({ time: timeFromMinutes(leaveForShipMinutes), place: "Return to the ship", note: `Allow about ${transfer} minutes for the return transfer`, duration: transfer });
      stops.push({ time: timeFromMinutes(returnTargetMinutes), place: "Back at the ship", note: `${bufferMinutes}-minute margin before the ${timeFromMinutes(allAboard)} all-aboard time`, duration: 0 });
    }
    if (!impossibleWindow && available < 90) warning = "Less than 90 minutes remain after reserving the return transfer and ship-side margin. Use only the immediate terminal area.";
    else if (!impossibleWindow && available < 240 && !warning) warning = "Compact port call: use one main experience and a flexible finish.";

    const matches = [...profile.excursions].sort((a, b) => Number(b.category === input.interest) - Number(a.category === input.interest));
    return {
      port: call.port, slug: profile.slug, country: profile.country, date: call.date || "", arrival: call.arrival, allAboard: call.allAboard,
      bufferMinutes, returnTarget: timeFromMinutes(Math.max(arrival, returnTargetMinutes)),
      title: input.interest === "Accessible highlights" ? "Lower-transition port day" : `${input.interest.replace(" + ", " & ")} port day`,
      cost: profile.cost[input.budget], warning, transport: profile.transport,
      backup: input.weather === "Rain likely" ? profile.rain : input.weather === "High heat" ? profile.heat : `If rain develops: ${profile.rain}`,
      mobilityNote: profile.mobility, stops, matches, viatorUrl: profile.viatorUrl,
    } satisfies PortDayPlan;
  });

  return {
    id: `${Date.now()}-${days.map((day) => day.slug).join("-")}`,
    createdAt: new Date().toISOString(),
    ship: input.ship.trim(), sailingDate: input.sailingDate, travelers: input.travelers, party: input.party,
    pace: input.pace, interest: input.interest, mobility: input.mobility, budget: input.budget, weather: input.weather, days,
  };
}

export function viatorLink(url: string) {
  const suffix = process.env.NEXT_PUBLIC_VIATOR_AFFILIATE_SUFFIX?.trim().replace(/^[?&]/, "");
  if (!suffix) return url;
  return `${url}${url.includes("?") ? "&" : "?"}${suffix}`;
}

export function encodePlan(plan: CruisePlan) {
  const input: PlannerInput = {
    ship: plan.ship, sailingDate: plan.sailingDate, travelers: plan.travelers, party: plan.party,
    pace: plan.pace, interest: plan.interest, mobility: plan.mobility, budget: plan.budget, weather: plan.weather,
    calls: plan.days.map((day) => ({ port: day.port, date: day.date, arrival: day.arrival, allAboard: day.allAboard })),
  };
  const json = JSON.stringify(input);
  if (typeof window === "undefined") return "";
  return window.btoa(encodeURIComponent(json)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function decodePlan(value: string): PlannerInput | null {
  try {
    const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
    return JSON.parse(decodeURIComponent(window.atob(padded))) as PlannerInput;
  } catch {
    return null;
  }
}

export function planAsText(plan: CruisePlan) {
  const heading = `PortdayGuide · ${plan.ship || "Cruise plan"}${plan.sailingDate ? ` · ${plan.sailingDate}` : ""}`;
  const days = plan.days.map((day) => {
    const stops = day.stops.map((stop) => `${stop.time} — ${stop.place}: ${stop.note}`).join("\n");
    return `${day.port}${day.date ? ` · ${day.date}` : ""}\n${stops}\nReturn target: ${day.returnTarget} (${day.bufferMinutes}-minute buffer)\nTransport: ${day.transport}\nWeather backup: ${day.backup}`;
  }).join("\n\n");
  return `${heading}\n${plan.travelers} travelers · ${plan.pace} · ${plan.interest}\n\n${days}\n\nVerify the official all-aboard time, pickup point, local conditions, opening hours, prices, accessibility, cancellation rules, and operator details before leaving the ship.`;
}
