import Image from "next/image";

const SIZE_CLASS = {
  sm: "h-9 w-9",
  md: "h-10 w-10 md:h-11 md:w-11",
  lg: "h-14 w-14 md:h-16 md:w-16",
} as const;

const SIZE_PX = { sm: 36, md: 44, lg: 56 } as const;

export function BrandLogo({
  size = "md",
  showBadge = true,
  className = "",
  priority = false,
  decorative = false,
}: {
  size?: keyof typeof SIZE_CLASS;
  showBadge?: boolean;
  className?: string;
  priority?: boolean;
  /** When true, hide from assistive tech (use when a parent link has aria-label or heading follows). */
  decorative?: boolean;
}) {
  const d = SIZE_PX[size];
  return (
    <span className={`relative inline-flex shrink-0 ${className}`} aria-hidden={decorative || undefined}>
      <Image
        src="/devbloghub-tools-logo.png"
        alt={decorative ? "" : "DevBlogHubTools"}
        width={d}
        height={d}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className={`rounded-xl object-contain shadow-lg shadow-slate-300/50 ring-1 ring-slate-200/80 dark:shadow-sky-900/20 dark:ring-white/10 ${SIZE_CLASS[size]}`}
      />
      {showBadge ? (
        <span
          className="pointer-events-none absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black leading-none text-slate-950 shadow ring-2 ring-white dark:ring-slate-950"
          title="Monetization-ready toolkit"
          aria-hidden
        >
          $
        </span>
      ) : null}
    </span>
  );
}
