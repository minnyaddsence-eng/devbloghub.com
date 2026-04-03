import Link from "next/link";
import { GlassPanel } from "@/components/GlassPanel";
import { getToolsInSlugOrder, HOME_TOP_TOOL_SLUGS, HOME_TRENDING_TOOL_SLUGS } from "@/lib/tools";

function SpotlightRow({
  title,
  subtitle,
  tools,
  badge,
}: {
  title: string;
  subtitle: string;
  tools: ReturnType<typeof getToolsInSlugOrder>;
  badge: string;
}) {
  if (tools.length === 0) return null;

  return (
    <section className="px-3 sm:px-4" aria-labelledby={`spotlight-${badge}`}>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id={`spotlight-${badge}`} className="text-lg font-semibold text-white md:text-xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyan-200/90">
            {badge}
          </span>
        </div>
        <div className="mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pl-0.5 [-ms-overflow-style:none] [scrollbar-width:thin] sm:gap-4 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:snap-none lg:grid-cols-4 [&::-webkit-scrollbar]:h-1.5">
          {tools.map((t) => (
            <Link
              key={t.slug}
              href={`/tools/${t.slug}`}
              className="min-w-[min(100%,260px)] shrink-0 snap-start sm:min-w-[min(100%,280px)] md:min-w-0"
            >
              <GlassPanel className="group h-full min-w-0 p-4 transition-colors hover:border-cyan-400/40 hover:bg-white/[0.09] md:min-h-[7.5rem]">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-300/75">{t.category}</p>
                <h3 className="mt-1.5 break-words text-base font-semibold text-white group-hover:text-cyan-200">
                  {t.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-400">{t.description}</p>
              </GlassPanel>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeSpotlights() {
  const top = getToolsInSlugOrder(HOME_TOP_TOOL_SLUGS);
  const trending = getToolsInSlugOrder(HOME_TRENDING_TOOL_SLUGS);

  return (
    <div className="space-y-12 pb-4 pt-2 md:space-y-14">
      <SpotlightRow
        title="Top picks"
        subtitle="Most-used utilities for everyday dev work."
        tools={top}
        badge="Top"
      />
      <SpotlightRow
        title="Trending"
        subtitle="Popular this week with teams and indie builders."
        tools={trending}
        badge="Trending"
      />
      <div className="mx-auto max-w-6xl px-3 text-center sm:px-4">
        <Link
          href="/tools"
          className="text-sm font-medium text-cyan-300/90 underline-offset-4 hover:text-cyan-200 hover:underline"
        >
          View all tools in one list →
        </Link>
      </div>
    </div>
  );
}
