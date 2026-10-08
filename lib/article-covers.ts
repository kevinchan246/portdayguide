import covers from "@/lib/article-covers.json";

export type ArticleCover = {
  src: string;
  alt: string;
  width: number;
  height: number;
  author: string;
  sourceUrl: string;
  creditHref: string;
  position?: string;
};

/** A photograph belongs to its article, including every discovery card. */
export function articleCover(path: string): ArticleCover | undefined {
  return (covers as Record<string, ArticleCover>)[path];
}
