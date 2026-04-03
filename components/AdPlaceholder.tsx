/** Reserved vertical space for AdSense or other display ads (no network calls). */
export function AdPlaceholder({ label = "Advertisement", className = "" }: { label?: string; className?: string }) {
  return (
    <aside
      aria-label={label}
      className={`mx-auto flex min-h-[90px] max-w-6xl items-center justify-center rounded-2xl border border-dashed border-slate-300/80 bg-slate-100/50 text-slate-400 dark:border-white/15 dark:bg-white/[0.03] dark:text-slate-500 ${className}`}
    >
      <span className="px-4 text-center text-xs font-medium uppercase tracking-wider">{label}</span>
    </aside>
  );
}
