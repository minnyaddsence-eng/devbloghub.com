"use client";

import { useCallback, useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { btnClass, inputClass } from "@/components/tools/tool-ui";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUM = "0123456789";
const SYM = "!@#$%^&*-_+=.?";

function pickChar(pool: string, bytes: Uint8Array, i: number) {
  return pool[bytes[i] % pool.length];
}

export function PasswordTool() {
  const [len, setLen] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNum, setUseNum] = useState(true);
  const [useSym, setUseSym] = useState(true);
  const [out, setOut] = useState("");

  const pool = useMemo(() => {
    let p = "";
    if (useLower) p += LOWER;
    if (useUpper) p += UPPER;
    if (useNum) p += NUM;
    if (useSym) p += SYM;
    return p;
  }, [useLower, useUpper, useNum, useSym]);

  const generate = useCallback(() => {
    if (!pool) {
      setOut("");
      return;
    }
    const bytes = new Uint8Array(Math.max(len, 16));
    crypto.getRandomValues(bytes);
    let s = "";
    for (let i = 0; i < len; i++) s += pickChar(pool, bytes, i);
    setOut(s);
  }, [len, pool]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
        <label className="flex items-center gap-2">
          Length
          <input
            type="number"
            min={6}
            max={128}
            value={len}
            onChange={(e) => setLen(Number(e.target.value))}
            className="w-24 rounded border border-white/15 bg-black/40 px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />
          a–z
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
          A–Z
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useNum} onChange={(e) => setUseNum(e.target.checked)} />
          0–9
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useSym} onChange={(e) => setUseSym(e.target.checked)} />
          Symbols
        </label>
        <button type="button" className={btnClass} onClick={generate}>
          Generate
        </button>
        {out ? <CopyButton text={out} label="Copy password" /> : null}
      </div>
      <label className="block text-sm text-slate-400">
        Generated password
        <textarea className={`${inputClass} mt-1`} readOnly value={out} placeholder="Your password appears here" />
      </label>
    </div>
  );
}
