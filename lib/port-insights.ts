import type { PortProfile } from "@/lib/shorepath";

export type InsightSource = { label: string; url: string };
export type TransportChoice = {
  icon: string;
  label: string;
  bestFor: string;
  reality: string;
  risk: "Lowest friction" | "Moderate friction" | "Highest commitment";
};

export type PortInsight = {
  mode: string;
  summary: string;
  bestFor: string;
  friction: string;
  fallback: string;
  travelerThemes: string[];
  sources: InsightSource[];
  sourceCheckedLabel?: string;
  transportChoices: TransportChoice[];
};

type CuratedInsight = Pick<PortInsight, "mode" | "summary" | "travelerThemes" | "sources" | "sourceCheckedLabel">;

const curatedInsights: Record<string, CuratedInsight> = {
  fukuoka: {
    mode: "Confirm Chuo or Hakozaki before choosing the city route",
    summary: "Fukuoka City's cruise guide lists cruise berths at Chuo Wharf and Hakozaki Wharf. Chuo Wharf Cruise Center and Hakata Port International Terminal are separate facilities; the latter is a nearby bus-stop reference, not a substitute for the ship's assigned cruise berth.",
    travelerThemes: [
      "Use the cruise line's assigned wharf and berth for taxi pickup and the return address.",
      "For Chuo Wharf, the terminal operator distinguishes the cruise center from the international ferry terminal and its bus stop.",
      "Plan Dazaifu as a separate destination from a central Fukuoka stop; confirm both journeys before combining them.",
    ],
    sources: [
      { label: "Fukuoka City: cruise berths", url: "https://www.city.fukuoka.lg.jp/kowan/k-kikaku/hakata-port/e-cruise.html" },
      { label: "Japan Tourism Agency: Hakata port access", url: "https://www.mlit.go.jp/kankocho/cruise/detail/055/index.html" },
      { label: "Chuo Wharf Cruise Center: access", url: "https://hakataport.com/center/" },
    ],
    sourceCheckedLabel: "October 7, 2026",
  },
  busan: {
    mode: "North Port and Yeongdo are different starting points",
    summary: "Busan City's transport guide lists the North Port Cruise Terminal beside the international passenger terminal area and a separate Yeongdo Cruise Terminal near the National Maritime Museum. Confirm which one your ship uses before selecting a station, city route or excursion meeting point.",
    travelerThemes: [
      "Do not use the international ferry terminal's address as the default for every cruise ship.",
      "North Port and Yeongdo require different first-mile and return routes.",
      "Choose one main area from Gamcheon, Jagalchi, Haeundae or Haedong Yonggungsa and confirm transport for the complete route.",
    ],
    sources: [{ label: "Busan City: passenger and cruise terminals", url: "https://www.busan.go.kr/eng/public-transportation" }],
    sourceCheckedLabel: "October 7, 2026",
  },
  "puerto-plata": {
    mode: "City sights or a separate nature outing",
    summary: "Choose a city route around Fortaleza San Felipe, Umbrella Street and the Malecón, or a separate Damajagua outing with its own transport plan. The government announced the start of cable-car reconstruction on October 3, 2026; do not build a port day around a cable-car ride without an official reopening confirmation.",
    travelerThemes: [
      "Taíno Bay and Amber Cove need different pickup and return addresses.",
      "The Malecón is a city waterfront option; choose the stretch that fits your transport and time ashore.",
      "A listing or old destination guide mentioning the cable car does not establish that rides are operating during reconstruction.",
    ],
    sources: [
      { label: "Dominican Presidency: cable-car reconstruction", url: "https://presidencia.gob.do/noticias/gobierno-inicia-remozamiento-integral-del-teleferico-de-puerto-plata" },
      { label: "Dominican Republic Tourism: Puerto Plata Malecón", url: "https://www.godominicanrepublic.com/things-to-do/malecon-de-puerto-plata" },
    ],
    sourceCheckedLabel: "October 7, 2026",
  },
  "amber-cove": {
    mode: "Confirm the full route from Amber Cove",
    summary: "Choose Puerto Plata city sights or one nature outing, then confirm the complete drive back to Amber Cove. A Mount Isabel de Torres excursion must specify its actual access: the government announced cable-car reconstruction on October 3, 2026, so an old cable-car description is not evidence that rides are operating.",
    travelerThemes: [
      "Use Amber Cove as the pickup and return address, rather than a generic Puerto Plata meeting point.",
      "Check the route, physical demands and weather conditions for Damajagua before choosing it.",
      "For Isabel de Torres, confirm the operator's actual transport and current access; do not assume a cable-car ride is included or running.",
    ],
    sources: [{ label: "Dominican Presidency: cable-car reconstruction", url: "https://presidencia.gob.do/noticias/gobierno-inicia-remozamiento-integral-del-teleferico-de-puerto-plata" }],
    sourceCheckedLabel: "October 7, 2026",
  },
  juneau: {
    mode: "Easy downtown, excursion-dependent beyond it",
    summary: "Public cruiser discussions consistently praise Juneau for an easy downtown arrival from the central berths, whale watching, and Mendenhall Glacier. The recurring cautions are the extra shuttle or walk from AJ Dock, weather-sensitive views, and combination tours that can feel rushed when they try to fit both glacier and whales into one block.",
    travelerThemes: [
      "Downtown is genuinely walkable from most central docks; AJ Dock changes the first and final mile.",
      "Mendenhall is a strong first-time choice, but dedicated shuttles or taxis are far more practical for a port call than the local bus.",
      "Whale watching earns enthusiastic feedback; travelers are more divided on tight glacier-and-whale combinations because each stop can feel shortened.",
    ],
    sources: [
      { label: "Travel Juneau: getting around", url: "https://www.traveljuneau.com/plan-your-trip/" },
      { label: "Cruise Critic: Juneau member reviews", url: "https://www.cruisecritic.com/find-a-cruise/port-juneau-alaska" },
      { label: "Travel Juneau: cruise-ship calendar", url: "https://www.traveljuneau.com/plan-your-trip/maps-and-travel-tools/cruiseship-calendar/" },
    ],
  },
  cozumel: {
    mode: "Water-first island with three cruise piers",
    summary: "Traveler feedback is strongest around Cozumel's reefs, snorkeling, and dive experiences. A common mismatch is expecting a broad walk-off sandy beach at every pier: the island is better known for clear water and marine life, while the right taxi plan depends on which of the three cruise piers your ship uses.",
    travelerThemes: [
      "Reef and snorkel experiences are the clearest crowd favorite.",
      "Beach clubs are convenient but can feel commercial on busy multi-ship days.",
      "San Miguel is an easy add-on only when the confirmed pier and return taxi time support it.",
    ],
    sources: [
      { label: "Cruise Critic: Cozumel port overview", url: "https://www.cruisecritic.com/find-a-cruise/port-cozumel" },
      { label: "Mexico Caribbean: Cozumel destination guide", url: "https://mexicancaribbean.travel/destination/cozumel/" },
    ],
  },
  nassau: {
    mode: "Walkable first-time port with a busy commercial edge",
    summary: "Cruiser reviews commonly describe Nassau as easy to navigate for a first visit, with affordable beach and downtown options. The repeated downside is crowding and a commercial feel around the port, so the best day usually commits to either downtown, one beach, or one boat trip instead of sampling all three.",
    travelerThemes: [
      "The new port area and downtown are straightforward for independent visitors.",
      "Junkanoo Beach is convenient; farther beaches trade convenience for a calmer setting.",
      "Boat and island trips need a clearly documented return rather than a last-minute add-on.",
    ],
    sources: [
      { label: "Cruise Critic: Nassau member reviews", url: "https://www.cruisecritic.com/find-a-cruise/port-nassau-bahamas" },
    ],
  },
  barcelona: {
    mode: "Major city day with a port-to-city first mile",
    summary: "Travelers overwhelmingly value Barcelona's architecture and walkable historic districts once they reach the city. The port-day friction is not the sightseeing itself but the transfer from Moll Adossat, timed-entry attractions, crowds, and the temptation to combine too many neighborhoods in one call.",
    travelerThemes: [
      "Sagrada Família is the recurring first-time highlight and rewards a timed reservation.",
      "The Gothic Quarter works well as a flexible second block after one booked anchor.",
      "A city shuttle, taxi, or booked pickup is usually more realistic than treating every berth as a walk-out terminal.",
    ],
    sources: [
      { label: "Cruise Critic: Barcelona member reviews", url: "https://www.cruisecritic.com/find-a-cruise/port-barcelona" },
    ],
  },
  singapore: {
    mode: "Efficient city port—after the terminal is identified",
    summary: "Cruiser feedback repeatedly praises Singapore for safety, cleanliness, food, and an easy-to-use city once ashore. The practical mistake is treating Marina Bay Cruise Centre and HarbourFront as the same starting point; they connect to different transit stations and produce different first-mile routes.",
    travelerThemes: [
      "Independent sightseeing is unusually workable for a large Asian city port.",
      "Food neighborhoods and the Marina Bay area receive consistently strong feedback.",
      "Heat and humidity make a shorter outdoor route with an indoor midday block more comfortable.",
    ],
    sources: [
      { label: "Cruise Critic: Singapore member reviews", url: "https://www.cruisecritic.com/find-a-cruise/port-singapore" },
    ],
  },
};

