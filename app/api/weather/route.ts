import { portCoordinates, profilesBySlug } from "@/lib/shorepath";

type MetEntry = {
  time: string;
  data: {
    instant?: { details?: { air_temperature?: number; wind_speed?: number } };
    next_1_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
    next_6_hours?: { summary?: { symbol_code?: string }; details?: { precipitation_amount?: number } };
  };
};

function forecastSummary(symbol = "") {
  if (symbol.includes("thunder")) return "Thunderstorms possible";
  if (symbol.includes("snow") || symbol.includes("sleet")) return "Wintry weather possible";
  if (symbol.includes("rain")) return "Rain possible";
  if (symbol.includes("fog")) return "Fog possible";
  if (symbol.includes("cloudy")) return "Cloudy";
  if (symbol.includes("fair")) return "Partly clear";
  return "Mostly clear";
}

function daysFromToday(date: string) {
  const today = new Date();
  const start = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const target = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(target) ? Math.round((target - start) / 86_400_000) : Number.NaN;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("port") || "";
  const date = url.searchParams.get("date") || "";
  const profile = profilesBySlug[slug];
  const coordinates = portCoordinates[slug];
  const horizon = daysFromToday(date);

  if (!profile || !coordinates || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ error: "Invalid port or date." }, { status: 400 });
  if (horizon < 0 || horizon > 9) return Response.json({ available: false, reason: "Forecasts appear when the port date is within nine days." });

  const [lat, lon] = coordinates;
  const endpoint = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`;
  try {
    const response = await fetch(endpoint, {
      headers: { "User-Agent": "PortdayGuide/1.0 https://portdayguide.com" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Weather provider returned ${response.status}`);
    const payload = await response.json() as { properties?: { timeseries?: MetEntry[] } };
    const entries = (payload.properties?.timeseries || []).filter((entry) => entry.time.startsWith(date));
    if (!entries.length) return Response.json({ available: false, reason: "The forecast is not available for this date yet." });

    const temperatures = entries.map((entry) => entry.data.instant?.details?.air_temperature).filter((value): value is number => typeof value === "number");
    const winds = entries.map((entry) => entry.data.instant?.details?.wind_speed).filter((value): value is number => typeof value === "number");
    const precipitationMm = entries.reduce((sum, entry) => sum + (entry.data.next_1_hours?.details?.precipitation_amount || 0), 0);
    const symbols = entries.map((entry) => entry.data.next_1_hours?.summary?.symbol_code || entry.data.next_6_hours?.summary?.symbol_code || "");
    const symbol = symbols.find((item) => /thunder|rain|snow|sleet/.test(item)) || symbols.find(Boolean) || "";
    const lowC = Math.round(Math.min(...temperatures));
    const highC = Math.round(Math.max(...temperatures));
    const windKph = Math.round(Math.max(...winds) * 3.6);
    const summary = forecastSummary(symbol);
    const planNote = precipitationMm >= 5 || /Rain|Thunder/.test(summary)
      ? "Favor covered stops and keep the last outdoor block optional."
      : windKph >= 35
        ? "Check small-boat and tender operations before committing to a water tour."
        : highC >= 32
          ? "Put the longest outdoor stop first and protect a shaded midday break."
          : lowC <= 5
            ? "Add warm layers and choose transport with a sheltered fallback."
            : "Conditions currently support the planned route; recheck before leaving the ship.";

    return Response.json({ available: true, forecast: { date, summary, lowC, highC, windKph, precipitationMm: Math.round(precipitationMm * 10) / 10, planNote }, source: "MET Norway" }, { headers: { "Cache-Control": "public, max-age=1800, s-maxage=3600", "Netlify-Vary": "query" } });
  } catch {
    return Response.json({ available: false, reason: "Weather is temporarily unavailable; the port plan still works without it." }, { status: 503 });
  }
}
