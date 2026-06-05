"use client";

import { useState } from "react";
import type { SourceRef } from "@/lib/source-link";
import { SourceLink } from "./SourceLink";

export type SliderStop = {
  value: number;
  leftLabel: string;
  leftBody: React.ReactNode;
  rightLabel?: string;
  rightBody?: React.ReactNode;
};

export function SliderScene({
  title,
  subtitle,
  stops,
  meterLabel = "AI 理解程度",
  sources,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  stops: SliderStop[];
  meterLabel?: string;
  sources?: SourceRef[];
}) {
  const [value, setValue] = useState(0);
  const current = stops[Math.min(value, stops.length - 1)];
  const pct = Math.round((value / Math.max(1, stops.length - 1)) * 100);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center font-serif text-xl leading-relaxed">
        <div>{title}</div>
        {subtitle && <div className="text-pi-muted">{subtitle}</div>}
      </div>

      <div className="grid grid-cols-2 divide-x divide-pi-line rounded-xl bg-pi-surface shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
        <div className="p-5">
          <div className="mb-2 text-xs font-mono-title text-pi-muted">
            {current.leftLabel} <span className="text-red-500">✕</span>
          </div>
          <div className="text-sm leading-relaxed text-pi-ink">{current.leftBody}</div>
        </div>
        <div className="p-5">
          <div className="mb-2 text-xs font-mono-title text-pi-muted">
            {current.rightLabel ?? "清晰"} <span className="text-green-600">✓</span>
          </div>
          <div className="text-sm leading-relaxed text-pi-muted">
            {current.rightBody ?? "—"}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-pi-muted">
          <span>{meterLabel}</span>
          <span className="font-mono-title">{pct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-pi-line">
          <div
            className="h-full rounded-full bg-pi-primary transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={stops.length - 1}
          step={1}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="mt-3 w-full accent-pi-primary"
        />
      </div>

      {sources && <SourceLink refs={sources} />}
    </div>
  );
}
