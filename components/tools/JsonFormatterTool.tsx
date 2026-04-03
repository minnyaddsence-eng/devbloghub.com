"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { btnClass, btnGhost, inputClass } from "@/components/tools/tool-ui";

export function JsonFormatterTool() {
  const [raw, setRaw] = useState('{\n  "hello": "DevBlogHub"\n}');

  const { pretty, minified, err } = useMemo(() => {
    try {
      const obj = JSON.parse(raw);
      return {
        pretty: JSON.stringify(obj, null, 2),
        minified: JSON.stringify(obj),
        err: null as string | null,
      };
    } catch (e) {
      return {
        pretty: "",
        minified: "",
        err: e instanceof Error ? e.message : "Invalid JSON",
      };
    }
  }, [raw]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={btnClass}
          onClick={() => err === null && setRaw(pretty)}
          disabled={!!err}
        >
          Format (pretty)
        </button>
        <button
          type="button"
          className={btnGhost}
          onClick={() => !err && minified && setRaw(minified)}
          disabled={!!err}
        >
          Minify
        </button>
        <CopyButton text={raw} label="Copy editor" />
        {!err && pretty ? <CopyButton text={pretty} label="Copy pretty" /> : null}
        {!err && minified ? <CopyButton text={minified} label="Copy minified" /> : null}
      </div>
      {err && (
        <p className="text-sm text-rose-300" role="alert">
          {err}
        </p>
      )}
      <label className="block text-sm text-slate-400">
        JSON input
        <textarea
          className={`${inputClass} mt-1`}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          spellCheck={false}
        />
      </label>
    </div>
  );
}
