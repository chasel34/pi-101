import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter18Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "终端只是一种 UI。" },
          { text: "把同一个 Agent 接到 浏览器 —— 也是一个 import。", highlight: "浏览器" },
          { text: "这一章见 pi-web-ui。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "chatpanel",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          一个组件：<code className="font-mono-title text-pi-primary">&lt;chat-panel&gt;</code>。
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`import "@earendil-works/pi-web-ui";
import { createAgentSession } from "@earendil-works/pi-coding-agent/sdk";

const session = await createAgentSession({...});
document.querySelector("chat-panel").session = session;`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          ChatPanel 是个 LitElement（Web Component）。给它一个 <code className="font-mono">AgentSession</code>，
          剩下的它管：消息流、工具调用渲染、输入框、滚动、键盘。
        </p>
      </div>
    ),
  },
  {
    id: "shared",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          为什么它能这么轻？—— <em className="font-serif italic">同一个 Agent</em>。
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`pi-ai          ← 大脑（统一 stream / message）
  ↑
pi-agent-core  ← 心跳（agent loop）
  ↑
pi-coding-agent← 会话门面（AgentSession、resources、tools）
  ↑
pi-web-ui      ← 渲染（订阅 session 事件、画消息和工具）
pi-tui         ← 渲染（同样订阅，画到终端）`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          pi-tui 和 pi-web-ui 是 <strong>同级</strong>的两个「眼睛」。它们看的是同一个 AgentSession。
        </p>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <div className="space-y-6 text-center">
        <p className="font-serif text-2xl leading-relaxed">
          你已经走完了一圈。
        </p>
        <p className="text-pi-muted">
          18 章后 —— 你应该已经能：<br />
          打开一个 <code className="font-mono">packages/coding-agent/examples/extensions/</code> 下的例子，<br />
          照着写出第一个属于你自己的 pi extension。
        </p>
        <p className="text-pi-faint text-sm">
          —— 旅程结束。回家路上别忘了给仓库点个 star。
        </p>
        <SourceLink
          refs={[
            { path: "packages/web-ui/src/ChatPanel.ts" },
            { path: "packages/web-ui/example" },
          ]}
        />
      </div>
    ),
  },
];
