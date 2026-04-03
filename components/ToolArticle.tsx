import Link from "next/link";
import { Breadcrumbs, type Crumb } from "@/components/Breadcrumbs";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { FaqBlock } from "@/components/FaqBlock";
import { FaqJsonLd } from "@/components/FaqJsonLd";
import { GlassPanel } from "@/components/GlassPanel";
import { ToolRunner } from "@/components/ToolRunner";
import { ToolWebApplicationJsonLd } from "@/components/ToolWebApplicationJsonLd";
import type { ToolDef } from "@/lib/types";
import { DEFAULT_USE_CASE_SLUG, getUseCaseTitle, isValidUseCaseSlug } from "@/lib/use-cases";
import { site } from "@/lib/site";
import {
  buildHubParagraphs,
  buildLongTailParagraphs,
  buildSecondaryFaqs,
  humanizeSeoSlug,
  otherKeywordHrefs,
  otherUseCaseHrefs,
  pickRelatedForLinking,
} from "@/lib/seo-content";

export function ToolArticle({
  tool,
  keyword,
  useCase,
}: {
  tool: ToolDef;
  /** SEO keyword segment (matches `seoSlugs` in tools.json) */
  keyword?: string;
  /** Use-case segment, e.g. `for-developers` */
  useCase?: string;
}) {
  const longTail =
    keyword != null &&
    tool.seoSlugs.includes(keyword) &&
    useCase != null &&
    isValidUseCaseSlug(useCase);

  const focus = longTail ? humanizeSeoSlug(keyword) : tool.name;
  const scenarioTitle = longTail ? getUseCaseTitle(useCase) : null;
  const h1 = longTail ? `${tool.name} — ${focus} (${scenarioTitle})` : tool.name;

  const crumbs: Crumb[] = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: tool.name, href: `/tools/${tool.slug}` },
    ...(longTail
      ? [
          {
            label: `${focus} — ${scenarioTitle}`,
            href: `/tools/${tool.slug}/${keyword}/${useCase}`,
          },
        ]
      : []),
  ];

  const paragraphs = longTail
    ? buildLongTailParagraphs(tool, keyword, useCase)
    : buildHubParagraphs(tool);

  const primaryKeyword = longTail ? keyword : tool.seoSlugs[0] ?? tool.slug;
  const extraFaqs = buildSecondaryFaqs(tool, primaryKeyword, longTail ? useCase : undefined);
  const faqAll = [...tool.faq, ...extraFaqs].slice(0, 8);

  const keywordVariations = longTail
    ? otherKeywordHrefs(tool, keyword, useCase)
    : otherKeywordHrefs(tool, tool.seoSlugs[0] ?? tool.slug, DEFAULT_USE_CASE_SLUG);

  const useCaseVariations = longTail ? otherUseCaseHrefs(tool, keyword, useCase) : [];
  const related = pickRelatedForLinking(tool.slug, 3);

  const canonicalPath = longTail
    ? `/tools/${tool.slug}/${keyword}/${useCase}`
    : `/tools/${tool.slug}`;

  return (
    <article className="mx-auto max-w-4xl min-w-0 px-3 py-8 sm:px-4 sm:py-10">
      <BreadcrumbJsonLd items={crumbs} />
      <ToolWebApplicationJsonLd tool={tool} pageUrl={`${site.url}${canonicalPath}`} />
      <FaqJsonLd items={faqAll} />
      <div className="flex min-w-0 flex-col gap-2">
        <Breadcrumbs items={crumbs} />
        <p className="break-words text-xs text-slate-600 dark:text-slate-500">
          Canonical path:{" "}
          <Link href={canonicalPath} className="break-all text-sky-700 hover:underline dark:text-cyan-400">
            {canonicalPath}
          </Link>
        </p>
      </div>

      <header className="mt-6 min-w-0">
        <p className="text-sm font-medium text-sky-700 dark:text-cyan-300/80">{tool.category}</p>
        <h1 className="mt-2 text-balance break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl dark:text-white">
          {h1}
        </h1>
        <p className="mt-4 text-base text-slate-700 sm:text-lg dark:text-slate-300">{tool.description}</p>
      </header>

      <GlassPanel className="mt-8 min-w-0 p-4 sm:p-5 md:p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Use the tool</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Runs in your browser — no account required for basic usage.</p>
        <div className="mt-6">
          <ToolRunner tool={tool} />
        </div>
      </GlassPanel>

      <section className="mt-10 max-w-none space-y-4 break-words text-slate-700 sm:mt-12 dark:text-slate-300">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
          Why {tool.name} matters for everyday developer work
        </h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="leading-relaxed">
            {p}
          </p>
        ))}
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">People also ask (quick answers)</h2>
        <ul className="list-disc space-y-3 pl-6">
          {extraFaqs.map((f, i) => (
            <li key={i}>
              <strong className="text-slate-900 dark:text-slate-200">{f.q}</strong> — {f.a}
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">Related searches on {site.domain}</h2>
        <p className="leading-relaxed">
          Explore complementary utilities in the same session. If you are working with payloads you may also need
          validators, encoders, or generators — browse the grid on the{" "}
          <Link href="/" className="text-sky-700 hover:underline dark:text-cyan-300">
            homepage
          </Link>{" "}
          or open the{" "}
          <Link href={`/category/${encodeURIComponent(tool.category)}`} className="text-sky-700 hover:underline dark:text-cyan-300">
            {tool.category} category
          </Link>{" "}
          for more tools like this.
        </p>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <GlassPanel className="p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white">Other keyword angles</h3>
          <ul className="mt-3 space-y-2 text-sm text-sky-800 dark:text-cyan-200/90">
            {keywordVariations.map((v) => (
              <li key={v.href}>
                <Link className="hover:underline" href={v.href}>
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>
        </GlassPanel>
        <GlassPanel className="min-w-0 p-4 sm:p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white">Related tools</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            {related.map((r) => (
              <li key={r.slug}>
                <Link className="text-sky-700 hover:underline dark:text-cyan-300" href={`/tools/${r.slug}`}>
                  {r.name}
                </Link>
                <span className="text-slate-500 dark:text-slate-500"> — {r.category}</span>
              </li>
            ))}
          </ul>
        </GlassPanel>
      </section>

      {useCaseVariations.length > 0 && (
        <GlassPanel className="mt-6 min-w-0 p-4 sm:p-5">
          <h3 className="font-semibold text-slate-900 dark:text-white">Same keyword, different scenario</h3>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm text-amber-900 dark:text-amber-200/90 sm:gap-3">
            {useCaseVariations.map((v) => (
              <li key={v.href}>
                <Link
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
                  href={v.href}
                >
                  {v.label}
                </Link>
              </li>
            ))}
          </ul>
        </GlassPanel>
      )}

      <div className="mt-12">
        <FaqBlock items={faqAll} />
      </div>
    </article>
  );
}
