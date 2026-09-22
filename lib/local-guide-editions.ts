export const localGuideEditions = {
  cozumel: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  juneau: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  nassau: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  "george-town-grand-cayman": { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
};

export function localGuideEdition(slug: string) {
  return localGuideEditions[slug as keyof typeof localGuideEditions];
}

// Content revisions can update metadata without switching the page's editorial template.
export function portContentUpdate(slug: string) {
  if (slug === "osaka") return { modified: "2026-09-22", label: "Sep 22, 2026" };
  return localGuideEdition(slug);
}
