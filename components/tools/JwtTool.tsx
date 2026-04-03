"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { inputClass } from "@/components/tools/tool-ui";

function decodePart(p: string) {
  const pad = p.length % 4 === 0 ? "" : "=".repeat(4 - (p.length % 4));
  const b64 = p.replace(/-/g, "+").replace(/_/g, "/") + pad;
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch {
    try {
      return atob(b64);
    } catch {
      return "(unable to decode)";
    }
  }
}

export function JwtTool() {
  const [jwt, setJwt] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldkJsb2dIdWIifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  );

  const parts = useMemo(() => {
    const [h, p] = jwt.split(".");
    if (!h || !p) return { header: "", payload: "" };
    return { header: decodePart(h), payload: decodePart(p) };
  }, [jwt]);

  const preClass =
    "max-h-64 overflow-auto rounded-xl border border-slate-200 bg-slate-950 p-3 text-xs text-emerald-100 dark:border-white/10 dark:bg-black/40 dark:text-cyan-100";

  return (
    <div className="space-y-4">
      <p className="text-sm text-amber-900 dark:text-amber-200/90">
        Signature is not verified. Never paste production secrets you cannot rotate.
      </p>
      <label className="block text-sm text-slate-600 dark:text-slate-400">
        JWT string
        <textarea className={`${inputClass} mt-1`} value={jwt} onChange={(e) => setJwt(e.target.value)} spellCheck={false} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-300">Header</h3>
            {parts.header ? <CopyButton text={parts.header} label="Copy header" /> : null}
          </div>
          <pre className={preClass}>{parts.header}</pre>
        </div>
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-slate-800 dark:text-slate-300">Payload</h3>
            {parts.payload ? <CopyButton text={parts.payload} label="Copy payload" /> : null}
          </div>
          <pre className={preClass}>{parts.payload}</pre>
        </div>
      </div>
    </div>
  );
}
