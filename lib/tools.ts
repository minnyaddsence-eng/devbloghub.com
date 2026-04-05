import toolsData from "@/data/tools.json";
import type { ToolDef } from "@/lib/types";
import type { UseCaseSlug } from "@/lib/use-cases";
import { USE_CASE_SLUGS } from "@/lib/use-cases";

const tools = toolsData as ToolDef[];

/**
 * Extra keyword segments merged into every tool’s long-tail matrix (no tools.json edit required).
 * Keep slugs lowercase-kebab; total URLs ≈ tools × (|seoSlugs| + |this|) × |USE_CASE_SLUGS|.
 */
export const GLOBAL_EXTRA_SEO_SLUGS = [
  "browser-based-developer-tool",
  "no-signup-online-utility",
  "client-side-privacy-friendly-tool",
  "instant-web-developer-helper",
  "free-software-engineer-utility",
  "api-workflow-companion-online",
  "cross-platform-browser-tool",
  "lightweight-dev-sandbox-online",
  "no-install-developer-converter",
  "quick-format-helper-for-developers",
] as const;

export function getExpandedSeoSlugsForTool(tool: ToolDef): string[] {
  return [...new Set([...tool.seoSlugs, ...GLOBAL_EXTRA_SEO_SLUGS])];
}

export function isValidSeoKeywordForTool(tool: ToolDef, keyword: string): boolean {
  return getExpandedSeoSlugsForTool(tool).includes(keyword);
}

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

/** Long-tail URLs: each tool × expanded keywords × all use-case slugs (see GLOBAL_EXTRA_SEO_SLUGS). */
export function getSeoTriplets(): { slug: string; keyword: string; usecase: UseCaseSlug }[] {
  const out: { slug: string; keyword: string; usecase: UseCaseSlug }[] = [];
  for (const t of tools) {
    for (const keyword of getExpandedSeoSlugsForTool(t)) {
      for (const usecase of USE_CASE_SLUGS) {
        out.push({ slug: t.slug, keyword, usecase });
      }
    }
  }
  return out;
}
