import { site } from "@/lib/site";

/** Default OG / Twitter preview (under `public/`). */
export const defaultOgImagePath = "/devbloghub-tools-logo.png";

export function absoluteOgImageUrl(): string {
  return new URL(defaultOgImagePath, site.url).href;
}

/** Broad starter list; pages add their own keywords in generateMetadata. */
export const globalSeoKeywords = [
  "developer tools",
  "free online tools",
  "json formatter",
  "base64 encoder",
  "jwt decoder",
  "uuid generator",
  "seo tools",
  "browser tools",
  "client-side tools",
  "devbloghub",
] as const;

export function twitterSiteFromEnv(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_TWITTER_SITE?.trim();
  if (!raw) return undefined;
  return raw.startsWith("@") ? raw : `@${raw}`;
}
