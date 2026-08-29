import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Netlify's OpenNext adapter detects this standard Next.js app automatically. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.portdayguide.com" }],
        destination: "https://portdayguide.com/:path*",
        permanent: true,
      },
      {
        source: "/ports/george-town-grand-cayman/:path*",
        destination: "https://portdayguide.com/ports/grand-cayman/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