function genericMode(profile: PortProfile) {
  if (/tender/i.test(profile.pier)) return "A tender-sensitive day with a flexible start";
  if (profile.transfer >= 60) return "Choose the destination after checking the complete transfer";
  if (/\bor\b|,/.test(profile.pier)) return "A straightforward day only after the berth is confirmed";
  if (profile.transfer <= 25) return "Confirm the route from the berth before choosing a nearby day";
  return "One chosen area with return transport arranged";
}

function genericSummary(profile: PortProfile) {
  const [primary, secondary] = profile.highlights;
  if (/tender/i.test(profile.pier)) return `Compare ${primary} and ${secondary} after allowing for the tender process. Keep any second stop flexible and confirm the last tender with the ship before committing to a fixed pickup.`;
  if (profile.transfer >= 60) return `Compare the complete journey to ${primary} with a shorter local plan. The examples reserve ${profile.transfer} minutes each way as an editorial allowance; obtain a route-specific estimate before choosing one distant destination.`;
  if (profile.transfer <= 25) return `Compare ${primary} with ${secondary} from your assigned berth. A short allowance in the planning model does not establish that either attraction is walkable or that every pickup is nearby.`;
  return `Compare ${primary} and ${secondary} as different directions. Check opening hours, admission and the complete transport route before selecting one main area and an optional stop on the way back.`;
}

