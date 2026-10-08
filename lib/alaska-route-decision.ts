import { articleCover } from "@/lib/article-covers";

export const alaskaRoutePath = "/blog/alaska-one-way-vs-round-trip";
const cover = articleCover(alaskaRoutePath)!;
export const alaskaRoutePost = {
  slug: "alaska-one-way-vs-round-trip",
  title: "One-Way or Round-Trip Alaska Cruise? Check the Journey Home",
  seoTitle: "Alaska One-Way vs Round-Trip: Flights & Total Cost",
  description: "Compare one-way and round-trip Alaska cruises using the actual airports, Whittier or Seward transfers, flight timing and a whole-party cost calculation.",
  excerpt: "A cheaper cabin can mean a more expensive journey home. Compare the airport connection and complete party cost before paying a cruise deposit.",
  category: "Alaska cruise decisions",
  published: "2026-10-08", publishedLabel: "October 8, 2026", modified: "2026-10-08",
  author: "PortdayGuide editorial", readTime: "8 min read",
  image: cover.src, imageAlt: cover.alt, imageWidth: cover.width, imageHeight: cover.height,
  imageAuthor: cover.author, imageCreditHref: cover.creditHref,
} as const;
