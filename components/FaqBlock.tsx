import { GlassPanel } from "@/components/GlassPanel";

export function FaqBlock({ items }: { items: { q: string; a: string }[] }) {
  return (
    <GlassPanel className="min-w-0 p-4 sm:p-6 md:p-8">
      <h2 className="text-lg font-semibold text-white sm:text-xl">Frequently asked questions</h2>
      <dl className="mt-6 space-y-6">
        {items.map((f, i) => (
          <div key={i}>
            <dt className="break-words font-medium text-cyan-200/90">{f.q}</dt>
            <dd className="mt-2 break-words text-slate-300 leading-relaxed">{f.a}</dd>
          </div>
        ))}
      </dl>
    </GlassPanel>
  );
}
