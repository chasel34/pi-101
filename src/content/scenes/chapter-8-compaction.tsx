"use client";

import { useState } from "react";
import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

function CompactionDemo() {
  const [turn, setTurn] = useState(0);
  const turns = 20;
  const capacity = 200_000;
  const tokensBefore = Math.min(turn * 11_000, 220_000);
  const overflow = tokensBefore > capacity;
  const tokensAfter = overflow ? 60_000 + (turn - Math.floor(capacity / 11000)) * 11_000 : tokensBefore;
  const pctBefore = Math.min(100, Math.round((tokensBefore / capacity) * 100));
  const pctAfter = Math.min(100, Math.round((tokensAfter / capacity) * 100));

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
        <div className="mb-1 flex justify-between text-xs text-pi-muted">
          <span>不压缩 — 直接堆</span>
          <span className="font-mono-title">
            {tokensBefore.toLocaleString()} ({pctBefore}%)
            {overflow && <span className="ml-1 text-red-500">⚠ 溢出</span>}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-pi-line">
          <div
            className={`h-full rounded-full transition-all ${overflow ? "bg-red-400" : "bg-pi-faint"}`}
            style={{ width: `${pctBefore}%` }}
          />
        </div>
      </div>
      <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-primary)]">
        <div className="mb-1 flex justify-between text-xs text-pi-muted">
          <span>启用 compaction — 摘要 + 保留要点</span>
          <span className="font-mono-title text-pi-primary">
            {tokensAfter.toLocaleString()} ({pctAfter}%)
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-pi-line">
          <div
            className="h-full rounded-full bg-pi-primary transition-all"
            style={{ width: `${pctAfter}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={0}
          max={turns}
          value={turn}
          onChange={(e) => setTurn(Number(e.target.value))}
          className="w-full accent-pi-primary"
        />
        <span className="w-28 text-right font-mono-title text-xs text-pi-muted">
          turn {turn} / {turns}
        </span>
      </div>
    </div>
  );
}

export const chapter8Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你的 context window 是有上限的。" },
          { text: "对话越久 —— token 越多 —— 距离爆仓越近。", highlight: "爆仓" },
          { text: "于是 pi 给了你一个「遗忘 + 摘要」的机制：Compaction。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "demo",
    render: (
      <div className="space-y-5">
        <div className="text-center font-serif text-xl">
          拖动 turn —— 看上下文怎么逐渐变重，又怎么被「压」回去：
        </div>
        <CompactionDemo />
      </div>
    ),
  },
  {
    id: "how",
    render: (
      <div className="space-y-6">
        <p className="text-center font-serif text-xl leading-relaxed">
          Compaction 做了 三件事 —
        </p>
        <div className="space-y-3">
          <Step n="1" title="筛 entries">
            按时间倒序遍历 session tree 的当前分支，挑出「值得保留」的消息（用户输入、工具调用结果、上一次 compaction 摘要）。
          </Step>
          <Step n="2" title="生成 branch summary">
            用一个小一点的模型 + 专门的 system prompt（<code className="font-mono">SUMMARIZATION_SYSTEM_PROMPT</code>）把这些 entries 压成一个高密度摘要。
          </Step>
          <Step n="3" title="替换 + 续写">
            把压缩前的内容标成 <code className="font-mono">"compaction"</code> 节点，新摘要作为新的 system message 投入下一轮 loop。原始 entries 留在 JSONL 里 —— 失忆但有据可查。
          </Step>
        </div>
        <SourceLink
          refs={[
            { path: "packages/agent/src/harness/compaction/compaction.ts" },
            { path: "packages/agent/src/harness/compaction/branch-summarization.ts" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "你不是「记得越多越好」的人。" },
          { text: "你是「该忘的时候必须忘」的人。", highlight: "该忘的时候必须忘" },
          { text: "下一章：那些被忘掉的，去了哪？" },
        ]}
        speedMs={45}
      />
    ),
  },
];

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      <div className="font-mono-title text-xs text-pi-primary">{n}</div>
      <div>
        <div className="font-mono-title text-sm">{title}</div>
        <p className="mt-1 text-sm text-pi-muted">{children}</p>
      </div>
    </div>
  );
}
