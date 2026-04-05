import type { ToolDef } from "@/lib/types";
import type { UseCaseSlug } from "@/lib/use-cases";
import { getUseCaseTitle } from "@/lib/use-cases";
import { humanizeSeoSlug, longTailContentHash } from "@/lib/seo-content";

type Row = { label: string; value: string };

function buildRows(tool: ToolDef, keyword: string, useCase: UseCaseSlug, h: number): Row[] {
  const focus = humanizeSeoSlug(keyword);
  const scenario = getUseCaseTitle(useCase);
  const kw2 = tool.keywords[1] ?? tool.category;

  const processing =
    h % 3 === 0
      ? "Client-side in the browser where the tool allows — avoid pasting secrets you cannot rotate."
      : h % 3 === 1
        ? "Interactive panel after hydration; start with a tiny sample to confirm output shape."
        : "Best-effort local transforms: keep a saved “before” copy outside the tab for audits.";

  const audience =
    h % 2 === 0
      ? `Teams and individuals working ${scenario.toLowerCase()} who searched “${focus}”.`
      : `Readers who need ${focus} explained in plain language alongside ${tool.name}.`;

  const baseRows: Row[] = [
    { label: "Scenario", value: `${scenario} — tailored notes for this URL.` },
    { label: "Keyword focus", value: focus },
    { label: "Tool family", value: `${tool.name} (${tool.category})` },
    { label: "Suggested workflow", value: `Start with a minimal sample → run ${tool.name} → compare to a known-good reference.` },
    { label: "Related intent", value: `Also relevant for searches around ${kw2}.` },
    { label: "Processing model", value: processing },
    { label: "Audience", value: audience },
  ];

  const order = baseRows.map((_, i) => (i + h) % baseRows.length);
  return order.map((idx) => baseRows[idx]!);
}

export function UseCaseSpecifications({
  tool,
  keyword,
  useCase,
}: {
  tool: ToolDef;
  keyword: string;
  useCase: UseCaseSlug;
}) {
  const h = longTailContentHash(tool.slug, keyword, useCase);
  const rows = buildRows(tool, keyword, useCase, h);
  const layout = h % 2;

  if (layout === 0) {
    return (
      <GlassTable title="Use-case specifications" rows={rows} />
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-white/12 dark:bg-white/[0.04] sm:p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Use-case specifications</h2>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
        {humanizeSeoSlug(keyword)} · {getUseCaseTitle(useCase)}
      </p>
      <ul className="mt-4 space-y-3 text-sm text-slate-700 dark:text-slate-300">
        {rows.map((r) => (
          <li key={r.label} className="border-b border-slate-100 pb-3 last:border-0 dark:border-white/10">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{r.label}: </span>
            {r.value}
          </li>
        ))}
      </ul>
    </section>
  );
}

function GlassTable({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 shadow-sm dark:border-white/12 dark:bg-white/[0.04]">
      <div className="border-b border-slate-200/80 px-4 py-3 dark:border-white/10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] text-left text-sm">
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-slate-100 last:border-0 dark:border-white/10">
                <th className="whitespace-nowrap bg-slate-50/80 px-4 py-3 font-semibold text-slate-800 dark:bg-white/5 dark:text-slate-200">
                  {r.label}
                </th>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
