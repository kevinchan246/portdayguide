"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { portPath } from "@/lib/seo";
import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import { guideReadMinutes, guideTitle, guideUpdatedLabel } from "@/lib/editorial";
import { regionPath } from "@/lib/seo";
import { portNames, portProfiles, portRegions, type PortRegion } from "@/lib/shorepath";

type RegionFilter = "All regions" | PortRegion;

function normalizeSearchText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function PortDirectory({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [region, setRegion] = useState<RegionFilter>("All regions");

  const normalizedQuery = normalizeSearchText(query);
  const matches = useMemo(() => {
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    return portNames.filter((name) => {
      const profile = portProfiles[name];
      const matchesRegion = region === "All regions" || profile.region === region;
      const activityPlaces = Object.values(profile.activities).flat().map((activity) => activity.place);
      const excursionTitles = profile.excursions.map((excursion) => excursion.title);
      const searchable = normalizeSearchText([
        name,
        profile.slug,
        profile.region,
        profile.country,
        profile.pier,
        profile.focus,
        profile.headline,
        profile.intro,
        ...profile.highlights,
        ...activityPlaces,
        ...excursionTitles,
      ].join(" "));
      return matchesRegion && queryTerms.every((term) => searchable.includes(term));
    });
  }, [normalizedQuery, region]);

  const activeRegions = portRegions.filter((item) => matches.some((name) => portProfiles[name].region === item));
  const reset = () => { setQuery(""); setRegion("All regions"); };

  return <section className="section ports-directory-list" id="port-directory">
    <div className="directory-tools" aria-label="Search and filter cruise port guides">
      <div className="directory-search">
        <span aria-hidden="true">⌕</span>
        <label htmlFor="port-search">Search port guides</label>
        <input id="port-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Cozumel, Japan, beaches…" autoComplete="off" />
        {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>}
      </div>
      <div className="region-filters" aria-label="Filter by region">
        {(["All regions", ...portRegions] as RegionFilter[]).map((item) => <button type="button" key={item} className={region === item ? "active" : ""} aria-pressed={region === item} onClick={() => setRegion(item)}>{item}</button>)}
      </div>
      <div className="directory-result-count" aria-live="polite"><b>{matches.length}</b> {matches.length === 1 ? "port guide" : "port guides"} found{(query || region !== "All regions") && <button type="button" onClick={reset}>Clear filters</button>}</div>
    </div>

    {matches.length ? activeRegions.map((item) => {
      const names = matches.filter((name) => portProfiles[name].region === item);
      return <section className="port-region" key={item}>
        <div className="region-heading"><h2><Link href={regionPath(item)}>{item} cruise ports</Link></h2><span>{names.length} {names.length === 1 ? "port" : "ports"}</span></div>
        <div className="guide-grid directory-grid">
          {names.map((name) => { const profile = portProfiles[name]; return <Link href={portPath(profile.slug)} className="guide-card" key={name}>
            <PortScenicPhoto slug={profile.slug} name={profile.name} country={profile.country} />
            <div className="guide-card-content">
              <div className="guide-card-meta"><span>{profile.region}</span><span>{guideReadMinutes(profile)} min read</span></div>
              <h3>{guideTitle(profile)}</h3>
              <p>{profile.intro}</p>
              <div className="guide-card-footer"><span>Updated {guideUpdatedLabel}</span><b>Read guide →</b></div>
            </div>
          </Link>; })}
        </div>
      </section>;
    }) : <div className="directory-empty"><span aria-hidden="true">⌕</span><h2>No matching ports</h2><p>Try a port, country, region, pier, or attraction name.</p><button type="button" onClick={reset}>Show all 64 guides</button></div>}
  </section>;
}
