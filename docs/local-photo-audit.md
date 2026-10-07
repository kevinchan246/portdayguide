# Local photography audit — October 7, 2026

The organic-search review inspected all 64 deployed port photographs together with their Wikimedia Commons file descriptions and current primary image metadata. `lib/scenic-photo-credits.json` retains the exact original filename, author, source, selected license, license URL, check date and adjustments. Full attribution is available at `/photo-credits`; this utility route is `noindex, follow` and should stay outside the discovery sitemap. Port cards keep plain author names to avoid nesting an attribution link inside a guide link. Hero and body credits use linked author names.

The current `lib/editorial-photos.json` records retain the seven attraction-photo sources. The directory also includes the two previously verified Kaiyukan photographs and the new Port Canaveral photograph. Kaiyukan's original author/source links and original image URLs remain intact; see `kaiyukan-image-sources.md` for its original adjustments and processing records.

## Source and subject checks

- The 64 port files were decoded and visually reviewed in one labeled contact sheet. Their local dimensions are measured rather than assumed to be 1600 × 900 or 1000 × 625.
- Alt text was corrected for Key West's aerial residential view, St. George's fort courtyard, Ensenada's Riviera del Pacífico cultural center, Marseille's Notre-Dame de la Garde basilica, and Laem Chabang's Harbor Department sign. These photographs are not relabeled as beaches, coastlines or cruise terminals.
- Bridgetown's original Commons page identifies its own-work photographer in the upload history as `Acp~commonswiki`; Castries credits `Chensiyuan` in the copyright/attribution block. Neither author was invented from a filename.
- Ensenada's file could not initially be opened directly by the lookup service; following the exact file link from Commons' Hotel Riviera del Pacífico category recovered the original photographer `in-boulder` and CC BY 2.0 record.
- Busan's API summary reports the depicted bridge structure as public domain. The photograph itself is explicitly CC BY-SA 3.0 on the file page. The directory retains the photograph's license rather than treating the photograph as public domain.
- Montego Bay's specified photographer/file/source credit and Thomas Wolf's Palma credit, copyright and website are retained in the separate public directory. The Palma file explicitly permits a separate, easy-to-find image-source directory.

## Port Canaveral replacement

The MCO-to-Port Canaveral article previously used a photograph of Puerto Vallarta. Its replacement is [Sunset - Port Canaveral.jpg](https://commons.wikimedia.org/wiki/File:Sunset_-_Port_Canaveral.jpg), by **TerryDOtt**, photographed December 4, 2022 and licensed [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). The source is the photographer's [Flickr file](https://www.flickr.com/photos/146878425@N05/52755876979/). The 6050 × 3058 original was downloaded from Commons, visually inspected, proportionally resized to 1600 × 809 and compressed to `/media/blog/port-canaveral-sunset.webp` (117,264 bytes). No objects, colors or scene details were generated or replaced. Other articles' existing Puerto Vallarta asset remains available; replacing one subject does not change an unrelated image URL.

## Responsive delivery and measured asset sizes

`scripts/optimize-local-photos.mjs` generates local WebP derivatives after a photograph is cached or replaced. It records measured dimensions, byte sizes and variants in `lib/local-photo-variants.json`. No derivative upscales its source. The original JPEG and WebP URLs remain reachable for links, social previews and structured data.

The scenic component serves a WebP `<source>` with width descriptors and a JPEG `<img>` fallback. Cards use responsive layout hints; eagerly fetched hero images account for the source aspect ratio in tall mobile crops. Body photographs keep lazy loading, explicit dimensions and responsive widths. `LocalPhotoImage` provides the same delivery for blog layouts without a runtime image proxy or an added third-party request.

| The same 64 scenic photographs | Aggregate bytes |
|---|---:|
| Existing original JPEGs | 15,844,998 |
| 480px WebP derivatives | 1,541,544 |
| 800px WebP derivatives | 3,869,308 |
| Largest WebP derivative for each source | 11,152,686 |

The 480px assets are 90.3% smaller in aggregate; the 800px assets are 75.6% smaller. These are file-size comparisons for identical photographs, not observed page-load or ranking gains. Device pixel ratio and layout determine which width a browser requests. All 77 local images and 230 referenced derivatives were reopened and checked against their manifest dimensions and byte sizes. The source/author/license review covers the 74 photograph entries in the attribution directory; legacy concept illustrations are not treated as verified photographs. Lint and page/build/deployment checks are recorded in the release PR. Field Core Web Vitals, new search rankings and traffic gains require later measurement.
