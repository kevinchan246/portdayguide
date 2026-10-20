import { articleCover } from "@/lib/article-covers";
export const osakaCastlePath = "/blog/osaka-cruise-port-to-castle";
const cover = articleCover(osakaCastlePath)!;
export const osakaCastlePost = {
  slug: "osaka-cruise-port-to-castle",
  title: "Osaka Cruise Port to Osaka Castle: The Walk Matters",
  seoTitle: "Osaka Cruise Port to Osaka Castle: Metro & Visit Timing",
  description: "From Tempozan, follow the Chuo Line to Osaka Castle, allow for the park walk, and decide whether the museum or an exterior visit fits your ship's return time.",
  excerpt: "A direct metro train does not put you at the castle door. Plan the approach, the museum decision and the return from a confirmed Tempozan berth.",
  category: "Osaka shore-day planning",
  published: "2026-10-20", publishedLabel: "October 20, 2026", modified: "2026-10-20",
  author: "PortdayGuide editorial", readTime: "7 min read",
  image: cover.src, imageAlt: cover.alt, imageWidth: cover.width, imageHeight: cover.height,
  imageAuthor: cover.author, imageCreditHref: cover.creditHref,
} as const;
