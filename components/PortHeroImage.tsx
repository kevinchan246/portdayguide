import { PortScenicPhoto } from "@/components/PortScenicPhoto";
import { profilesBySlug, type PortSlug } from "@/lib/shorepath";

export function PortHeroImage({ slug, name }: { slug: string; name: string }) {
  const typedSlug = slug as PortSlug;
  return <PortScenicPhoto slug={typedSlug} name={name} country={profilesBySlug[typedSlug].country} variant="hero" priority />;
}
