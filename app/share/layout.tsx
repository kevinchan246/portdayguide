import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shared Cruise Port Plan",
  robots: { index: false, follow: false, nocache: true },
};

export default function SharedPlanLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
