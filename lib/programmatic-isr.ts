/**
 * Canonical ISR length (seconds) for programmatic SEO + sitemaps.
 *
 * Next.js only accepts **numeric literals** for `export const revalidate` in `page.tsx` / `sitemap.ts`
 * (imported values break the build). Mirror this value in:
 * - `app/tools/[slug]/page.tsx`
 * - `app/tools/[slug]/[keyword]/[usecase]/page.tsx`
 * - `app/sitemap.ts`
 *
 * Use here for runtime-only consumers (e.g. `Cache-Control` on `/api/sitemap-index`).
 *
 * - 604_800 → 7d (balanced)
 * - 2_592_000 → 30d (fewer ISR writes on repeat crawls)
 */
export const PROGRAMMATIC_SEO_REVALIDATE_SEC = 2_592_000;
