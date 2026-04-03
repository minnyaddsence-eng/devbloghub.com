"use client";

import Link from "next/link";
import type { ToolDef } from "@/lib/types";
import { btnClass } from "@/components/tools/tool-ui";

export function PlaceholderTool({ tool }: { tool: ToolDef }) {
  return (
    <div className="min-w-0 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100 sm:p-6">
      <p className="font-medium">{tool.name} UI is scaffolded</p>
      <p className="mt-2 text-sm text-amber-200/80">
        Metadata, routing, and SEO pages are live. Implement the interactive panel here next — all logic should stay
        client-side.
      </p>
      <Link href="/" className={`${btnClass} mt-4 inline-flex`}>
        Browse other tools
      </Link>
    </div>
  );
}
