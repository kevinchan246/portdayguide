import { articleCover } from "@/lib/article-covers";
export const galvestonTransferPath = "/blog/hobby-airport-to-galveston-cruise";
const cover = articleCover(galvestonTransferPath)!;
export const galvestonTransferPost = {
  slug: "hobby-airport-to-galveston-cruise",
  title: "Hobby Airport to a Galveston Cruise: Plan All Three Rides",
  seoTitle: "Hobby Airport to Galveston Cruise: Hotel & Transfer Costs",
  description: "Flying into HOU before a Galveston cruise? Plan airport-to-hotel, hotel-to-terminal and return transfers, with four-person costs, luggage and pickup checks.",
  excerpt: "An overnight hotel creates a third transport leg. Compare the full family budget and confirm each pickup before booking an airport round trip.",
  category: "Cruise embarkation transport",
  published: "2026-10-13", publishedLabel: "October 13, 2026", modified: "2026-10-13",
  author: "PortdayGuide editorial", readTime: "8 min read",
  image: cover.src, imageAlt: cover.alt, imageWidth: cover.width, imageHeight: cover.height,
  imageAuthor: cover.author, imageCreditHref: cover.creditHref,
} as const;
