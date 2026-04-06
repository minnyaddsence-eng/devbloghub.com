export const site = {
  name: "DevBlogHub",
  domain: "devbloghub.com",
  /** Prefer www — matches typical Vercel primary domain & avoids apex→www redirect on sitemap `<loc>` (GSC “Couldn’t fetch”). */
  url: "https://www.devbloghub.com",
  tagline: "100+ Free Developer & SEO Tools",
  description:
    "Free, fast, client-side developer tools — JSON, Base64, JWT, passwords, and more. Built for SEO, speed, and AdSense-friendly layouts.",
} as const;

/** E-E-A-T / schema.org Person — update name when you publish a real byline. */
export const sitePrimaryAuthor = {
  name: "DevBlogHub Maintainer",
  jobTitle: "Backend Developer",
  description:
    "Backend developer with one year of professional experience shipping web utilities, APIs, and SEO-friendly static experiences.",
  knowsAbout: ["Web development", "Developer tools", "Browser-based utilities", "Technical SEO"],
} as const;
