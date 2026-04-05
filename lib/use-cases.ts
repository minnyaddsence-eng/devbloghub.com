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
  { slug: "for-ci-cd-pipelines", title: "For CI/CD pipelines" },
  { slug: "for-localhost-testing", title: "For localhost testing" },
  { slug: "for-microservices-debugging", title: "For microservices debugging" },
  { slug: "for-open-source-contributors", title: "For open-source contributors" },
  { slug: "for-mobile-web-testing", title: "For mobile web testing" },
  { slug: "for-data-migration-tasks", title: "For data migration tasks" },
  { slug: "for-security-review-prep", title: "For security review prep" },
  { slug: "for-performance-profiling-notes", title: "For performance profiling notes" },
  { slug: "for-cross-team-handoffs", title: "For cross-team handoffs" },
  { slug: "for-automation-scripting-prep", title: "For automation & scripting prep" },
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
