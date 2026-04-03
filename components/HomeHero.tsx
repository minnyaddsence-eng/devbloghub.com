import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export function HomeHero() {
  return (
    <section className="relative px-3 pb-12 pt-8 sm:px-4 sm:pb-16 sm:pt-10 md:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl sm:-right-24 sm:top-10 sm:h-64 sm:w-64"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl sm:-left-16 sm:h-56 sm:w-56"
      />

      <div className="relative mx-auto max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-8 shadow-lg shadow-sky-950/20 backdrop-blur-sm sm:rounded-3xl sm:px-6 sm:py-10 md:px-12 md:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-sky-500/15 blur-3xl sm:-right-20 sm:h-56 sm:w-56"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl sm:-left-16 sm:h-48 sm:w-48"
          />

          <div className="relative mx-auto flex max-w-4xl min-w-0 flex-col items-center text-center">
            <div className="mb-4 sm:mb-6">
              <BrandLogo size="lg" priority decorative />
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-cyan-300/90 sm:text-sm sm:tracking-[0.2em]">
              DevBlogHubTools
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold leading-tight tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
              100+ Free Developer &amp; SEO Tools
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:mt-6 sm:text-lg">
              Static-first, fast, and built for organic search. Format JSON, encode Base64, generate UUIDs, decode
              JWTs, and more — with client-side processing and expandable coverage.
            </p>
            <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:mt-8 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                href="/tools"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-6 text-sm font-semibold text-slate-950 shadow-md transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Explore all tools
              </Link>
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 text-sm font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              >
                Read the blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
