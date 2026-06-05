"use client";

import { useState } from "react";
import type { SourceRef } from "@/lib/source-link";
import { SourceLink } from "./SourceLink";

export type CardItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  body: React.ReactNode;
  source?: SourceRef;
};

export function CardGridScene({
  title,
  cards,
  columns = 3,
}: {
  title: React.ReactNode;
  cards: CardItem[];
  columns?: 2 | 3 | 4;
}) {
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<string | null>(null);
  const exploredCount = Object.keys(opened).length;

  const colsCls =
    columns === 2 ? "grid-cols-2" : columns === 4 ? "grid-cols-4" : "grid-cols-3";

  const activeCard = active ? cards.find((c) => c.id === active) : null;

  return (
    <div className="space-y-6">
      <div className="text-center font-serif text-xl">{title}</div>

      <div className={`grid gap-3 ${colsCls}`}>
        {cards.map((c) => {
          const isOpen = !!opened[c.id];
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setOpened((o) => ({ ...o, [c.id]: true }));
                setActive(isActive ? null : c.id);
              }}
              className={`rounded-xl bg-pi-surface p-4 text-left transition shadow-[inset_0_0_0_1px_var(--color-pi-line)] hover:shadow-[inset_0_0_0_1px_var(--color-pi-primary)] ${
                isActive ? "shadow-[inset_0_0_0_2px_var(--color-pi-primary)]" : ""
              }`}
            >
              <div className="mb-2 text-2xl">{c.icon}</div>
              <div className="font-mono-title text-sm font-medium">{c.title}</div>
              {c.subtitle && (
                <div className="mt-1 text-xs text-pi-muted">{c.subtitle}</div>
              )}
              {isOpen && (
                <span className="mt-2 inline-block rounded-full bg-pi-primary-soft px-1.5 py-0.5 text-[10px] font-mono-title text-pi-primary">
                  已读
                </span>
              )}
            </button>
          );
        })}
      </div>

      {activeCard && (
        <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
          <div className="mb-2 font-mono-title text-sm text-pi-primary">
            {activeCard.title}
          </div>
          <div className="scene-prose text-sm leading-relaxed text-pi-ink">
            {activeCard.body}
          </div>
          {activeCard.source && <SourceLink refs={[activeCard.source]} />}
        </div>
      )}

      {!activeCard && (
        <p className="text-center text-sm text-pi-muted">
          点击上方的工具卡片，了解每个工具的作用
        </p>
      )}

      <div className="text-center text-xs text-pi-muted">
        已探索 <span className="font-mono-title text-pi-ink">{exploredCount}</span> /
        {" "}
        {cards.length}
      </div>
    </div>
  );
}
