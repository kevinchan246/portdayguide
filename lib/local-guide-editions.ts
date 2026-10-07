export const localGuideEditions = {
  cozumel: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  juneau: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  nassau: { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
  "george-town-grand-cayman": { modified: "2026-09-06", label: "Sep 6, 2026", readMinutes: 7 },
};

export function localGuideEdition(slug: string) {
  return localGuideEditions[slug as keyof typeof localGuideEditions];
}

// Every hub's budget, transport and return guidance was materially revised in
// this audit. This is an editing date, not a claim of a fresh local fact check.
const sharedPortContentRevision = { modified: "2026-10-07", label: "Oct 7, 2026" };

// Content revisions can update metadata without switching the page's editorial template.
export function portContentUpdate(slug: string) {
  const local = localGuideEdition(slug);
  return local && local.modified > sharedPortContentRevision.modified ? local : sharedPortContentRevision;
}
