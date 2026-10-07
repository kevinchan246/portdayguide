import type { Metadata } from "next";
import { websiteMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...websiteMetadata("Shared Cruise Port Plan", "Review a shared PortdayGuide cruise itinerary and verify every ship time and booking detail.", "/share"),
  robots: { index: false, follow: false, nocache: true },
};

export default function SharedPlanLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
