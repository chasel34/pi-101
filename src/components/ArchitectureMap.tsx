"use client";

import { useState } from "react";
import { sitePath } from "@/lib/site-path";

type Pkg = {
  id: string;
  name: string;
  blurb: string;
  detail: string;
  deps: string[];
  color: string;
  chapters: { num: number; slug: string; title: string }[];
};

const PACKAGES: Pkg[] = [
  {
    id: "ai",
    name: "pi-ai",
    blurb: "大脑：统一 model / stream / message",
    detail:
      "封装 OpenAI、Anthropic、Google、Bedrock 等 provider。无论调谁，吐的都是同一种 AssistantMessageEventStream。",
    deps: [],
    color: "var(--color-pi-cat-blue)",
    chapters: [
      { num: 1, slug: "provider-model", title: "Provider & Model" },
      { num: 2, slug: "stream-message", title: "Stream & Message" },
    ],
  },
  {
    id: "agent",
    name: "pi-agent-core",
    blurb: "心跳：agent loop + tool call 协议",
    detail:
      "提供 agentLoop()、AgentEvent、before/afterToolCall hook、parallel/sequential 执行策略、compaction 编排。不关心 cwd、不关心 CLAUDE.md。",
    deps: ["ai"],
    color: "var(--color-pi-cat-green)",
    chapters: [
      { num: 4, slug: "agent-loop", title: "Agent Loop" },
      { num: 7, slug: "tool-policies", title: "Tool Policies" },
      { num: 8, slug: "compaction", title: "Compaction" },
    ],
  },
  {
    id: "coding-agent",
    name: "pi-coding-agent",
    blurb: "门面：CLI + 持久化 + 内置工具 + 扩展",
    detail:
      "AgentSession、SessionManager（JSONL）、7 个内置工具、resource-loader、skills、extensions、5 种运行模式。",
    deps: ["agent"],
    color: "var(--color-pi-cat-purple)",
    chapters: [
      { num: 3, slug: "context", title: "Context" },
      { num: 5, slug: "agent-vs-session", title: "Agent vs Session" },
      { num: 6, slug: "tools", title: "Built-in Tools" },
      { num: 9, slug: "session-tree", title: "Session Tree" },
      { num: 10, slug: "session-manager", title: "Session Manager" },
      { num: 11, slug: "resource-loader", title: "Resource Loader" },
      { num: 12, slug: "skills", title: "Skills" },
      { num: 13, slug: "extensions", title: "Extensions" },
      { num: 14, slug: "prompts-themes", title: "Prompt & Themes" },
      { num: 15, slug: "pi-packages", title: "Pi Packages" },
      { num: 16, slug: "five-modes", title: "Five Modes" },
    ],
  },
  {
    id: "tui",
    name: "pi-tui",
    blurb: "终端渲染层：差分 + focus + overlay",
    detail:
      "纯渲染库，不依赖 agent / ai。差分写 ANSI、维护焦点链、autocomplete overlay、theme。也被 coding-agent 当 UI 引擎使用。",
    deps: ["coding-agent"],
    color: "var(--color-pi-cat-orange)",
    chapters: [{ num: 17, slug: "pi-tui", title: "pi-tui" }],
  },
  {
    id: "web-ui",
    name: "pi-web-ui",
    blurb: "浏览器渲染层：ChatPanel Web Component",
    detail:
      "LitElement <chat-panel>。给它一个 AgentSession，剩下的它管：消息流、工具调用、滚动。",
    deps: ["coding-agent"],
    color: "var(--color-pi-cat-red)",
    chapters: [{ num: 18, slug: "pi-web-ui", title: "pi-web-ui" }],
  },
];

export function ArchitectureMap() {
  const [active, setActive] = useState<string>("coding-agent");
  const current = PACKAGES.find((p) => p.id === active)!;

  return (
    <section className="mx-auto mt-20 max-w-3xl px-6">
      <div className="rounded-2xl bg-[#1a1a1f] p-8 text-white shadow-xl">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <div className="font-mono-title text-sm font-medium">pi-mono 架构图</div>
            <div className="mt-1 font-mono-title text-xs text-white/50">
              5 个 package · 一条 import 瀑布 · 点开看每个包负责什么
            </div>
          </div>
          <span className="font-mono-title text-xs text-white/40">earendil-works/pi-mono</span>
        </div>

        <div className="space-y-2">
          {PACKAGES.map((p) => {
            const isActive = p.id === active;
            const indent = p.id === "ai" ? 0 : p.id === "agent" ? 1 : p.id === "coding-agent" ? 2 : 3;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActive(p.id)}
                className={`group flex w-full items-center gap-3 rounded-lg p-3 text-left transition ${
                  isActive ? "bg-white/10" : "hover:bg-white/5"
                }`}
                style={{ paddingLeft: `${12 + indent * 24}px` }}
              >
                <span
                  className="inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: p.color }}
                />
                <span className="font-mono-title text-sm font-medium">{p.name}</span>
                <span className="font-mono-title text-xs text-white/40 group-hover:text-white/60">
                  {p.blurb}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg bg-white/5 p-4">
          <div className="flex items-baseline gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: current.color }}
            />
            <span className="font-mono-title text-sm font-medium">{current.name}</span>
            {current.deps.length > 0 && (
              <span className="font-mono-title text-xs text-white/40">
                深度依赖: {current.deps.join(", ")}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/70">{current.detail}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {current.chapters.map((ch) => (
              <a
                key={ch.slug}
                href={sitePath(`/chapters/${ch.slug}/`)}
                className="rounded-full bg-white/10 px-2.5 py-1 font-mono-title text-[11px] text-white/80 hover:bg-white/20"
              >
                {String(ch.num).padStart(2, "0")} {ch.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
