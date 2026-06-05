"use client";

import { useEffect, useState } from "react";
import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

function StreamingDemo() {
  const tokens = [
    { t: "我", k: "text" },
    { t: "在", k: "text" },
    { t: "想", k: "thinking" },
    { t: "...", k: "thinking" },
    { t: "我", k: "text" },
    { t: "应该", k: "text" },
    { t: "调用", k: "text" },
    { t: "Read", k: "tool" },
    { t: "(\"src/foo.ts\")", k: "tool" },
    { t: "看", k: "text" },
    { t: "一下", k: "text" },
    { t: "。", k: "text" },
  ];
  const [n, setN] = useState(0);

  useEffect(() => {
    if (n >= tokens.length) return;
    const t = setTimeout(() => setN(n + 1), 320);
    return () => clearTimeout(t);
  }, [n, tokens.length]);

  return (
    <div className="space-y-4">
      <div className="min-h-32 rounded-xl bg-pi-surface p-5 text-left font-mono-title text-base leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
        {tokens.slice(0, n).map((tok, i) => (
          <span
            key={i}
            className={
              tok.k === "thinking"
                ? "text-pi-muted italic"
                : tok.k === "tool"
                  ? "rounded bg-pi-primary-soft px-1 text-pi-primary"
                  : "text-pi-ink"
            }
          >
            {tok.t}
            {tok.k === "tool" && i === tokens.findIndex((x) => x.k === "tool") ? "" : ""}
          </span>
        ))}
        <span className="caret" />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <Legend color="text-pi-ink" label="text_delta" />
        <Legend color="text-pi-muted italic" label="thinking_delta" />
        <Legend color="text-pi-primary" label="toolcall_delta" />
      </div>
      <div className="text-center">
        <button
          type="button"
          onClick={() => setN(0)}
          className="rounded-full bg-pi-primary-soft px-3 py-1 text-xs font-mono-title text-pi-primary hover:bg-pi-primary hover:text-white"
        >
          ↻ 重播
        </button>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-pi-surface px-2 py-0.5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      <span className={`font-mono-title ${color}`}>●</span>
      <span className="font-mono-title text-pi-muted">{label}</span>
    </span>
  );
}

export const chapter2Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "上一章你知道了：你的大脑叫 Model。" },
          { text: "可是 —— 你「说话」其实并不是一句一句往外蹦。", highlight: "说话" },
          { text: "你是 一个 token 一个 token 吐 的。", highlight: "一个 token 一个 token 吐" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "watch",
    render: (
      <div className="space-y-5">
        <div className="text-center font-serif text-xl">
          看 —— 这就是你说话的样子：
        </div>
        <StreamingDemo />
      </div>
    ),
  },
  {
    id: "events",
    render: (
      <div className="space-y-6">
        <p className="text-center font-serif text-xl leading-relaxed">
          这条流叫 <code className="font-mono-title text-pi-primary">AssistantMessageEventStream</code>，
          <br />
          每一帧都是一个 <em className="font-serif italic">事件</em>。
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`type AssistantMessageEvent =
  | { type: "start" }
  | { type: "text_start" | "text_delta" | "text_end" }
  | { type: "thinking_start" | "thinking_delta" | "thinking_end" }
  | { type: "toolcall_start" | "toolcall_delta" | "toolcall_end" }
  | { type: "done";  message: AssistantMessage }
  | { type: "error"; error:   AssistantMessage };`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          start → 一堆 *_delta → 收尾的 done 或 error。
        </p>
      </div>
    ),
  },
  {
    id: "consume",
    render: (
      <div className="space-y-6">
        <p className="text-center font-serif text-xl">
          消费它的方式很简单 —— <code className="font-mono">for await</code>。
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`const events = stream(model, { messages, tools });

for await (const event of events) {
  switch (event.type) {
    case "text_delta":     ui.append(event.delta); break;
    case "toolcall_end":   pendingTools.push(event.toolCall); break;
    case "done":           finalMessage = event.message; break;
    case "error":          handle(event.error); break;
  }
}

const message = await events.result();   // 兜底拿最终消息`}
        </pre>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <div className="space-y-5 text-center">
        <p className="font-serif text-2xl leading-relaxed">
          你的「思考」、「说话」、「下手」，
          <br />
          在外界看来 —— 全是 <span className="text-pi-primary">同一条流上</span>的不同事件。
        </p>
        <p className="text-pi-muted">
          下一章：在你「说话」之前，你脑子里其实已经塞满了别人给你的 context。
        </p>
        <SourceLink
          refs={[
            { path: "packages/ai/src/types.ts", lines: [347, 359], label: "types.ts:347-359 AssistantMessageEvent" },
            { path: "packages/ai/src/stream.ts" },
            { path: "packages/ai/src/utils/event-stream.ts" },
          ]}
        />
      </div>
    ),
  },
];
