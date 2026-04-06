import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** One canonical host — helps crawlers (sitemaps, GSC) avoid apex↔www redirect chains. */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "devbloghub.com" }],
        destination: "https://www.devbloghub.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Native `generateSitemaps()` does not register /sitemap.xml (GitHub #77304).
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },
    ];
  },
};

export default nextConfig;
