"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ToolDef } from "@/lib/types";
import { GlassPanel } from "@/components/GlassPanel";

const PAGE_SIZE = 12;

type BasePath = "/" | "/tools";

function gridPath(basePath: BasePath, q: string, page: number, paginate: boolean) {
  const p = new URLSearchParams();
  if (q.trim()) p.set("q", q.trim());
  if (paginate && page > 1) p.set("page", String(page));
  const qs = p.toString();
  if (!qs) return basePath;
  return `${basePath}?${qs}`;
}

export function ToolGridClient({
  tools,
  categories,
  basePath = "/",
  paginate = true,
}: {
  tools: ToolDef[];
  categories: string[];
  basePath?: BasePath;
  paginate?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const prevCat = useRef<string | null>(null);

  useEffect(() => {
    setQ(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      const curQ = new URLSearchParams(window.location.search).get("q") ?? "";
      const next = q.trim();
      if (curQ === next) return;
      router.replace(gridPath(basePath, next, 1, paginate), { scroll: false });
    }, 420);
    return () => window.clearTimeout(t);
  }, [q, router, basePath, paginate]);

  useEffect(() => {
    if (prevCat.current === null) {
      prevCat.current = cat;
      return;
    }
    if (prevCat.current === cat) return;
    prevCat.current = cat;
    router.replace(gridPath(basePath, q.trim(), 1, paginate), { scroll: false });
  }, [cat, q, router, basePath, paginate]);

  const urlPageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const urlPage = Number.isFinite(urlPageRaw) && urlPageRaw > 0 ? urlPageRaw : 1;

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return tools.filter((t) => {
      const matchesCat = !cat || t.category === cat;
      const matchesQ =
        !qq ||
        t.name.toLowerCase().includes(qq) ||
        t.slug.includes(qq) ||
        t.description.toLowerCase().includes(qq) ||
        t.keywords.some((k) => k.includes(qq));
      return matchesCat && matchesQ;
    });
  }, [tools, q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = paginate ? Math.min(urlPage, totalPages) : 1;
  const start = (page - 1) * PAGE_SIZE;
  const pageSlice = filtered.slice(start, start + PAGE_SIZE);
  const visible = paginate ? pageSlice : filtered;

  useEffect(() => {
    if (!paginate) return;
    if (urlPage > totalPages) {
      router.replace(gridPath(basePath, q.trim(), totalPages, paginate), { scroll: false });
    }
  }, [paginate, urlPage, totalPages, basePath, q, router]);

  const pageNums = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  return (
    <div className="mx-auto max-w-6xl min-w-0 px-3 pb-16 sm:px-4 sm:pb-20">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-4">
        <label className="w-full min-w-0 md:max-w-md">
          <span className="sr-only">Search tools</span>
          <input
            type="search"
            name="q"
            placeholder="Search tools (json, base64, uuid…)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
            className="box-border w-full min-h-11 rounded-xl border border-slate-200/90 bg-white px-3 py-2.5 text-base text-slate-900 outline-none focus:ring-2 focus:ring-sky-400/50 dark:border-white/15 dark:bg-black/30 dark:text-slate-100 dark:focus:ring-cyan-500/40 sm:px-4 sm:py-3 sm:text-sm"
          />
        </label>
        <div
          className="-mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1 pb-1 [-webkit-overflow-scrolling:touch] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          role="group"
          aria-label="Filter by category"
        >
          <button
            type="button"
            onClick={() => setCat(null)}
            className={`shrink-0 rounded-full px-3 py-2.5 text-sm sm:py-2 ${!cat ? "bg-sky-600 text-white dark:bg-cyan-600" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3 py-2.5 text-sm sm:py-2 ${cat === c ? "bg-sky-600 text-white dark:bg-cyan-600" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-500" aria-live="polite">
        {filtered.length} tool{filtered.length !== 1 ? "s" : ""} shown
        {paginate ? (
          <>
            {" "}
            · page {page} of {totalPages} · {PAGE_SIZE} per page
          </>
        ) : (
          <> · full list</>
        )}
      </p>

      <ul className="mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:mt-10 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t) => (
          <li key={t.slug} className="min-w-0">
            <GlassPanel className="home-tool-card group h-full p-4 transition-colors hover:border-sky-400/50 hover:bg-sky-50/30 dark:hover:border-cyan-400/40 dark:hover:bg-white/[0.09] sm:p-5">
              <Link
                href={`/category/${encodeURIComponent(t.category)}`}
                className="text-xs font-medium uppercase tracking-wide text-sky-700 hover:text-sky-900 dark:text-cyan-300/80 dark:hover:text-cyan-200"
              >
                {t.category}
              </Link>
              <Link href={`/tools/${t.slug}`} className="mt-2 block min-w-0">
                <h2 className="break-words text-base font-semibold text-slate-900 group-hover:text-sky-800 sm:text-lg dark:text-white dark:group-hover:text-cyan-200">
                  {t.name}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{t.description}</p>
              </Link>
            </GlassPanel>
          </li>
        ))}
      </ul>

      {paginate && totalPages > 1 ? (
        <nav
          className="mt-8 flex flex-col items-center gap-4 sm:mt-10"
          aria-label="Tools pagination"
        >
          <div className="flex max-w-full flex-wrap justify-center gap-1.5 sm:gap-2">
            {pageNums.map((num) => (
              <Link
                key={num}
                href={gridPath(basePath, q.trim(), num, paginate)}
                scroll={false}
                className={`inline-flex min-h-10 min-w-10 items-center justify-center rounded-full text-sm font-medium ${
                  num === page
                    ? "bg-sky-600 text-white dark:bg-cyan-600"
                    : "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
                }`}
                aria-current={num === page ? "page" : undefined}
              >
                {num}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {page > 1 ? (
              <Link
                href={gridPath(basePath, q.trim(), page - 1, paginate)}
                scroll={false}
                className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-full px-5 py-2 text-sm text-slate-400 dark:text-slate-600">
                Previous
              </span>
            )}
            {page < totalPages ? (
              <Link
                href={gridPath(basePath, q.trim(), page + 1, paginate)}
                scroll={false}
                className="inline-flex min-h-11 items-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-800 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-full px-5 py-2 text-sm text-slate-400 dark:text-slate-600">
                Next
              </span>
            )}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
