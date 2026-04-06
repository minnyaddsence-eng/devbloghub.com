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
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },
      // Chunked urlsets — avoid Next metadata sitemap (ISR); plain Route Handler + CDN cache.
      { source: "/sitemap/:file", destination: "/api/sitemap-chunk/:file" },
    ];
  },
};

export default nextConfig;
