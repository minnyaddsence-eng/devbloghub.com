/**
 * Sitemap index via `generateSitemaps` — long-tail URLs chunked (5k per file).
 * Core routes live in id 0; programmatic URLs from `getSeoTriplets()` in id 1+.
 *
 * Root `/sitemap.xml` is served via rewrite → `/api/sitemap-index` (Next omits the index
 * when `generateSitemaps` is used; see vercel/next.js#77304).
 */
import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import { getCategories, getSeoTriplets, getTools } from "@/lib/tools";

export const SITEMAP_CHUNK_SIZE = 5000;

function buildCoreSitemapEntries(last: Date, base: string): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/blog",
    "/privacy",
    "/terms",
    "/about",
    "/contact",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.75 : path === "/tools" ? 0.95 : 0.6,
  }));

  const tools = getTools();
  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${base}/category/${encodeURIComponent(c)}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...blogPages];
}

export async function generateSitemaps() {
  const triplets = getSeoTriplets();
  const longTailFiles = Math.ceil(triplets.length / SITEMAP_CHUNK_SIZE);
  const ids: { id: number }[] = [{ id: 0 }];
  for (let i = 0; i < longTailFiles; i++) ids.push({ id: i + 1 });
  return ids;
}

export default async function sitemap({
  id,
}: {
  id: number | string;
}): Promise<MetadataRoute.Sitemap> {
  const last = new Date();
  const base = site.url;
  const sid = typeof id === "string" ? Number.parseInt(id, 10) : Number(id);

  if (!Number.isFinite(sid) || sid < 0) {
    return buildCoreSitemapEntries(last, base);
  }

  if (sid === 0) {
    return buildCoreSitemapEntries(last, base);
  }

  const triplets = getSeoTriplets();
  const chunkIndex = sid - 1;
  const start = chunkIndex * SITEMAP_CHUNK_SIZE;
  const slice = triplets.slice(start, start + SITEMAP_CHUNK_SIZE);

  return slice.map(({ slug, keyword, usecase }) => ({
    url: `${base}/tools/${slug}/${keyword}/${usecase}`,
    lastModified: last,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));
}
