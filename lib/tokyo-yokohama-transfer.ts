type TransferSummary = { title: string; description: string };

// Require a stated direction, rather than treating two place names as a route.
const tokyoOrigin = String.raw`(?:(?:central |downtown )?tokyo(?: city)?(?: hotels?)?|(?:your |a |any )?hotels?(?: in| within)? (?:central |downtown )?tokyo(?: city)?)`;
const yokohamaPort = String.raw`(?:yokohama(?: (?:osanbashi|osambashi|shinko|daikoku))?(?: cruise)?(?: passenger)? (?:port|terminal|pier)|(?:cruise )?port (?:in|of) yokohama)`;
const routeTo = (from: string, to: string) => new RegExp(String.raw`\b${from}\s+(?:(?:and )?(?:private )?transfers?\s+)?(?:directly )?to\s+(?:the )?${to}\b`);
const routeFrom = (to: string, from: string) => new RegExp(String.raw`\b${to}\s+(?:(?:private |departure )?transfers?\s+)?from\s+(?:your )?${from}\b`);
const forward = [routeTo(tokyoOrigin, yokohamaPort), routeFrom(yokohamaPort, tokyoOrigin)];
const reverse = [routeTo(yokohamaPort, tokyoOrigin), routeFrom(tokyoOrigin, yokohamaPort)];
const pickupToPort = new RegExp(String.raw`\b(?:pick up|pickup|collection) (?:at|from) (?:your )?${tokyoOrigin}\b[^.!?;]{0,80}\b(?:drop off|dropoff) (?:at|in) (?:the )?${yokohamaPort}\b`);
const pickupFromPort = new RegExp(String.raw`\b(?:pick up|pickup|collection) (?:at|from) (?:the )?${yokohamaPort}\b[^.!?;]{0,80}\b(?:drop off|dropoff) (?:at|in) (?:your )?${tokyoOrigin}\b`);

function normalize(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/<[^>]*>/g, " ").replace(/(?:→|->)/g, " to ")
    .replace(/[^a-z0-9.!?;\n]+/g, " ").replace(/ +/g, " ").trim();
}

export function isTokyoToYokohamaPortTransfer(product: TransferSummary) {
  const rawText = `${product.title} ${product.description}`;
  const text = normalize(rawText);
  if (!/\btransfers?\b/.test(text)) return false;
  if (/\b(?:tours?|excursions?)\b/.test(normalize(product.title))) return false;
  // Ambiguous alternatives cannot establish the hotel-to-port booking option.
  if (/(?:↔|<->|to\s*\/\s*from)/i.test(rawText)
    || /\b(?:round trips?|return transfers?|both directions?|either direction|vice versa|to and from|and back)\b/.test(text)) return false;
  if (/\b(?:airports?|haneda|narita|tokyo international cruise terminal|tokyo cruise port|tokyo cruise terminal|sightseeing|rentals?|self drive|guided tour|day tour|shore excursion)\b/.test(text)) return false;
  if (/\b(?:no|without|excluding) (?:a )?(?:private )?transfers?\b|\btransfers?[^.!?;]{0,30}\bnot (?:included|provided|available)\b/.test(text)) return false;
  if (reverse.some((pattern) => pattern.test(text)) || pickupFromPort.test(text)) return false;
  const statements = [normalize(product.title), ...normalize(product.description).split(/[.!?;\n]+/)];
  return statements.some((statement) => forward.some((pattern) => pattern.test(statement))) || pickupToPort.test(text);
}
