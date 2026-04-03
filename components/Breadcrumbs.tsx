import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="min-w-0 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
      <ol className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-slate-400 dark:text-slate-600">/</span>}
            {c.href ? (
              <Link href={c.href} className="break-words text-sky-700 hover:underline dark:text-slate-300 dark:hover:text-cyan-300">
                {c.label}
              </Link>
            ) : (
              <span className="break-words font-medium text-slate-900 dark:text-slate-200">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
