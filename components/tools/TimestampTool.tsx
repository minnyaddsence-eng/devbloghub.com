"use client";

import { useMemo, useState } from "react";
import { btnClass, btnGhost } from "@/components/tools/tool-ui";

export function TimestampTool() {
  const [raw, setRaw] = useState(String(Math.floor(Date.now() / 1000)));
  const parsed = useMemo(() => {
    const n = Number(raw.trim());
    if (!Number.isFinite(n)) return { error: "Enter a number" as const };
    const ms = n > 1e12 ? n : n * 1000;
    const d = new Date(ms);
    if (Number.isNaN(d.getTime())) return { error: "Invalid date" as const };
    return { iso: d.toISOString(), local: d.toString(), ms };
  }, [raw]);

  const setNow = () => setRaw(String(Math.floor(Date.now() / 1000)));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnClass} onClick={setNow}>
          Now (seconds)
        </button>
        <button type="button" className={btnGhost} onClick={() => setRaw(String(Date.now()))}>
          Now (ms)
        </button>
      </div>
      <input
        className="w-full rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm text-slate-100 outline-none focus:ring-2 focus:ring-cyan-500/40"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        inputMode="numeric"
      />
      {"error" in parsed && parsed.error ? (
        <p className="text-sm text-rose-300">{parsed.error}</p>
      ) : (
        <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">
          <p>
            <span className="text-slate-400">ISO:</span> {parsed.iso}
          </p>
          <p>
            <span className="text-slate-400">Local:</span> {parsed.local}
          </p>
          <p>
            <span className="text-slate-400">Milliseconds:</span> {parsed.ms}
          </p>
        </div>
      )}
    </div>
  );
}
