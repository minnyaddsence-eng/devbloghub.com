"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/tools/tool-ui";

export function WordCounterTool() {
  const [text, setText] = useState("Count me in, DevBlogHub.");
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const nospace = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    const minutes = words / 200;
    return { words, chars, nospace, lines, minutes };
  }, [text]);

  const statBox =
    "rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-black/30";

  return (
    <div className="space-y-4">
      <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
        <div className={statBox}>
          <dt className="text-slate-500 dark:text-slate-400">Words</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{stats.words}</dd>
        </div>
        <div className={statBox}>
          <dt className="text-slate-500 dark:text-slate-400">Characters</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{stats.chars}</dd>
        </div>
        <div className={statBox}>
          <dt className="text-slate-500 dark:text-slate-400">No spaces</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{stats.nospace}</dd>
        </div>
        <div className={statBox}>
          <dt className="text-slate-500 dark:text-slate-400">Lines</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">{stats.lines}</dd>
        </div>
        <div className={statBox}>
          <dt className="text-slate-500 dark:text-slate-400">Reading time</dt>
          <dd className="text-lg font-semibold text-slate-900 dark:text-white">~{Math.max(0.1, stats.minutes).toFixed(1)} min</dd>
        </div>
      </dl>
      <textarea className={inputClass} value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
