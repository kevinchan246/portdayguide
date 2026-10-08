import { blogPosts } from "@/lib/blog";
import { intentGuidePath, portIntentGuides } from "@/lib/port-intent-guides";
import { profilesBySlug, type PortSlug } from "@/lib/shorepath";

export type PlanningArticle = {
  path: string;
  title: string;
  description: string;
  category: string;
  portSlug?: PortSlug;
  image?: { src: string; alt: string; author?: string; width?: number; height?: number };
  published?: string;
};

// Keep one discoverable entry per existing canonical article. A missing date is
// intentionally left missing rather than making an old guide look newly published.
export const planningArticles: PlanningArticle[] = [
  ...portIntentGuides.map((guide) => ({
    path: intentGuidePath(guide),
    title: guide.title,
    description: guide.description,
    category: guide.eyebrow,
    portSlug: profilesBySlug[guide.sourcePortSlug]?.slug as PortSlug | undefined,
    image: guide.image,
    published: guide.published,
  })),
  ...blogPosts.map((post) => ({
    path: post.path,
    title: post.title,
    description: post.excerpt,
    category: post.category,
    portSlug: post.path === "/blog/alaska-cruise-ports" ? "juneau" as PortSlug : undefined,
    image: { src: post.image, alt: post.imageAlt, author: "imageAuthor" in post ? post.imageAuthor : undefined, width: post.imageWidth, height: post.imageHeight },
    published: post.published,
  })),
].sort((a, b) => (b.published ?? "").localeCompare(a.published ?? "") || a.title.localeCompare(b.title));

const featuredPaths = [
  "/ports/osaka/kaiyukan-from-cruise-port",
  "/ports/yokohama-tokyo/tokyo-to-yokohama-cruise-terminal",
  "/ports/cozumel/taxi-rates",
  "/ports/costa-maya/to-mahahual",
  "/ports/roatan/mahogany-bay-vs-coxen-hole",
  "/blog/alaska-cruise-ports",
];

export const featuredPlanningArticles = featuredPaths.flatMap((path) => {
  const article = planningArticles.find((entry) => entry.path === path);
  return article ? [article] : [];
});
