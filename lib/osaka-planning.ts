// These are the editorial allowances used by the Osaka guide, not live journey times.
export const osakaPlanning = {
  transferMinutes: 55,
  shipSideMinutes: 150,
  reviewed: "2026-09-22",
};

export function osakaActivityMinutes(callHours: number) {
  return Math.max(0, callHours * 60 - 2 * osakaPlanning.transferMinutes - osakaPlanning.shipSideMinutes);
}

/** Read only a complete, bounded duration. Unstructured text must not imply a fit. */
export function osakaMaximumDurationMinutes(duration: string): number | null {
  const text = duration.trim().toLowerCase().replace(/[–—]/g, "-").replace(/\s+to\s+/g, "-");
  const number = "(\\d+(?:\\.\\d+)?)";
  const hour = "(?:hours?|hrs?|h)";
  const minute = "(?:minutes?|mins?|m)";
  const simple = new RegExp(`^${number}\\s*(${hour}|${minute})$`);
  const combined = new RegExp(`^${number}\\s*${hour}\\s+${number}\\s*${minute}$`);

  function fixed(value: string) {
    const both = value.match(combined);
    if (both) return Number(both[1]) * 60 + Number(both[2]);
    const one = value.match(simple);
    if (!one) return null;
    return Number(one[1]) * (one[2].startsWith("h") ? 60 : 1);
  }

  const parts = text.split(/\s*-\s*/);
  if (parts.length === 1) {
    const value = fixed(parts[0]);
    return value !== null && value > 0 ? value : null;
  }
  if (parts.length !== 2) return null;
  // Also accept shared-unit ranges, such as 5-7 hours, without assuming units otherwise.
  const right = fixed(parts[1]);
  const rightSimple = parts[1].match(simple);
  const left = /^\d+(?:\.\d+)?$/.test(parts[0]) && rightSimple
    ? Number(parts[0]) * (rightSimple[2].startsWith("h") ? 60 : 1)
    : fixed(parts[0]);
  if (left === null || right === null || left <= 0 || right < left) return null;
  return right;
}

type ExcursionTiming = {
  status: "short-city" | "eight-hour-city" | "long-call" | "unconfirmed" | "separate-city";
  label: string;
  note: string;
};

export function osakaExcursionTiming(highlight: string, duration: string): ExcursionTiming {
  if (highlight.trim().toLowerCase() === "kyoto") return {
    status: "separate-city",
    label: "Kyoto · separate travel plan",
    note: "This is a Kyoto experience, not a verified Osaka-port round trip. Confirm the exact meeting point and whether Osaka berth pickup and return are included. It is not part of our 6- or 8-hour Osaka city plans.",
  };
  const maximum = osakaMaximumDurationMinutes(duration);
  if (maximum === null) return {
    status: "unconfirmed",
    label: "Confirm full duration",
    note: "We cannot match the listed duration to the port-day allowance. Confirm the full start-to-finish time, meeting point and both transfers before choosing this option.",
  };
  if (maximum > osakaActivityMinutes(8)) return {
    status: "long-call",
    label: "Longer port call only",
    note: "The listed duration exceeds the 3h 40m activity allowance in our 8-hour example. Consider it only with a separately verified longer schedule, including travel to the meeting point and return to the ship.",
  };
  if (maximum > osakaActivityMinutes(6)) return {
    status: "eight-hour-city",
    label: "Compare for an 8-hour call",
    note: "The listed duration fits the 8-hour example's activity allowance, but exceeds the 6-hour version. Confirm the start time and exact meeting point; port pickup is not assumed, and transfers or check-in may need more time.",
  };
  return {
    status: "short-city",
    label: "Shorter city experience",
    note: "The listed duration is within both example activity allowances. Confirm the start time, exact meeting point, check-in and round-trip travel; a short activity alone does not guarantee a workable port day.",
  };
}

export type OsakaIndependentPlan = {
  priority: string;
  note: string;
  route: string;
  linkLabel: string;
  href: string;
};

export const osakaIndependentPlans: Record<string, OsakaIndependentPlan> = {
  "Osaka Castle": {
    priority: "One main city stop",
    note: "Choose the castle park and tower as your main stop. A short guided visit can add context, but reserve time for the walk through the grounds and any entry queue. Dotonbori is a separate city journey, not an automatic add-on.",
    route: "From Osakako (C11), take the Chuo Line to Morinomiya (C19), then walk through the park. The castle's official access guide lists exits 1 and 3-B. Reverse the route to Osakako for Tempozan.",
    linkLabel: "Castle access and park maps",
    href: "https://www.osakacastle.net/access/",
  },
  Dotonbori: {
    priority: "Food and city atmosphere",
    note: "Make Namba and Dotonbori your main area for a food-focused day. A compact food walk can be useful if its start time works; check which meals are included and whether you must reach a city meeting point yourself.",
    route: "From Osakako, take the Chuo Line to Hommachi. Change to the Midosuji Line for Namba, then follow the local walking route to Dotonbori. Return via Hommachi and Osakako; save the station route before leaving the terminal.",
    linkLabel: "Official Dotonbori visitor guide",
    href: "https://osaka-info.jp/en/spot/dotonbori/",
  },
  Kyoto: {
    priority: "Separate longer-day choice",
    note: "Kyoto is a separate-city outing. Do not combine it with the Osaka city examples below. A tea ceremony or walking tour that starts in Kyoto does not, by itself, provide transport from your Osaka berth.",
    route: "Build a complete berth-to-venue-and-back itinerary before buying a Kyoto activity. Include the Osaka local connection, intercity trains or road transfer, travel within Kyoto, and the ship-side margin. Use the official Kyoto access guide to choose the intercity route.",
    linkLabel: "Official Kyoto access options",
    href: "https://kyoto.travel/en/getting-to",
  },
  Shinsekai: {
    priority: "Alternative food district",
    note: "Choose Shinsekai instead of another food district if you want the Tsutenkaku area and a neighborhood meal. A guided food walk should replace the independent food stop; it should not be stacked onto a full castle-and-Dotonbori day.",
    route: "From Osakako, take the Chuo Line to Sakaisuji-Hommachi. Change to the Sakaisuji Line for Ebisucho, beside Shinsekai. Return along the same two lines to Osakako. Check individual restaurant and attraction opening times.",
    linkLabel: "Official Shinsekai visitor guide",
    href: "https://osaka-info.jp/en/spot/shinsekai/",
  },
};
