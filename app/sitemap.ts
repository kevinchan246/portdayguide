import type { MetadataRoute } from "next";
import { portNames, portProfiles, portRegions } from "@/lib/shorepath";
import { intentGuidePath, portIntentGuides } from "@/lib/port-intent-guides";
import { blogPosts } from "@/lib/blog";
import { portPath, regionPath, siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-07-27");
  const staticRoutes = ["", "/ports", "/planner", "/blog", "/about", "/disclosure"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: updated,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/ports" ? .9 : path === "/blog" ? .75 : path === "/planner" ? .7 : .5,
  }));
  const regions = portRegions.map((region) => ({ url: `${siteUrl}${regionPath(region)}`, lastModified: updated, changeFrequency: "monthly" as const, priority: .8 }));
  const guides = portNames.map((name) => ({ url: `${siteUrl}${portPath(portProfiles[name].slug)}`, lastModified: updated, changeFrequency: "monthly" as const, priority: .8 }));
  const intentGuides = portIntentGuides.map((guide) => ({ url: `${siteUrl}${intentGuidePath(guide)}`, lastModified: guide.modified ? new Date(guide.modified) : updated, changeFrequency: "monthly" as const, priority: .85 }));
  const blogRoutes = blogPosts.map((post) => ({ url: `${siteUrl}${post.path}`, lastModified: new Date(post.modified), changeFrequency: "monthly" as const, priority: post.path.split("/").length > 3 ? .85 : .8 }));
  return [...staticRoutes, ...regions, ...guides, ...intentGuides, ...blogRoutes];
}
