import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Cruise Port Guides & Shore Excursions | PortdayGuide", template: "%s | PortdayGuide" },
  description: "Plan cruise port days with terminal details, realistic return-time guidance, and live shore excursions.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cruise Port Guides & Shore Excursions | PortdayGuide",
    description: "Terminal details, return-time guidance, and live shore excursions for your cruise port day.",
    type: "website",
    url: "/",
    siteName: "PortdayGuide",
  },
  twitter: { card: "summary_large_image", title: "Cruise Port Guides | PortdayGuide", description: "Terminal details, return-time guidance, and live shore excursions." },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  category: "travel",
  applicationName: "PortdayGuide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US">
      <head>
        <link rel="dns-prefetch" href="https://www.openstreetmap.org" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
