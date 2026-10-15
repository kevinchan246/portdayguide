import { articleCover } from "@/lib/article-covers";
export const longBeachTransferPath = "/blog/long-beach-airport-to-cruise-port";
const cover = articleCover(longBeachTransferPath)!;
export const longBeachTransferPost = {
  slug: "long-beach-airport-to-cruise-port",
  title: "Long Beach Airport to Your Cruise: Which Port Are You Booking?",
  seoTitle: "LGB Airport to Cruise Port: Long Beach or San Pedro?",
  description: "Flying into LGB for a cruise? Match Long Beach or San Pedro to the correct address, then compare taxi, rideshare, cruise shuttle and private transfer conditions.",
  excerpt: "One airport, two different cruise ports. Set the correct destination before comparing a shuttle seat with a private ride.",
  category: "Cruise airport transfers",
  published: "2026-10-15", publishedLabel: "October 15, 2026", modified: "2026-10-15",
  author: "PortdayGuide editorial", readTime: "7 min read",
  image: cover.src, imageAlt: cover.alt, imageWidth: cover.width, imageHeight: cover.height,
  imageAuthor: cover.author, imageCreditHref: cover.creditHref,
} as const;
