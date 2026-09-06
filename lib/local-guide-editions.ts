export const localGuideEditions = {
  nassau: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  "george-town-grand-cayman": { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
};

export function localGuideEdition(slug: string) {
  return localGuideEditions[slug as keyof typeof localGuideEditions];
}
