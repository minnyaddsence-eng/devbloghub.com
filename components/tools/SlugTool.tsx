"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/tools/tool-ui";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function SlugTool() {
  const [text, setText] = useState("DevBlogHub: Free JSON Formatter Online!");
  const out = useMemo(() => slugify(text), [text]);

  return (
    <div className="space-y-4">
      <label className="block text-sm text-slate-700 dark:text-slate-300">
        Slug
        <input
          readOnly
          value={out}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-sm text-emerald-100 dark:border-white/10 dark:bg-black/40 dark:text-cyan-200"
        />
      </label>
      <textarea className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
