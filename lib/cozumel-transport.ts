export function isCozumelDriverOption(product: { title: string; description: string }) {
  const title = product.title.toLowerCase();
  const text = `${title} ${product.description.toLowerCase()}`;
  if (/\b(jeep|buggy|atv|utv|scooter|rental|airport|ferry|catamaran|sailing)\b/.test(title)) return false;
  if (/self[- ]?driv|drive yourself|you (?:will )?drive|tak(?:e|ing) the wheel|without (?:a )?driver|driver (?:is )?not included/.test(text)) return false;
  return /\b(private|customizable|customised|customized|personal|driver|chauffeur)\b/.test(title)
    && /\b(driver|chauffeur|chauffeured)\b/.test(text);
}

export type TransportQuote = { passengers: string; outward: string; back: string; taxiExtras: string; driver: string; driverExtras: string };

export function compareTransportQuotes(quote: TransportQuote) {
  const money = (value: string) => /^\d+(?:\.\d{1,2})?$/.test(value.trim()) && Number(value) <= 100000 ? Math.round(Number(value) * 100) : null;
  const people = /^\d+$/.test(quote.passengers) ? Number(quote.passengers) : 0;
  if (people < 1 || people > 30) return null;
  const outward = money(quote.outward), back = money(quote.back);
  const taxiExtras = money(quote.taxiExtras), driver = money(quote.driver), driverExtras = money(quote.driverExtras);
  const taxiTotal = outward !== null && back !== null && taxiExtras !== null ? (outward + back + taxiExtras) / 100 : null;
  const driverTotal = driver !== null && driverExtras !== null ? (driver + driverExtras) / 100 : null;
  return { people, taxiTotal, driverTotal, difference: taxiTotal !== null && driverTotal !== null ? Math.round((driverTotal - taxiTotal) * 100) / 100 : null };
}
