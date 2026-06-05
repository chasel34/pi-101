"use client";

import { useEffect, useState } from "react";
import type { SourceRef } from "@/lib/source-link";
import { SourceLink } from "./SourceLink";

export type StepItem = {
  id: string;
  title: string;
  body: React.ReactNode;
  badge?: string;
  source?: SourceRef;
};

const SPEEDS = [0.5, 1, 2] as const;

export function StepPlayerScene({
  title,
  steps,
}: {
  title: React.ReactNode;
  steps: StepItem[];
}) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    if (!playing) return;
    const ms = 2000 / speed;
    const t = setTimeout(() => {
      if (idx >= steps.length - 1) {
        setPlaying(false);
      } else {
        setIdx((i) => i + 1);
      }
    }, ms);
    return () => clearTimeout(t);
  }, [playing, idx, speed, steps.length]);

  const step = steps[idx];
  const isLast = idx === steps.length - 1;

  return (
    <div className="space-y-5">
      <div className="text-center font-serif text-xl">{title}</div>

      <div className="flex flex-wrap items-center justify-center gap-1">
        {steps.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIdx(i)}
            className={`h-7 w-7 rounded-full font-mono-title text-xs transition ${
              i === idx
                ? "bg-pi-primary-soft text-pi-primary shadow-[inset_0_0_0_2px_var(--color-pi-primary)]"
                : i < idx
                  ? "text-pi-ink"
                  : "text-pi-faint"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono-title text-xs text-pi-faint">
            {String(idx + 1).padStart(2, "0")} 步骤 {idx + 1} / {steps.length}
          </div>
          {step.badge && (
            <span className="rounded-full bg-pi-primary-soft px-2 py-0.5 font-mono-title text-[10px] text-pi-primary">
              {step.badge}
            </span>
          )}
        </div>
        <div className="font-medium">{step.title}</div>
        <div className="mt-2 text-sm leading-relaxed text-pi-muted">{step.body}</div>
        {step.source && <SourceLink refs={[step.source]} />}
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="text-pi-muted hover:text-pi-ink"
          aria-label="上一步"
        >
          ◀
        </button>
        <button
          type="button"
          onClick={() => {
            if (isLast && !playing) setIdx(0);
            setPlaying((p) => !p);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-pi-primary text-white shadow-sm hover:bg-pi-primary-hover"
          aria-label="播放 / 暂停"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          onClick={() => setIdx((i) => Math.min(steps.length - 1, i + 1))}
          className="text-pi-muted hover:text-pi-ink"
          aria-label="下一步"
        >
          ▶
        </button>
        <div className="ml-3 flex items-center gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`rounded-md px-2 py-0.5 font-mono-title text-xs transition ${
                speed === s
                  ? "bg-pi-primary-soft text-pi-primary"
                  : "text-pi-muted hover:text-pi-ink"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
