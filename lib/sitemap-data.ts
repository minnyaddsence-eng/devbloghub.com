import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import { getCategories, getSeoTriplets, getTools } from "@/lib/tools";

export const SITEMAP_CHUNK_SIZE = 5000;

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

export function buildCoreSitemapEntries(last: Date, base: string): SitemapEntry[] {
  const staticPages: SitemapEntry[] = (
    ["", "/tools", "/blog", "/privacy", "/terms", "/about", "/contact"] as const
  ).map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : path === "/blog" ? 0.75 : path === "/tools" ? 0.95 : 0.6,
  }));

  const tools = getTools();
  const toolPages: SitemapEntry[] = tools.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: SitemapEntry[] = getCategories().map((c) => ({
    url: `${base}/category/${encodeURIComponent(c)}`,
    lastModified: last,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogPages: SitemapEntry[] = getPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...blogPages];
}

/** Ids for `<sitemapindex>`: 0 = core, 1..N = long-tail chunks. */
export function listSitemapShardIds(): { id: number }[] {
  const triplets = getSeoTriplets();
  const longTailFiles = Math.ceil(triplets.length / SITEMAP_CHUNK_SIZE);
  const ids: { id: number }[] = [{ id: 0 }];
  for (let i = 0; i < longTailFiles; i++) ids.push({ id: i + 1 });
  return ids;
}

export function getSitemapEntriesForShardId(shardId: number): SitemapEntry[] {
  const last = new Date();
  const base = site.url;

  if (!Number.isFinite(shardId) || shardId < 0) {
    return buildCoreSitemapEntries(last, base);
  }

  if (shardId === 0) {
    return buildCoreSitemapEntries(last, base);
  }

  const triplets = getSeoTriplets();
  const chunkIndex = shardId - 1;
  const start = chunkIndex * SITEMAP_CHUNK_SIZE;
  const slice = triplets.slice(start, start + SITEMAP_CHUNK_SIZE);

  return slice.map(({ slug, keyword, usecase }) => ({
    url: `${base}/tools/${slug}/${keyword}/${usecase}`,
    lastModified: last,
    changeFrequency: "monthly" as const,
    priority: 0.45,
  }));
}
