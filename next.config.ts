import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Native `generateSitemaps()` does not register /sitemap.xml (GitHub #77304).
      { source: "/sitemap.xml", destination: "/api/sitemap-index" },
    ];
  },
};

export default nextConfig;