function travelerThemes(profile: PortProfile) {
  const [primary, secondary, third] = profile.highlights;
  const tender = /tender/i.test(profile.pier);
  const transferIssue = profile.transfer >= 60
    ? `The approximately ${profile.transfer}-minute planning transfer is the main trade-off; a late departure can erase the optional stop.`
    : tender
      ? "Tender queues—not distance alone—are the main source of timing uncertainty."
      : `The practical friction is matching pickup and return transport to ${profile.pier}.`;
  return [
    `Choose between ${primary} and ${secondary} after checking their location, opening hours and full return route.`,
    transferIssue,
    `${third} is worth adding only when it stays on the same route and does not reduce the protected return margin.`,
  ];
}

function transportChoices(profile: PortProfile): TransportChoice[] {
  const [primary] = profile.highlights;
  const tender = /tender/i.test(profile.pier);
  const distant = profile.transfer >= 60;
  return [
    {
      icon: tender ? "≈" : "↟",
      label: tender ? "Tender + nearby route" : distant ? "Port shuttle / local area" : "Walk / port shuttle",
      bestFor: "A terminal-area route with confirmed pedestrian access",
      reality: tender
        ? "Wait until you are ashore before trusting the day's start time; keep the first booking flexible."
        : distant
          ? "Use this when the full transfer to the headline destination would consume too much of the call."
          : "Check the actual walking route and any shuttle destination first. A named highlight is not necessarily within walking distance of your berth.",
      risk: "Lowest friction",
    },
    {
      icon: "↗",
      label: "Taxi / private transfer",
      bestFor: `${primary} with control over the return`,
      reality: `${profile.transport} Save the vehicle details and return meeting point before moving on.`,
      risk: "Moderate friction",
    },
    {
      icon: "◎",
      label: "Prebooked shore excursion",
      bestFor: `A fixed-time ${primary} experience`,
      reality: `Use a listing that states the meeting point, total duration, cancellation terms, and complete return plan. “Port pickup” does not automatically mean pickup at every berth.`,
      risk: "Highest commitment",
    },
  ];
}

