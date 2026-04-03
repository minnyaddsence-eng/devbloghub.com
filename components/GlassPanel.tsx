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
      className={`max-w-full min-w-0 rounded-2xl border border-white/15 bg-white/[0.07] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}
