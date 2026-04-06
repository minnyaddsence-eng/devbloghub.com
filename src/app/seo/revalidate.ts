/**
 * Shared SEO / caching constants (not App Router entrypoints).
 * Mirrors the Pages Router pattern of a single `revalidate.ts` for APIs + docs.
 */

/** Sitemap index API — CDN freshness (1d). */
export const SITEMAP_S_MAXAGE_SEC = 86_400;

/** Sitemap index API — serve stale while revalidating (7d). */
export const SITEMAP_STALE_WHILE_REVALIDATE_SEC = 604_800;

/**
 * Low-cardinality ISR: tool hubs (`/tools/[slug]`). Literal must be duplicated in `page.tsx` (Next segment config).
 * Sitemap shards are **Route Handlers** + `Cache-Control` only — no metadata sitemap ISR.
 */
export const HUB_AND_METADATA_SITEMAP_ISR_SEC = 2_592_000; // 30d

/** @deprecated Use HUB_AND_METADATA_SITEMAP_ISR_SEC */
export const PROGRAMMATIC_SEO_REVALIDATE_SEC = HUB_AND_METADATA_SITEMAP_ISR_SEC;

export function sitemapIndexCacheControl(): string {
  return `public, s-maxage=${SITEMAP_S_MAXAGE_SEC}, stale-while-revalidate=${SITEMAP_STALE_WHILE_REVALIDATE_SEC}`;
}

/** Same CDN policy as index — chunked urlsets are safe to cache at the edge. */
export function sitemapChunkCacheControl(): string {
  return sitemapIndexCacheControl();
}