export function portInsight(profile: PortProfile): PortInsight {
  if (profile.slug === "osaka") return {
    mode: "Choose one city area after confirming the berth",
    summary: "Choose Osaka Castle, Dotonbori or Shinsekai. Combining areas adds city travel; Kyoto needs a separate intercity plan.",
    bestFor: "One main city area: Osaka Castle, Dotonbori or Shinsekai.",
    friction: "Station access, transfers and meeting-point travel need additional time.",
    fallback: "Choose a covered stop nearby. Recheck opening hours and return transport.",
    travelerThemes: [
      "Choose the castle or one food district; moving between them requires another journey.",
      "Tempozan routes use Osakako station. Other berths need different access; do not assume a shuttle or pickup is included.",
      "A short Kyoto activity does not account for the intercity round trip from Osaka.",
    ],
    sources: [
      { label: "Japan Tourism Agency: Osaka port access", url: "https://www.mlit.go.jp/kankocho/cruise/detail/029/index.html" },
      { label: "Osaka Metro: route map", url: "https://subway.osakametro.co.jp/en/guide/routemap.php" },
    ],
    transportChoices: [
      {
        icon: "↟",
        label: "Stay near the confirmed terminal",
        bestFor: "A shorter local plan with fewer transport changes",
        reality: "Ask the ship about pedestrian exits and nearby options. Dotonbori and the castle require city transport; a port shuttle is not assumed.",
        risk: "Lowest friction",
      },
      {
        icon: "↗",
        label: "Metro or arranged city transfer",
        bestFor: "One chosen city area",
        reality: "Use the Osakako routes below or arrange a licensed taxi or private transfer. Include station access, changes and walking; confirm your berth and return arrangement.",
        risk: "Moderate friction",
      },
      {
        icon: "◎",
        label: "Prebooked city experience",
        bestFor: "A guided visit that fits the remaining activity time",
        reality: "Check maximum duration, start time and meeting point. Arrange city transport unless your berth pickup is explicitly included. Plan Kyoto separately.",
        risk: "Highest commitment",
      },
    ],
  };
  const curated = curatedInsights[profile.slug];
  const [primary, secondary] = profile.highlights;
  return {
    mode: curated?.mode || genericMode(profile),
    summary: curated?.summary || genericSummary(profile),
    bestFor: `One chosen area, comparing ${primary} with ${secondary}.`,
    friction: /tender/i.test(profile.pier)
      ? "Tender timing can compress the start and return."
      : profile.transfer >= 60
        ? `About ${profile.transfer} minutes of planning transfer in each direction.`
        : `Pickup and return depend on the exact berth within ${profile.pier}.`,
    fallback: profile.rain,
    travelerThemes: curated?.travelerThemes || travelerThemes(profile),
    sources: curated?.sources || [],
    sourceCheckedLabel: curated?.sourceCheckedLabel,
    transportChoices: transportChoices(profile),
  };
}
