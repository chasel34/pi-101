import type { Scene } from "@/components/ChapterShell";
import {
  CardGridScene,
  SourceLink,
  TypewriterScene,
} from "@/components/scenes";

export const chapter16Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你以为 pi 只是一个终端 CLI。" },
          { text: "其实它能 同时变成五种形态。", highlight: "同时变成五种形态" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "grid",
    render: (
      <CardGridScene
        title="点开每一张，看这个模式的用途："
        columns={3}
        cards={[
          {
            id: "interactive",
            title: "Interactive",
            subtitle: "默认模式 · pi-tui",
            icon: "🖥",
            body: (
              <>
                <p>有 TTY、stdin 是终端时，进 interactive 模式。pi-tui 接管整个屏幕，差分渲染、键盘绑定、overlay 全部上线。</p>
                <p>就是你天天用的那个「pi」。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/modes/interactive" },
          },
          {
            id: "print",
            title: "Print",
            subtitle: "一次性问答",
            icon: "🖨",
            body: (
              <>
                <p>非 TTY（管道、CI、subprocess）时自动进入。</p>
                <p><code className="font-mono">echo "fix the bug" | pi</code> —— 跑完直接打印结果到 stdout，没有 TUI。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/modes/index.ts" },
          },
          {
            id: "json",
            title: "JSON",
            subtitle: "结构化输出",
            icon: "📄",
            body: (
              <>
                <p>print 模式 + <code className="font-mono">--mode json</code>，每一条事件以 JSON 行输出。</p>
                <p>非常适合工具链消费：grep、jq、自动化测试都好接。</p>
              </>
            ),
          },
          {
            id: "rpc",
            title: "RPC",
            subtitle: "stdin/stdout 协议",
            icon: "🔌",
            body: (
              <>
                <p>把 pi 当成一个长跑的子进程，通过 stdin/stdout 双向 JSON-RPC。</p>
                <p>VS Code 插件、桌面 wrapper、自定义编辑器集成走这条路。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/modes/rpc" },
          },
          {
            id: "sdk",
            title: "SDK",
            subtitle: "Node 程序里 import",
            icon: "📦",
            body: (
              <>
                <p>直接 <code className="font-mono">import {"{ createAgentSession }"} from "@earendil-works/pi-coding-agent/sdk"</code>。</p>
                <p>没有任何进程、没有任何 UI —— 把 pi 当库用。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/core/sdk.ts" },
          },
          {
            id: "decide",
            title: "怎么决定？",
            subtitle: "main.ts 的判定",
            icon: "🤔",
            body: (
              <>
                <pre className="overflow-x-auto rounded-md bg-pi-bg px-3 py-2 text-left font-mono-title text-[11px]">
{`if (mode === "rpc")  → rpc
if (mode === "json") → json
if (--print || !stdinIsTTY) → print
else                 → interactive`}
                </pre>
              </>
            ),
            source: { path: "packages/coding-agent/src/main.ts", lines: [96, 110] },
          },
        ]}
      />
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "同一个 AgentSession ——" },
          { text: "可以被 一个人交互地用，可以被 一段管道喂数据，可以被 一个 GUI 接住。", highlight: "一个 GUI 接住" },
          { text: "接下来两章：先看人怎么看你（pi-tui），再看浏览器怎么看你（pi-web-ui）。" },
        ]}
        sources={[
          { path: "packages/coding-agent/src/main.ts" },
          { path: "packages/coding-agent/src/modes/index.ts" },
        ]}
        speedMs={45}
      />
    ),
  },
];
