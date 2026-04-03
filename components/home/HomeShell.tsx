"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { GlassPanel } from "@/components/GlassPanel";
import {
  HOME_CATEGORY_TABS,
  toolMatchesHomeCategory,
  type HomeCategoryId,
} from "@/lib/home-categories";
import { readRecentToolSlugs, rememberToolVisit } from "@/lib/recent-tools";
import { site } from "@/lib/site";
import type { ToolDef } from "@/lib/types";
import { categoryEmoji, pseudoUses } from "@/lib/tool-visuals";
import { getToolsInSlugOrder, HOME_TRENDING_TOOL_SLUGS } from "@/lib/tools";

const HOME_GRID_LIMIT = 24;

const trustStats = [
  { label: "100+ free tools", sub: "No signup wall", icon: "🧰", tone: "from-sky-500 to-cyan-500" },
  { label: "100K+ developers", sub: "Growing community", icon: "👥", tone: "from-violet-500 to-fuchsia-500" },
  { label: "10M+ tool uses", sub: "Fast client-side UX", icon: "⚡", tone: "from-amber-500 to-orange-500" },
  { label: "99.9% uptime", sub: "Static-first delivery", icon: "📈", tone: "from-emerald-500 to-teal-500" },
] as const;

function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}

export function HomeShell({ tools }: { tools: ToolDef[] }) {
  const reduced = useReducedMotion();
  const [tab, setTab] = useState<HomeCategoryId>("all");
  const [query, setQuery] = useState("");
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);

  useEffect(() => {
    setRecentSlugs(readRecentToolSlugs());
  }, []);

  const onToolOpen = useCallback((slug: string) => {
    setRecentSlugs(rememberToolVisit(slug));
  }, []);

  const bySlug = useMemo(() => new Map(tools.map((t) => [t.slug, t])), [tools]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (!toolMatchesHomeCategory(t, tab)) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.slug.includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [tools, tab, query]);

  const gridTools = filtered.slice(0, HOME_GRID_LIMIT);
  const trending = getToolsInSlugOrder(HOME_TRENDING_TOOL_SLUGS);
  const recentTools = recentSlugs.map((s) => bySlug.get(s)).filter((t): t is ToolDef => Boolean(t));

  return (
    <div className="min-w-0 pb-8 sm:pb-12">
      {/* Hero */}
      <section className="relative overflow-hidden px-3 pb-10 pt-6 sm:px-4 sm:pb-14 sm:pt-8 md:pt-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_70%_20%,rgba(59,130,246,0.2),transparent_55%)] dark:bg-[radial-gradient(ellipse_90%_60%_at_70%_20%,rgba(59,130,246,0.28),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-500/25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 bottom-10 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/15"
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-12">
          <div className="min-w-0">
            <FadeUp>
              <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-sky-800 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-cyan-200/95">
                <span aria-hidden>⭐</span>
                <span>100+ free tools</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span>No sign up</span>
                <span className="text-slate-400 dark:text-slate-500">·</span>
                <span>100% free</span>
              </p>
            </FadeUp>

            <FadeUp delay={0.06} className="mt-5">
              <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[3.25rem] dark:text-white">
                Powerful Developer &amp; SEO Tools.{" "}
                <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-violet-600 bg-clip-text text-transparent dark:from-sky-300 dark:via-cyan-300 dark:to-violet-300">
                  All Free.
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.12} className="mt-4 max-w-xl">
              <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Lightning-fast utilities in your browser — format JSON, encode Base64, generate UUIDs, test regex, and ship
                SEO-friendly pages. Built static-first for speed, privacy, and organic discovery.
              </p>
            </FadeUp>

            <FadeUp delay={0.18} className="mt-7 flex w-full max-w-lg flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <motion.span
                className="inline-flex"
                animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Link
                  href="/tools"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-7 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 outline-none ring-offset-2 transition hover:brightness-110 hover:shadow-xl hover:shadow-sky-500/30 focus-visible:ring-2 focus-visible:ring-sky-400 dark:from-sky-500 dark:to-cyan-400 dark:text-slate-950 dark:shadow-cyan-500/20 sm:w-auto"
                >
                  Explore all tools →
                </Link>
              </motion.span>
              <Link
                href="/blog"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-slate-300/90 bg-white/60 px-7 text-sm font-semibold text-slate-800 backdrop-blur-sm transition hover:border-sky-300 hover:bg-sky-50/90 dark:border-white/20 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10 sm:w-auto"
              >
                Read the blog
              </Link>
            </FadeUp>

            <FadeUp delay={0.24} className="mt-8">
              <ul className="flex flex-wrap gap-3 text-xs font-medium text-slate-600 sm:gap-4 sm:text-sm dark:text-slate-400">
                {[
                  { icon: "⚡", t: "Fast & reliable" },
                  { icon: "🔒", t: "Privacy first" },
                  { icon: "💻", t: "Developer made" },
                ].map((x) => (
                  <li
                    key={x.t}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/50 px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <span aria-hidden>{x.icon}</span>
                    {x.t}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          {/* Floating editor mock */}
          <motion.div
            className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none"
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-sky-500/20 via-violet-500/15 to-cyan-400/20 blur-2xl dark:from-sky-500/30 dark:via-violet-500/25 dark:to-cyan-400/20"
            />
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-2xl shadow-slate-900/20 dark:border-white/15 dark:shadow-black/40">
              <div className="flex items-center gap-2 border-b border-white/10 bg-slate-950/80 px-3 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/90" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/90" />
                <span className="ml-2 font-mono text-[10px] text-slate-500">preview.json</span>
              </div>
              <div className="p-4 font-mono text-[11px] leading-relaxed sm:text-xs">
                <span className="text-slate-500">{"{"}</span>
                {"\n  "}
                <span className="text-sky-300">&quot;name&quot;</span>
                <span className="text-slate-500">: </span>
                <span className="text-emerald-300">&quot;DevBlogHub&quot;</span>
                <span className="text-slate-500">,</span>
                {"\n  "}
                <span className="text-sky-300">&quot;valid&quot;</span>
                <span className="text-slate-500">: </span>
                <span className="text-amber-300">true</span>
                {"\n"}
                <span className="text-slate-500">{"}"}</span>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-white/10 bg-slate-950/60 px-3 py-2.5">
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                  Valid JSON
                </span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-slate-400">Prettify</span>
                <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-slate-400">Minify</span>
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-6 top-1/4 text-4xl opacity-40 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]"
            >
              {"{ }"}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-10 px-3 sm:space-y-12 sm:px-4">
        <AdPlaceholder className="px-3" />

        {/* Category tabs + search */}
        <div className="space-y-4">
          <div
            className="-mx-1 flex gap-2 overflow-x-auto pb-1 pl-0.5 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:pb-0"
            role="tablist"
            aria-label="Tool categories"
          >
            {HOME_CATEGORY_TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition sm:py-2 ${
                    active
                      ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-500/25 dark:from-sky-500 dark:to-cyan-400 dark:text-slate-950"
                      : "border border-slate-200/90 bg-white/70 text-slate-700 hover:border-sky-300/60 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400/30"
                  }`}
                >
                  <span aria-hidden>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>

          <label className="block max-w-xl">
            <span className="sr-only">Search tools</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try: json to csv, base64, uuid…"
              autoComplete="off"
              className="box-border w-full min-h-12 rounded-xl border border-slate-200/90 bg-white/80 px-4 py-3 text-base text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30 dark:border-white/15 dark:bg-black/25 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-cyan-500/50 dark:focus:ring-cyan-500/25 sm:text-sm"
            />
          </label>
        </div>

        {/* Featured tool */}
        <section aria-labelledby="featured-tool-heading">
          <GlassPanel className="overflow-hidden p-0">
            <div className="grid lg:grid-cols-2">
              <div className="border-b border-slate-200/80 p-5 sm:p-6 lg:border-b-0 lg:border-r dark:border-white/10">
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-white/10">
                  <span className="font-mono text-[10px] text-slate-500 sm:text-xs dark:text-slate-400">sample.json</span>
                  <div className="flex gap-1.5">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      Prettify
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      Minify
                    </span>
                  </div>
                </div>
                <pre className="max-h-[220px] overflow-auto p-4 font-mono text-[11px] leading-relaxed text-slate-800 sm:text-xs dark:text-slate-200">
                  {`{\n  "app": "DevBlogHubTools",\n  "tools": 100,\n  "mode": "client-side"\n}`}
                </pre>
                <p className="border-t border-slate-200/60 px-4 py-2 text-xs font-medium text-emerald-600 dark:border-white/10 dark:text-emerald-400">
                  ✓ Valid JSON
                </p>
              </div>
              <div className="flex flex-col justify-center p-5 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400/90">
                  ⭐ Featured tool
                </p>
                <h2 id="featured-tool-heading" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                  JSON Formatter
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Beautify, minify, and validate JSON instantly in your browser. Real-time feedback, syntax-aware
                  highlighting, and no uploads — ideal for APIs, configs, and debugging.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  {["Real-time formatting", "Syntax error highlighting", "Works offline in-tab"].map((x) => (
                    <li key={x} className="flex gap-2">
                      <span className="text-sky-500 dark:text-cyan-400">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/tools/json-formatter"
                  onClick={() => onToolOpen("json-formatter")}
                  className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-sky-600 to-cyan-500 px-6 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 sm:w-auto dark:from-sky-500 dark:to-cyan-400 dark:text-slate-950"
                >
                  Try JSON Formatter →
                </Link>
              </div>
            </div>
          </GlassPanel>
        </section>

        <AdPlaceholder />

        {/* Tool grid */}
        <section aria-labelledby="tools-grid-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="tools-grid-heading" className="text-xl font-bold text-slate-900 dark:text-white">
                Top picks
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {filtered.length} match{filtered.length !== 1 ? "es" : ""} · showing {gridTools.length}
                {filtered.length > HOME_GRID_LIMIT ? ` of ${filtered.length}` : ""}
              </p>
            </div>
            <Link
              href="/tools"
              className="text-sm font-semibold text-sky-600 underline-offset-4 hover:underline dark:text-cyan-300/90 dark:hover:text-cyan-200"
            >
              Full directory →
            </Link>
          </div>

          <ul className="mt-6 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gridTools.map((tool) => (
              <li key={tool.slug} className="min-w-0">
                <Link href={`/tools/${tool.slug}`} onClick={() => onToolOpen(tool.slug)} className="block min-w-0">
                  <GlassPanel className="home-tool-card group h-full min-h-[9.5rem] border-slate-200/70 p-4 hover:border-sky-400/50 dark:border-white/12 dark:hover:border-cyan-400/45 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100 text-xl shadow-inner dark:from-sky-500/20 dark:to-cyan-500/10"
                        aria-hidden
                      >
                        {categoryEmoji(tool.category)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-white/10 dark:text-slate-400">
                        {tool.category}
                      </span>
                    </div>
                    <h3 className="mt-3 break-words text-base font-semibold text-slate-900 group-hover:text-sky-700 dark:text-white dark:group-hover:text-cyan-200">
                      {tool.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{tool.description}</p>
                    <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-500">
                      👥 {pseudoUses(tool.slug)}
                    </p>
                  </GlassPanel>
                </Link>
              </li>
            ))}
          </ul>

          {gridTools.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500 dark:border-white/15 dark:text-slate-400">
              No tools match your filters.{" "}
              <button type="button" className="font-semibold text-sky-600 underline dark:text-cyan-300" onClick={() => { setTab("all"); setQuery(""); }}>
                Reset
              </button>
            </p>
          ) : null}
        </section>

        {/* Trust bar */}
        <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-sky-50/90 via-white to-violet-50/80 p-4 shadow-sm dark:border-white/10 dark:from-sky-950/40 dark:via-slate-950/60 dark:to-violet-950/40 sm:p-6">
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {trustStats.map((s) => (
              <li key={s.label} className="flex min-w-0 gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.tone} text-lg text-white shadow-md`}
                  aria-hidden
                >
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{s.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Trending */}
        <section aria-labelledby="trending-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="trending-heading" className="text-xl font-bold text-slate-900 dark:text-white">
                Trending tools
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Quick access to popular utilities</p>
            </div>
          </div>
          <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-webkit-overflow-scrolling:touch] sm:grid sm:snap-none sm:grid-cols-2 sm:overflow-visible md:grid-cols-4 lg:gap-4">
            {trending.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                onClick={() => onToolOpen(t.slug)}
                className="min-w-[min(100%,240px)] shrink-0 snap-start sm:min-w-0"
              >
                <GlassPanel className="home-tool-card h-full p-4 hover:border-sky-400/50 dark:hover:border-cyan-400/45">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>
                      {categoryEmoji(t.category)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pseudoUses(t.slug)}</p>
                    </div>
                  </div>
                </GlassPanel>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently used */}
        {recentTools.length > 0 ? (
          <section aria-labelledby="recent-heading">
            <h2 id="recent-heading" className="text-xl font-bold text-slate-900 dark:text-white">
              Recently used
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Stored locally in your browser</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {recentTools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-800 transition hover:border-sky-300 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:border-cyan-400/40"
                  >
                    <span aria-hidden>{categoryEmoji(t.category)}</span>
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* SEO block */}
        <section aria-labelledby="seo-about-heading">
          <GlassPanel className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-2xl text-white shadow-lg dark:from-sky-400 dark:to-cyan-300 dark:text-slate-950"
                aria-hidden
              >
                🔎
              </div>
              <div className="min-w-0">
                <h2 id="seo-about-heading" className="text-lg font-bold text-slate-900 dark:text-white">
                  Free developer &amp; SEO tools for everyday shipping
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  <p>
                    {site.name} bundles 100+ browser-based utilities — JSON formatters and validators, Base64 and URL
                    encoders, UUID and hash generators, JWT helpers, regex testers, CSV/JSON/YAML converters, text
                    counters, and SEO-focused helpers — so you can move faster without installing desktop software.
                  </p>
                  <p>
                    Tools are designed for privacy-aware workflows: processing stays in your browser when possible, pages
                    are static-first for speed, and the site structure helps search engines discover long-tail tool pages.
                    Whether you are debugging an API payload, preparing content, or validating data, you get a consistent,
                    fast UI on desktop and mobile.
                  </p>
                </div>
              </div>
            </div>
          </GlassPanel>
        </section>

        <AdPlaceholder />
      </div>
    </div>
  );
}
