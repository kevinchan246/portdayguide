import type { PortSlug } from "@/lib/shorepath";

export type PortPhoto = {
  file: string;
  alt: string;
};

// Each file below is a real, location-specific photograph hosted on Wikimedia
// Commons. Keeping the exact Commons file title makes the image deterministic
// and lets every card link back to its original licensing page.
export const portPhotos: Record<PortSlug, PortPhoto> = {
  "cozumel": { file: "Cozumel, Mexico (Unsplash nhXV1T9LVMg).jpg", alt: "Caribbean shoreline and turquoise water in Cozumel, Mexico" },
  "nassau": { file: "Nassau, Bahamas aerial view (cropped).jpg", alt: "Aerial view of Nassau and its turquoise shoreline in the Bahamas" },
  "costa-maya": { file: "Costa maya beach.jpg", alt: "Palm-lined beach and Caribbean water at Costa Maya, Mexico" },
  "st-thomas": { file: "View of St. Thomas.jpg", alt: "Hillside view over the harbor and islands of St. Thomas" },
  "roatan": { file: "Westbay2106.jpg", alt: "West Bay beach and clear Caribbean water on Roatan, Honduras" },
  "san-juan": { file: "2013 Old San Juan 01.JPG", alt: "Historic waterfront architecture in Old San Juan, Puerto Rico" },
  "philipsburg": { file: "Philipsburg and the Great Bay, Sint Maarten, Caribbean.jpg", alt: "Philipsburg and Great Bay on Sint Maarten" },
  "george-town-grand-cayman": { file: "96-124 S Church St, George Town, Cayman Islands - panoramio (1).jpg", alt: "Waterfront view in George Town, Grand Cayman" },
  "falmouth-jamaica": { file: "Falmouth, Jamaica I.jpg", alt: "Historic streetscape in Falmouth, Jamaica" },
  "ocho-rios": { file: "JM-ocho rios-hafen-01.jpg", alt: "Harbor and green hills at Ocho Rios, Jamaica" },
  "montego-bay": { file: "Montego Bay Photo Don Ramey Logan.jpg", alt: "Coastal view of Montego Bay, Jamaica" },
  "amber-cove": { file: "Amber Cove Sunrise (31647461387).jpg", alt: "Sunrise over Amber Cove in the Dominican Republic" },
  "puerto-plata": { file: "Downtown Puerto Plata Dominican Republic Architecture.jpg", alt: "Colorful historic architecture in Puerto Plata, Dominican Republic" },
  "belize-city": { file: "Belize City waterfront.jpg", alt: "Waterfront in Belize City, Belize" },
  "key-west": { file: "Key West FH020009.jpg", alt: "Aerial coastal view of Key West, Florida" },
  "oranjestad-aruba": { file: "Main port of Aruba (13256378895).jpg", alt: "Harbor and waterfront at Oranjestad, Aruba" },
  "willemstad-curacao": { file: "Handelskade in Willemstad.jpg", alt: "Colorful Handelskade waterfront in Willemstad, Curacao" },
  "kralendijk-bonaire": { file: "BONAIRE-kralendijk-hafen-2.jpg", alt: "Harbor and waterfront in Kralendijk, Bonaire" },
  "bridgetown": { file: "Bridgetown2.jpg", alt: "Waterfront and city view of Bridgetown, Barbados" },
  "castries": { file: "View of Castries Saint Lucia Day248bdriveb.jpg", alt: "Castries harbor surrounded by the hills of Saint Lucia" },
  "st-johns-antigua": { file: "AntiguaHarborStjohn.jpg", alt: "St. John's harbor in Antigua" },
  "basseterre": { file: "St. Kitts, Karibik - Marina in Basseterre - panoramio.jpg", alt: "Marina and green hills at Basseterre, St. Kitts" },
  "road-town-tortola": { file: "Roadtown, Tortola.jpg", alt: "Road Town harbor and hills on Tortola" },
  "st-georges-grenada": { file: "St Georges Grenada Fort - panoramio.jpg", alt: "St. George's harbor and hillside in Grenada" },
  "roseau-dominica": { file: "Roseau Dominica.jpg", alt: "Roseau waterfront beneath the green mountains of Dominica" },
  "juneau": { file: "Queen Elizabeth (ship, 2010) in Juneau, Alaska 2024-08-15 (cropped).jpg", alt: "Cruise ship beside the mountain-lined waterfront of Juneau, Alaska" },
  "ketchikan": { file: "Downtown Ketchikan - panoramio.jpg", alt: "Downtown and forested waterfront in Ketchikan, Alaska" },
  "skagway": { file: "Skagway aerial view.jpg", alt: "Aerial view of Skagway between mountains and water in Alaska" },
  "sitka": { file: "Sitka 84 Elev 135.jpg", alt: "Aerial view of Sitka Sound and its forested islands in Alaska" },
  "icy-strait-point": { file: "Icy Strait Point, Alaska.jpg", alt: "Waterfront landing and forest at Icy Strait Point, Alaska" },
  "victoria-bc": { file: "Victoria BC, Canada (Johnson Street) - panoramio.jpg", alt: "Johnson Street and the harbor area in Victoria, British Columbia" },
  "cabo-san-lucas": { file: "Cabo San Lucas Los Arcos 3.jpg", alt: "El Arco rock formations at Cabo San Lucas, Mexico" },
  "puerto-vallarta": { file: "Sunset panorama over Puerto Vallarta, looking out at the Pacific Ocean.jpg", alt: "Sunset panorama over Puerto Vallarta and the Pacific Ocean" },
  "mazatlan": { file: "Malecón de Mazatlán, 4 de mayo de 2023.jpg", alt: "Pacific coast and Malecon in Mazatlan, Mexico" },
  "ensenada": { file: "Baja09flickr-05 (4258690724).jpg", alt: "Coastal landscape near Ensenada, Baja California" },
  "progreso": { file: "Progreso, Yucatan.jpg", alt: "Beach and long pier at Progreso, Yucatan" },
  "barcelona": { file: "Evening light over Barcelona.jpg", alt: "Evening cityscape of Barcelona, Spain" },
  "civitavecchia-rome": { file: "Forte Michelangelo 2014.jpg", alt: "Forte Michelangelo beside the port of Civitavecchia, Italy" },
  "naples": { file: "Napoli - Maschio Angioino - 202209302342 3.jpg", alt: "Maschio Angioino and waterfront cityscape in Naples, Italy" },
  "livorno-florence": { file: "Livorno, veduta aerea 2015.jpg", alt: "Aerial view of Livorno and its canals in Italy" },
  "marseille": { file: "Notre-Dame de la Garde aerial view 2020.jpeg", alt: "Aerial city and coastal view of Marseille, France" },
  "palma-de-mallorca": { file: "Kathedrale von Palma.jpg", alt: "Palma Cathedral and waterfront on Mallorca, Spain" },
  "piraeus-athens": { file: "Port of Piraeus Panoramic View.JPG", alt: "Panoramic view of Piraeus harbor in Greece" },
  "santorini": { file: "Oia - Santorini - Greece - 16.jpg", alt: "Whitewashed Oia above the Santorini caldera in Greece" },
  "mykonos": { file: "Little Venice, Mykonos.jpg", alt: "Little Venice waterfront in Mykonos, Greece" },
  "dubrovnik": { file: "The walls of the fortress and View of the old city. panorama.jpg", alt: "Fortified old city and Adriatic coast of Dubrovnik, Croatia" },
  "valletta": { file: "St Sebastian Curtain (cropped).jpg", alt: "Historic fortifications and harbor at Valletta, Malta" },
  "lisbon": { file: "Lisboa - Portugal (52597836992).jpg", alt: "Hillside cityscape and waterfront in Lisbon, Portugal" },
  "yokohama-tokyo": { file: "Minato Mirai.jpg", alt: "Minato Mirai waterfront skyline in Yokohama, Japan" },
  "osaka": { file: "Osaka Castle and Osaka Business Park skyscraper 20260610.jpg", alt: "Osaka Castle and the Osaka city skyline in Japan" },
  "kobe": { file: "Kobe Port Tower and Maritime Museum, November 2016.jpg", alt: "Kobe Port Tower and Maritime Museum on the waterfront in Japan" },
  "nagasaki": { file: "Nagasaki City View from Glover Garden, Nagasaki 2014.jpg", alt: "Nagasaki harbor and city viewed from Glover Garden" },
  "fukuoka": { file: "Fukuoka Skyline of Seaside Momochi.jpg", alt: "Seaside Momochi and the Fukuoka skyline in Japan" },
  "busan": { file: "Gwangan Bridge1.jpg", alt: "Gwangan Bridge and the Busan coast in South Korea" },
  "jeju": { file: "Jeju - Hallasan.JPG", alt: "Hallasan rising over Jeju Island in South Korea" },
  "hong-kong": { file: "Hong Kong Skyline - Dec 2007.jpg", alt: "Victoria Harbour and the Hong Kong skyline" },
  "singapore": { file: "Singapore Marina Bay Dusk 2018-02-27.jpg", alt: "Marina Bay skyline at dusk in Singapore" },
  "keelung-taipei": { file: "獅球嶺眺望基隆港2017.jpg", alt: "Keelung harbor viewed from Shiqiuling in Taiwan" },
  "shanghai": { file: "Huangpu Park 20124-Shanghai (32208802494).jpg", alt: "The Bund and Huangpu River skyline in Shanghai, China" },
  "laem-chabang-bangkok": { file: "Laem Chabang.jpg", alt: "Port and coastal view at Laem Chabang, Thailand" },
  "phu-my-ho-chi-minh-city": { file: "Bờ biển Vũng Tàu.JPG", alt: "Coastline at Vung Tau near Phu My port in Vietnam" },
  "chan-may-hue-da-nang": { file: "Hai Van Pass, Vietnam, View southwards.jpg", alt: "Coastal view from Hai Van Pass near Chan May, Vietnam" },
  "benoa-bali": { file: "Pantai nusa dua bali saat matahari terbit.jpg", alt: "Sunrise at Nusa Dua beach near Benoa, Bali" },
  "phuket": { file: "Phuket Aerial.jpg", alt: "Aerial view of Phuket's tropical coastline in Thailand" },
};

export function portPhotoPath(slug: PortSlug) {
  return `/media/ports/${slug}.jpg`;
}

export function portPhotoUrl(slug: PortSlug) {
  return `https://portdayguide.com${portPhotoPath(slug)}`;
}

export function commonsFilePageUrl(file: string) {
  const params = new URLSearchParams({ title: `File:${file.replaceAll(" ", "_")}` });
  return `https://commons.wikimedia.org/w/index.php?${params.toString()}`;
}
