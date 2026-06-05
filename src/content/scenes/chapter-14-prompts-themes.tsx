import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter14Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "上一章给你装了「器官」。这一章只调你的 —— 气质。", highlight: "气质" },
          { text: "两件小东西：Prompt Templates、Themes。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "prompt-templates",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          Prompt Templates — 把常用模板存成命名片段。
        </p>
        <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
          <div className="mb-1 font-mono-title text-sm text-pi-primary">
            ~/.pi/prompts/review.md
          </div>
          <pre className="overflow-x-auto rounded-md bg-pi-bg px-3 py-2 text-left font-mono-title text-xs">
{`---
name: review
description: 严格 code review，按 OWASP top 10 + 性能两块来
---

请按以下结构 review 当前 diff:
1. 安全 ...
2. 性能 ...`}
          </pre>
          <p className="mt-2 text-sm text-pi-muted">
            CLI 里输入 <code className="font-mono">{`{{review}}`}</code> 就会被 <code className="font-mono">expandPromptTemplate()</code> 展开成完整内容。
          </p>
        </div>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/prompt-templates.ts", lines: [11, 50] },
            { path: "packages/coding-agent/src/core/prompt-templates.ts", lines: [282, 320] },
          ]}
        />
      </div>
    ),
  },
  {
    id: "themes",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          Themes — 给 pi-tui 换色板。
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "default", main: "#7c5cff", bg: "#fafaf7" },
            { name: "dracula", main: "#bd93f9", bg: "#282a36" },
            { name: "solarized", main: "#268bd2", bg: "#fdf6e3" },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-xl p-4 font-mono-title text-xs shadow-[inset_0_0_0_1px_var(--color-pi-line)]"
              style={{ background: t.bg, color: t.main }}
            >
              {t.name}
              <div className="mt-2 text-[10px]">
                primary {t.main}
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-pi-muted">
          一个 theme 就是一个 JSON / TS 文件，导出色板 + 状态色 + 选中态。pi-tui 拿到它去给所有组件上色。
        </p>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "Skills 改你「知道什么」。" },
          { text: "Extensions 改你「能做什么」。" },
          { text: "Prompts & Themes 改你 「长什么样、说话什么调」。", highlight: "长什么样、说话什么调" },
          { text: "下一章：把这些东西打包给所有人用。" },
        ]}
        speedMs={45}
      />
    ),
  },
];
