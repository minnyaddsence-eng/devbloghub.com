import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { getToolsInSlugOrder, HOME_TOP_TOOL_SLUGS } from "@/lib/tools";
import { site } from "@/lib/site";

const footerToolLinks = getToolsInSlugOrder(HOME_TOP_TOOL_SLUGS.slice(0, 8));

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-slate-950/90 py-10 backdrop-blur-sm sm:mt-20 sm:py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-3 sm:gap-10 sm:px-4 md:grid-cols-3 md:gap-8 md:px-6">
        <div className="flex min-w-0 gap-3 sm:gap-4">
          <BrandLogo size="lg" className="shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-white">{site.name}</p>
            <p className="mt-2 break-words text-sm leading-relaxed text-slate-400">{site.description}</p>
            <p className="mt-4 text-sm font-medium text-slate-200">Popular tools</p>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-cyan-300/90">
              {footerToolLinks.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tools/${t.slug}`} className="hover:text-cyan-200 hover:underline">
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm">
              <Link href="/tools" className="text-slate-400 hover:text-cyan-300 hover:underline">
                All tools →
              </Link>
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Legal</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-400">
            <li>
              <Link href="/privacy" className="transition hover:text-cyan-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition hover:text-cyan-300">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition hover:text-cyan-300">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition hover:text-cyan-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">Built for</p>
          <p className="mt-2 break-words text-sm leading-relaxed text-slate-400">
            Organic SEO, developer workflows, and AdSense-ready layouts. Hosted on {site.domain}.
          </p>
        </div>
      </div>
      <p className="mt-10 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} {site.name}. Client-side tools where possible.
      </p>
    </footer>
  );
}
