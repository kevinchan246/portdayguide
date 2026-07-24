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
  transportChoices: TransportChoice[];
};

type CuratedInsight = Pick<PortInsight, "mode" | "summary" | "travelerThemes" | "sources">;

const curatedInsights: Record<string, CuratedInsight> = {
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
  if (profile.transfer >= 60) return "A destination day with serious road time";
  if (/\bor\b|,/.test(profile.pier)) return "A straightforward day only after the berth is confirmed";
  if (profile.transfer <= 25) return "A relatively easy port to explore independently";
  return "A one-direction day, not a sightseeing checklist";
}

function genericSummary(profile: PortProfile) {
  const [primary, secondary] = profile.highlights;
  if (/tender/i.test(profile.pier)) return `${primary} is the strongest main anchor, but the usable day can shrink while tenders load and unload. Keep ${secondary} as a flexible second block and do not attach a fixed pickup to an optimistic arrival time.`;
  if (profile.transfer >= 60) return `${primary} can justify the journey, but a typical transfer of about ${profile.transfer} minutes each way makes this a transport-led port day. Choose one distant destination and treat everything else as optional.`;
  if (profile.transfer <= 25) return `${secondary} is the simplest independent option, while ${primary} works better as the day's one booked anchor. This is one of the easier ports in the directory as long as the exact berth and return pickup remain clear.`;
  return `${primary} and ${secondary} are both viable, but they should compete for the main block rather than be forced into one route. The best plan chooses one direction and keeps the final stop on the return path.`;
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
    `${primary} is the clearest first-time anchor; ${secondary} is the more flexible alternative.`,
    transferIssue,
    `${third} is worth adding only when it stays on the same route and does not reduce the protected return margin.`,
  ];
}

function transportChoices(profile: PortProfile): TransportChoice[] {
  const [primary, secondary] = profile.highlights;
  const tender = /tender/i.test(profile.pier);
  const distant = profile.transfer >= 60;
  return [
    {
      icon: tender ? "≈" : "↟",
      label: tender ? "Tender + nearby route" : distant ? "Port shuttle / local area" : "Walk / port shuttle",
      bestFor: distant ? "A lower-risk port-area day" : `${secondary} and nearby sights`,
      reality: tender
        ? "Wait until you are ashore before trusting the day's start time; keep the first booking flexible."
        : distant
          ? "Use this when the full transfer to the headline destination would consume too much of the call."
          : `Usually the least complicated choice when ${secondary} is close to the confirmed berth.`,
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
  const curated = curatedInsights[profile.slug];
  const [primary, secondary] = profile.highlights;
  return {
    mode: curated?.mode || genericMode(profile),
    summary: curated?.summary || genericSummary(profile),
    bestFor: `${primary} as the main experience, with ${secondary} kept flexible.`,
    friction: /tender/i.test(profile.pier)
      ? "Tender timing can compress the start and return."
      : profile.transfer >= 60
        ? `About ${profile.transfer} minutes of planning transfer in each direction.`
        : `Pickup and return depend on the exact berth within ${profile.pier}.`,
    fallback: profile.rain,
    travelerThemes: curated?.travelerThemes || travelerThemes(profile),
    sources: curated?.sources || [],
    transportChoices: transportChoices(profile),
  };
}
