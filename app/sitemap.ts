import type { MetadataRoute } from "next";
import { portNames, portProfiles, portRegions } from "@/lib/shorepath";
import { intentGuidePath, portIntentGuides } from "@/lib/port-intent-guides";
import { blogPosts } from "@/lib/blog";
import { portPath, regionPath, siteUrl } from "@/lib/seo";
import { portContentUpdate } from "@/lib/local-guide-editions";
import { guideUpdatedIso } from "@/lib/editorial";
import { portPhotoUrl } from "@/lib/port-photos";

export default function sitemap(): MetadataRoute.Sitemap {
  // Do not invent a shared update date for undated hubs and utility pages.
  // Article dates come from the same records used in their rendered schema.
  const staticRoutes = ["", "/ports", "/planner", "/blog", "/about", "/disclosure"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path === "/ports" ? .9 : path === "/blog" ? .75 : path === "/planner" ? .7 : .5,
  }));
  const regions = portRegions.map((region) => ({ url: `${siteUrl}${regionPath(region)}`, changeFrequency: "monthly" as const, priority: .8 }));
  const guides = portNames.map((name) => ({
    url: `${siteUrl}${portPath(portProfiles[name].slug)}`,
    lastModified: portContentUpdate(portProfiles[name].slug)?.modified ?? guideUpdatedIso,
    images: [portPhotoUrl(portProfiles[name].slug)],
    changeFrequency: "monthly" as const,
    priority: .8,
  }));
  const intentGuides = portIntentGuides.map((guide) => ({
    url: `${siteUrl}${intentGuidePath(guide)}`,
    lastModified: guide.modified || guide.published || guideUpdatedIso,
    images: [guide.image ? `${siteUrl}${guide.image.src}` : portPhotoUrl(guide.sourcePortSlug)],
    changeFrequency: "monthly" as const,
    priority: .85,
  }));
  const blogRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}${post.path}`,
    lastModified: post.modified,
    images: [`${siteUrl}${post.image}`],
    changeFrequency: "monthly" as const,
    priority: post.path.split("/").length > 3 ? .85 : .8,
  }));
  return [...staticRoutes, ...regions, ...guides, ...intentGuides, ...blogRoutes];
}
