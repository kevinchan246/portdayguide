import type { Metadata } from "next";
import { portProfiles, portRegions, profilesBySlug, type PortProfile, type PortRegion } from "@/lib/shorepath";

export const siteUrl = "https://portdayguide.com";

// Set each website page's social identity explicitly instead of inheriting
// the homepage's title, description and og:url from the root layout.
export function websiteMetadata(title: string, description: string, path: string): Metadata {
  const url = `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | PortdayGuide`, description, url, type: "website", siteName: "PortdayGuide" },
    twitter: { card: "summary", title, description },
  };
}

const canonicalPortAliases: Record<string, string> = {
  "george-town-grand-cayman": "grand-cayman",
};

export function canonicalPortSlug(slug: string) {
  return canonicalPortAliases[slug] || slug;
}

export function sourcePortSlug(slug: string) {
  return slug === "grand-cayman" ? "george-town-grand-cayman" : slug;
}

export function portPath(slug: string) {
  return `/ports/${canonicalPortSlug(slug)}`;
}

export const regionSeo: Record<PortRegion, {
  slug: string;
  title: string;
  description: string;
  intro: string;
  planningFocus: string[];
}> = {
  "Caribbean & Bahamas": {
    slug: "caribbean-bahamas",
    title: "Caribbean & Bahamas Cruise Port Guides",
    description: "Compare Caribbean and Bahamas cruise ports by terminal, transfer time, beach and water options, and a realistic return-to-ship margin.",
    intro: "Caribbean port days range from walk-out old towns to tender landings, reef boats, island-road transfers, and beach clubs. Start with the exact pier, then choose one geographic direction for the day.",
    planningFocus: ["Confirm whether the ship docks or tenders", "Compare beach, water, and island-road travel time", "Keep the final stop on a dependable route back to the ship"],
  },
  "Alaska & Pacific Northwest": {
    slug: "alaska-pacific-northwest",
    title: "Alaska & Pacific Northwest Cruise Port Guides",
    description: "Plan Alaska and Pacific Northwest cruise ports with dock details, wildlife and glacier options, weather fallbacks, and return timing.",
    intro: "Alaska and Pacific Northwest calls often pair an easy waterfront with a weather-sensitive wildlife, glacier, rail, or scenic excursion. Dock location and operator pickup can matter as much as distance.",
    planningFocus: ["Check the named dock and shuttle arrangement", "Choose a weather-aware primary experience", "Keep an indoor or town-based fallback available"],
  },
  "Mexican Pacific": {
    slug: "mexican-pacific",
    title: "Mexican Pacific Cruise Port Guides",
    description: "Explore Mexican Pacific cruise ports with tender and terminal details, realistic transfer times, top shore activities, and excursion options.",
    intro: "Mexican Pacific ports combine marina or tender arrivals with beaches, historic centers, coastal scenery, and longer inland options. The best route depends on how much transfer time the call can absorb.",
    planningFocus: ["Allow for tender or terminal exit time", "Pick one coast, town, or inland direction", "Reserve extra return time for road and marina congestion"],
  },
  "Mediterranean & Atlantic": {
    slug: "mediterranean-atlantic",
    title: "Mediterranean & Atlantic Cruise Port Guides",
    description: "Compare Mediterranean and Atlantic cruise ports, city transfers, timed-entry sights, shore excursions, and safe return plans.",
    intro: "Mediterranean and Atlantic calls can be walkable city days or long gateway transfers to famous destinations. Timed admission, terminal shuttles, and the distance back to the ship determine what actually fits.",
    planningFocus: ["Separate the port city from a distant gateway destination", "Book only one time-critical anchor", "Place the final stop on the return route"],
  },
  Asia: {
    slug: "asia",
    title: "Asia Cruise Port Guides",
    description: "Plan Asia cruise ports with exact terminal details, city transfer choices, language and payment tips, live tours, and return buffers.",
    intro: "Asia cruise terminals can sit beside efficient transit or far outside the headline city. Save the terminal name in the local language, confirm the first-mile route, and avoid treating every gateway port as a city-center arrival.",
    planningFocus: ["Identify the exact terminal before choosing transport", "Save addresses and pickup instructions offline", "Compare a city day with a closer regional alternative"],
  },
};

export const regionBySlug = Object.fromEntries(
  portRegions.map((region) => [regionSeo[region].slug, region]),
) as Record<string, PortRegion>;

export function regionPath(region: PortRegion) {
  return `/ports/regions/${regionSeo[region].slug}`;
}

export function portGuideTitle(profile: PortProfile) {
  if (profile.slug === "cozumel") {
    return "Cozumel Cruise Port Guide: Terminals, Transport & Excursions";
  }
  const detail = profile.name.length > 12 ? "Cruise Port Guide" : "Cruise Port Guide: Things to Do";
  return `${profile.name} ${detail}`;
}

