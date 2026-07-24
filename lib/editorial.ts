import { portCoordinates, type PortProfile } from "@/lib/shorepath";

export const guideUpdatedIso = "2026-07-21";
export const guideUpdatedLabel = "Jul 21, 2026";

export function portMapTileLayout(slug: string, zoom = 11, columns = 3, rows = 2) {
  const [lat, lon] = portCoordinates[slug];
  const count = 2 ** zoom;
  const worldX = ((lon + 180) / 360) * count;
  const radians = lat * Math.PI / 180;
  const worldY = (1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2 * count;
  const startX = Math.floor(worldX) - Math.floor(columns / 2);
  const fractionY = worldY - Math.floor(worldY);
  const startY = Math.floor(worldY) - Math.floor(rows / 2) + (rows % 2 === 0 && fractionY >= .5 ? 1 : 0);
  const tiles = Array.from({ length: columns * rows }, (_, index) => {
    const x = startX + index % columns;
    const y = startY + Math.floor(index / columns);
    return `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;
  });
  return {
    tiles,
    columns,
    rows,
    markerLeft: `${(worldX - startX) / columns * 100}%`,
    markerTop: `${(worldY - startY) / rows * 100}%`,
  };
}

export function guideTitle(profile: PortProfile) {
  return `${profile.name} Cruise Port Guide: ${profile.highlights[0]}, ${profile.highlights[1]} & Shore Excursions`;
}

export function guideReadMinutes(profile: PortProfile) {
  return profile.transfer >= 65 ? 10 : profile.transfer >= 45 ? 9 : 8;
}

export function highlightPlanningNote(profile: PortProfile, index: number) {
  const notes = [
    `Treat ${profile.highlights[index]} as the main experience rather than the first item in a long checklist. Confirm current admission, meeting-point, and transport details before the port day.`,
    `${profile.highlights[index]} can be a second anchor only when it sits on a practical route from your confirmed terminal. Drop it if the outbound trip runs late.`,
    `Compare a guided option with an independent visit to ${profile.highlights[index]}. The right choice depends on the live schedule, pickup point, walking demands, and cancellation terms.`,
    `Keep ${profile.highlights[index]} as an alternative, not an automatic extra stop. It should replace another block if reaching it would weaken the return plan.`,
  ];
  return notes[index] || notes[3];
}

export const mapCredit = {
  label: "Map © OpenStreetMap contributors",
  href: "https://www.openstreetmap.org/copyright",
};
