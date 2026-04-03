"use client";

import { useMemo, useState } from "react";
import { inputClass } from "@/components/tools/tool-ui";

export function JsonValidatorTool() {
  const [raw, setRaw] = useState("{}");
  const result = useMemo(() => {
    try {
      JSON.parse(raw);
      return { ok: true as const, msg: "Valid JSON" };
    } catch (e) {
      return { ok: false as const, msg: e instanceof Error ? e.message : "Invalid" };
    }
  }, [raw]);

  return (
    <div className="space-y-4">
      <p
        className={`text-sm font-medium ${result.ok ? "text-emerald-300" : "text-rose-300"}`}
        role="status"
        aria-live="polite"
      >
        {result.msg}
      </p>
      <label className="block text-sm text-slate-400">
        JSON to validate
        <textarea className={`${inputClass} mt-1`} value={raw} onChange={(e) => setRaw(e.target.value)} spellCheck={false} />
      </label>
    </div>
  );
}