export function portGuideDescription(profile: PortProfile) {
  if (profile.slug === "cozumel") {
    return "Docking in Cozumel? Find your cruise terminal (Punta Langosta, International Pier or Puerta Maya), compare transport options, plan Chankanaab and top excursions, and use 6- and 8-hour itineraries with a safe return buffer.";
  }
  return `Plan ${profile.name} from the correct cruise terminal, with realistic transfer timing, top things to do, shore excursions, and a safe return margin.`;
}

export function portQuickAnswer(profile: PortProfile) {
  if (profile.slug === "osaka") return `Confirm whether your ship uses Tempozan, then choose Osaka Castle, Dotonbori or Shinsekai as your main city area. Each is a city journey, and moving between them takes additional time. The examples reserve ${profile.transfer} minutes each way as an editorial city-transfer allowance and at least ${profile.buffer} minutes ship-side; verify the actual route, and use a separate intercity plan for Kyoto.`;
  return `Confirm your berth or landing within ${profile.pier} before choosing a route. Compare ${profile.highlights[0]} with ${profile.highlights[1]} as alternative main experiences. The examples reserve ${profile.transfer} minutes each way as an editorial transfer allowance plus at least ${profile.buffer} minutes ship-side before official all-aboard. Check the actual journey, pickup and waiting time, and increase these allowances when your route needs more time.`;
}

export function portFaq(profile: PortProfile) {
  if (profile.slug === "cozumel") {
    return [
      {
        question: "Is Cozumel cruise port walkable?",
        answer: "Sometimes. Walkability depends on your terminal. Punta Langosta is usually the most practical pier for a quick downtown San Miguel walk; International Pier and Puerta Maya generally require a taxi or shuttle for most plans.",
      },
      {
        question: "What is the best thing to do in Cozumel on a cruise day?",
        answer: "Compare a Chankanaab visit with a downtown San Miguel plan using your exact pier, admission conditions, interests and usable time. Choose one main experience, and add another stop only when it fits the same route and protects the return margin.",
      },
      {
        question: "How early should I return to the ship in Cozumel?",
        answer: "The examples reserve a return lead of at least 120 minutes before official all-aboard, including a provisional 25-minute transfer allowance and time at the terminal. This is an editorial planning margin, not a live journey estimate. Verify your destination-to-pier route and leave earlier for traffic, taxi lines, security or other delays.",
      },
      {
        question: "What if the weather changes in Cozumel?",
        answer: "Replace a long outdoor or water block with a shorter covered plan near San Miguel, such as a museum, food stop, or shopping, and keep the return simple from your confirmed cruise terminal.",
      },
    ];
  }
  const walkable = /tender/i.test(profile.pier)
      ? `${profile.name} includes a tender step, so the usable start time depends on when you get ashore. Do not attach a fixed pickup to the ship's scheduled arrival time without checking the operator's instructions.`
      : `Walkability depends on the exact berth within ${profile.pier}, the public terminal exit and your chosen destination. Confirm the permitted walking route and distance; the transfer allowance in this guide is not evidence that a sight is walkable.`;
  return [
    {
      question: `Is ${profile.name} cruise port walkable?`,
      answer: walkable,
    },
    {
      question: `What is the best thing to do in ${profile.name} on a cruise day?`,
      answer: profile.slug === "osaka" ? "Choose Osaka Castle for a castle-focused visit, or Dotonbori or Shinsekai for a food-focused city day. Treat these as alternative main areas; a second area requires another journey. Kyoto needs a separate longer-day plan and is not included in the Osaka city examples." : `Compare ${profile.highlights[0]} and ${profile.highlights[1]} against your interests, actual berth-to-destination route, admission conditions and usable time. Choose one as the main experience; a second stop should fit the same route and leave the return margin intact.`,
    },
    {
      question: `How early should I return to the ship in ${profile.name}?`,
      answer: `The examples reserve at least ${Math.max(120, profile.buffer + profile.transfer)} minutes before official all-aboard for the return, including ${profile.transfer} minutes as an editorial transfer allowance and at least ${profile.buffer} minutes ship-side. Verify the actual ride, waiting, terminal access and any tender step. Use an earlier return when those take longer or when traffic, weather or mobility needs add uncertainty.`,
    },
    {
      question: `What if the weather changes in ${profile.name}?`,
      answer: profile.rain,
    },
  ];
}

export function relatedPorts(profile: PortProfile, limit = 4) {
  return Object.values(portProfiles)
    .filter((candidate) => candidate.slug !== profile.slug)
    .map((candidate) => ({
      profile: candidate,
      score: (candidate.region === profile.region ? 100 : 0)
        + (candidate.country === profile.country ? 30 : 0)
        - Math.abs(candidate.transfer - profile.transfer),
    }))
    .sort((a, b) => b.score - a.score || a.profile.name.localeCompare(b.profile.name))
    .slice(0, limit)
    .map(({ profile: candidate }) => candidate);
}

export function portAbsoluteUrl(slug: string) {
  return `${siteUrl}${portPath(profilesBySlug[sourcePortSlug(slug)].slug)}`;
}
