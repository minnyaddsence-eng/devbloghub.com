"use client";

import type { ReactNode } from "react";
import { btnClass, btnGhost, inputClass } from "@/components/tools/tool-ui";

export { btnClass, btnGhost, inputClass };
export { CopyButton } from "@/components/CopyButton";

export function ToolFrame({
  children,
  actions,
}: {
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      {children}
    </div>
  );
}
