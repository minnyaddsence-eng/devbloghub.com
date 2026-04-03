import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { site } from "@/lib/site";
import { getCategories, getSeoTriplets, getTools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const last = new Date();
  const base = site.url;

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
    changeFrequency: "weekly",
    priority: path === "" ? 1 : path === "/blog" ? 0.75 : path === "/tools" ? 0.95 : 0.6,
  }));

  const tools = getTools();
  const toolPages: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: last,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const seoPages: MetadataRoute.Sitemap = getSeoTriplets().map(({ slug, keyword, usecase }) => ({
    url: `${base}/tools/${slug}/${keyword}/${usecase}`,
    lastModified: last,
    changeFrequency: "monthly",
    priority: 0.45,
  }));

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: `${base}/category/${encodeURIComponent(c)}`,
    lastModified: last,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = getPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [...staticPages, ...toolPages, ...seoPages, ...categoryPages, ...blogPages];
}
