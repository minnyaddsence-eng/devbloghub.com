"use client";

import { useCallback, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { btnClass, inputClass } from "@/components/tools/tool-ui";

function uuidV4() {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  if (!c?.getRandomValues) throw new Error("Web Crypto API is not available in this environment.");
  const bytes = new Uint8Array(16);
  c.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function UuidTool() {
  const [ids, setIds] = useState<string[]>([]);
  const gen = useCallback((n: number) => {
    const next: string[] = [];
    for (let i = 0; i < n; i++) next.push(uuidV4());
    setIds(next);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={btnClass} onClick={() => gen(1)}>
          Generate 1
        </button>
        <button type="button" className={btnClass} onClick={() => gen(5)}>
          Generate 5
        </button>
        <button type="button" className={btnClass} onClick={() => gen(20)}>
          Generate 20
        </button>
        {ids.length ? <CopyButton text={ids.join("\n")} label="Copy UUIDs" /> : null}
      </div>
      <label className="block text-sm text-slate-400">
        UUID list
        <textarea
          className={`${inputClass} mt-1`}
          readOnly
          value={ids.join("\n")}
          placeholder="Click generate…"
        />
      </label>
    </div>
  );
}
