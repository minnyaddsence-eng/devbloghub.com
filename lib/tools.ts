import toolsData from "@/data/tools.json";
import type { ToolDef } from "@/lib/types";
import type { UseCaseSlug } from "@/lib/use-cases";
import { USE_CASE_SLUGS } from "@/lib/use-cases";

const tools = toolsData as ToolDef[];

export function getTools(): ToolDef[] {
  return tools;
}

export function getToolBySlug(slug: string): ToolDef | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): ToolDef[] {
  return tools.filter((t) => t.category === category);
}

export function getCategories(): string[] {
  return [...new Set(tools.map((t) => t.category))].sort();
}

export function getRelatedTools(slug: string, limit = 3): ToolDef[] {
  const t = getToolBySlug(slug);
  if (!t) return tools.slice(0, limit);
  const same = tools.filter((x) => x.category === t.category && x.slug !== slug);
  const rest = tools.filter((x) => x.category !== t.category && x.slug !== slug);
  return [...same, ...rest].slice(0, limit);
}

/** Curated slugs for the home page “Top picks” row (stable order). */
export const HOME_TOP_TOOL_SLUGS = [
  "json-formatter",
  "json-validator",
  "base64",
  "jwt-decoder",
  "uuid-generator",
  "regex-tester",
  "markdown-preview",
  "query-string-parser",
] as const;

/** Curated slugs for the home page “Trending” row (stable order). */
export const HOME_TRENDING_TOOL_SLUGS = [
  "word-counter",
  "slug-generator",
  "hash-generator",
  "csv-to-json",
  "timestamp-converter",
  "color-converter",
  "html-entities",
  "yaml-to-json",
] as const;

export function getToolsInSlugOrder(slugs: readonly string[]): ToolDef[] {
  return slugs.map((s) => getToolBySlug(s)).filter((t): t is ToolDef => Boolean(t));
}

export function getSeoPairs(): { slug: string; seoSlug: string }[] {
  const pairs: { slug: string; seoSlug: string }[] = [];
  for (const t of tools) {
    for (const seoSlug of t.seoSlugs) {
      pairs.push({ slug: t.slug, seoSlug });
    }
  }
  return pairs;
}

/** 100 tools × 10 keywords × 10 use cases = 10,000 long-tail URLs */
export function getSeoTriplets(): { slug: string; keyword: string; usecase: UseCaseSlug }[] {
  const out: { slug: string; keyword: string; usecase: UseCaseSlug }[] = [];
  for (const t of tools) {
    for (const keyword of t.seoSlugs) {
      for (const usecase of USE_CASE_SLUGS) {
        out.push({ slug: t.slug, keyword, usecase });
      }
    }
  }
  return out;
}
