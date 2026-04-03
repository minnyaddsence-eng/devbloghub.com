import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`max-w-full min-w-0 rounded-2xl border border-slate-200/80 bg-white/75 shadow-lg shadow-slate-200/40 backdrop-blur-xl dark:border-white/15 dark:bg-white/[0.07] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}
