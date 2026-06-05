import type { Scene } from "@/components/ChapterShell";
import {
  DragAssembleScene,
  SourceLink,
  TypewriterScene,
} from "@/components/scenes";

export const chapter3Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "在你「醒来」之前，有人已经悄悄给你塞了一堆东西。" },
          { text: "这些东西决定了 你看到的世界。", highlight: "你看到的世界" },
          { text: "它有个名字：Context。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "what",
    render: (
      <div className="space-y-6 text-center">
        <p className="font-serif text-xl leading-relaxed">
          Context 不是一个变量，是 <em className="font-serif italic">一团</em>：
        </p>
        <ul className="mx-auto inline-block text-left text-pi-muted">
          <li>— 你这次接到的「指令」（user prompt）</li>
          <li>— 之前几轮对话（messages 历史）</li>
          <li>— 项目背景（CLAUDE.md / AGENTS.md）</li>
          <li>— 你能用的工具（tools 描述与 schema）</li>
          <li>— 你被允许的技能（skills）</li>
          <li>— 一堆「身份与规则」（系统指令）</li>
        </ul>
        <p className="text-sm text-pi-muted">
          在 pi 里，它们最终拼成一个 <code className="font-mono">string</code>，
          再加上 <code className="font-mono">messages[]</code>，作为「给大脑的输入」。
        </p>
      </div>
    ),
  },
  {
    id: "assemble",
    render: (
      <DragAssembleScene
        title={
          <>
            点开各个模块，看 <em className="font-serif italic">系统提示</em>{" "}
            是怎么被一块一块拼起来的 —
          </>
        }
        containerLabel="拼装容器"
        capacity={200_000}
        unit="tokens"
        blocks={[
          {
            id: "core",
            title: "核心指令",
            required: true,
            size: 2000,
            body: "身份、行为准绳、输出风格。所有 session 都有，不可省。",
            source: {
              path: "packages/coding-agent/src/core/system-prompt.ts",
              lines: [28, 80],
            },
          },
          {
            id: "tools",
            title: "工具描述",
            required: true,
            size: 4000,
            body: "7 个内置工具 + 扩展工具的 JSON Schema 和说明。是「你能下手做什么」的清单。",
            source: { path: "packages/coding-agent/src/core/tools" },
          },
          {
            id: "claude_md",
            title: "CLAUDE.md / AGENTS.md",
            size: 1500,
            body: "项目级长期指令：规范、技术栈、命名约定。由 resource-loader 从仓库内逐级向上找。",
            source: {
              path: "packages/coding-agent/src/core/resource-loader.ts",
              lines: [55, 110],
            },
          },
          {
            id: "skills",
            title: "Skills",
            size: 800,
            body: "已注册的「小专家」清单（名字 + 一句话描述）。需要时 Claude 会主动 read 它们的 SKILL.md。",
            source: { path: "packages/coding-agent/src/core/skills.ts" },
          },
          {
            id: "user_ctx",
            title: "用户上下文",
            size: 500,
            body: "时间、cwd、最近 git 提交、暂存状态等环境快照。",
            source: {
              path: "packages/coding-agent/src/core/system-prompt.ts",
              lines: [76, 78],
            },
          },
          {
            id: "append",
            title: "appendSystemPrompt",
            size: 200,
            body: "用户 / 上层应用补丁：「在末尾再加这一段」。常用于在 SDK 模式里下定制规则。",
          },
        ]}
      />
    ),
  },
  {
    id: "closing",
    render: (
      <div className="space-y-5 text-center">
        <p className="font-serif text-2xl leading-relaxed">
          你看到的世界 —— 是别人选给你的。
        </p>
        <p className="text-pi-muted">
          从下一章开始，你会有「心跳」：拿到 context、生成回应、调工具、再拿到结果、再生成…
        </p>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/system-prompt.ts" },
            { path: "packages/coding-agent/src/core/resource-loader.ts" },
            { path: "packages/coding-agent/src/core/skills.ts" },
          ]}
        />
      </div>
    ),
  },
];
