"use client";

import { useMemo, useState } from "react";
import type { SourceRef } from "@/lib/source-link";
import { SourceLink } from "./SourceLink";

export type Block = {
  id: string;
  title: string;
  body: React.ReactNode;
  size: number; // tokens or bytes
  source?: SourceRef;
  required?: boolean;
};

export function DragAssembleScene({
  title,
  blocks,
  unit = "tokens",
  containerLabel = "拼装容器",
  capacity,
}: {
  title: React.ReactNode;
  blocks: Block[];
  unit?: string;
  containerLabel?: string;
  capacity?: number;
}) {
  const [installed, setInstalled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(blocks.filter((b) => b.required).map((b) => [b.id, true])),
  );

  const total = useMemo(
    () =>
      blocks.reduce((sum, b) => (installed[b.id] ? sum + b.size : sum), 0),
    [installed, blocks],
  );

  const pctOfCap = capacity ? Math.min(100, Math.round((total / capacity) * 100)) : null;

  function toggle(id: string) {
    setInstalled((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="space-y-5">
      <div className="text-center font-serif text-xl">{title}</div>

      <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="font-mono-title text-xs text-pi-muted">{containerLabel}</div>
          <div className="font-mono-title text-sm">
            <span className="text-pi-primary">~{total.toLocaleString()}</span>{" "}
            <span className="text-pi-muted">{unit}</span>
            {capacity && (
              <span className="ml-2 text-xs text-pi-faint">
                / {capacity.toLocaleString()} ({pctOfCap}%)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {blocks.map((b) => {
            const on = !!installed[b.id];
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => !b.required && toggle(b.id)}
                disabled={b.required}
                className={`w-full rounded-lg p-3 text-left transition ${
                  on
                    ? "bg-pi-primary-soft shadow-[inset_0_0_0_1px_var(--color-pi-primary)]"
                    : "bg-pi-bg shadow-[inset_0_0_0_1px_var(--color-pi-line)] hover:shadow-[inset_0_0_0_1px_var(--color-pi-faint)]"
                } ${b.required ? "cursor-default opacity-90" : ""}`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="font-mono-title text-sm">
                    {b.title}
                    {b.required && (
                      <span className="ml-2 text-[10px] text-pi-faint">必装</span>
                    )}
                  </div>
                  <div
                    className={`font-mono-title text-xs ${
                      on ? "text-pi-primary" : "text-pi-faint"
                    }`}
                  >
                    {on ? "+" : ""}
                    {b.size.toLocaleString()} {unit}
                  </div>
                </div>
                <div className="mt-1 text-xs leading-relaxed text-pi-muted">
                  {b.body}
                </div>
                {b.source && on && <SourceLink refs={[b.source]} />}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-center text-xs text-pi-muted">
        点击模块装入 / 卸下，看 token 实时累计
      </p>
    </div>
  );
}
