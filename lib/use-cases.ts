const titleCase = (s: string) =>
  s
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const USE_CASES = [
  { slug: "for-developers", title: "For developers" },
  { slug: "for-beginners", title: "For beginners" },
  { slug: "for-debugging", title: "For debugging" },
  { slug: "for-api-response-checks", title: "For API response checks" },
  { slug: "for-large-files", title: "For large files" },
  { slug: "for-documentation", title: "For documentation" },
  { slug: "for-teaching", title: "For teaching" },
  { slug: "for-seo-content-teams", title: "For SEO & content teams" },
  { slug: "for-quick-one-off-tasks", title: "For quick one-off tasks" },
  { slug: "for-privacy-conscious-workflows", title: "For privacy-conscious workflows" },
] as const;

export type UseCaseSlug = (typeof USE_CASES)[number]["slug"];

export const USE_CASE_SLUGS: UseCaseSlug[] = USE_CASES.map((u) => u.slug);

export const DEFAULT_USE_CASE_SLUG: UseCaseSlug = USE_CASES[0].slug;

export function getUseCaseTitle(slug: string): string {
  const hit = USE_CASES.find((u) => u.slug === slug);
  return hit?.title ?? titleCase(slug);
}

export function isValidUseCaseSlug(slug: string): slug is UseCaseSlug {
  return USE_CASE_SLUGS.includes(slug as UseCaseSlug);
}
