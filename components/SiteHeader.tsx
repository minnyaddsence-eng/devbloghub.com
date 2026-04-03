"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

const nav = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "All tools" },
  { href: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur-md dark:border-white/10 dark:bg-slate-950/80 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-3 py-2 sm:gap-4 sm:px-4 sm:py-3 md:gap-6 md:px-8">
        <Link
          href="/"
          aria-label="DevBlogHubTools home"
          className="group flex min-w-0 shrink items-center gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sky-400 sm:gap-2"
        >
          <BrandLogo size="md" priority decorative />
            <span className="hidden min-w-0 flex-col leading-tight sm:flex">
            <span className="truncate bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-500 bg-clip-text text-xs font-bold text-transparent dark:from-sky-300 dark:via-indigo-300 dark:to-sky-200 sm:text-sm md:text-base">
              DevBlogHubTools
            </span>
            <span className="hidden truncate text-[11px] text-slate-500 dark:text-slate-500 md:block">
              Free dev utilities + guides
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-auto flex max-w-[55%] flex-nowrap justify-end gap-0.5 overflow-x-auto py-1 [-webkit-overflow-scrolling:touch] sm:max-w-none sm:flex-wrap sm:gap-1 sm:overflow-visible sm:py-0 md:mr-2"
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : item.href === "/tools"
                  ? pathname === "/tools"
                  : pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-2.5 text-xs font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-sky-400 sm:px-3 sm:py-1.5 sm:text-sm ${
                  active
                    ? "bg-sky-100 text-sky-900 dark:bg-white/10 dark:text-sky-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
