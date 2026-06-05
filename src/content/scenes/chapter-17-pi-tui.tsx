import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter17Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "在终端里画一个有焦点、有 overlay、跑得不卡的 UI ——" },
          { text: "比想象中难得多。", highlight: "比想象中难" },
          { text: "pi-tui 是 pi 自己造的轮子。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "diff",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          核心思路：<span className="text-pi-primary">差分渲染</span>。
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`prev frame  = ["> hello", "▌", "tool: read foo.ts ✓", "..."]
next frame  = ["> hello world", "▌", "tool: read foo.ts ✓", "..."]

diff:
  line 0: 重写
  line 1: 不动
  line 2: 不动
  line 3: 不动

输出: 只发 line 0 的 ANSI 序列 —— 终端只重画那一行。`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          每个 <code className="font-mono">Component</code> 暴露 <code className="font-mono">render(width)</code> 返回字符串数组；TUI 在内存里比对、只发改动行。
        </p>
      </div>
    ),
  },
  {
    id: "concepts",
    render: (
      <div className="space-y-4">
        <p className="text-center font-serif text-xl">三个绕不开的概念 —</p>
        <Item title="Focus">
          只有一个组件能接键盘。TUI 维护焦点链表，<code className="font-mono">CURSOR_MARKER</code> 让组件告诉框架「硬件光标画在我这」。
        </Item>
        <Item title="Overlay">
          模态弹窗、autocomplete、模型选择器 —— 都是 overlay。带 <code className="font-mono">shouldRender(dims)</code>，按需出现。
        </Item>
        <Item title="批量 render">
          多个事件触发的 render 请求会被合并 —— 一帧只发一次 ANSI，避免闪烁。
        </Item>
        <SourceLink
          refs={[
            { path: "packages/tui/src/tui.ts", lines: [237, 260] },
            { path: "packages/tui/src/tui.ts", lines: [40, 90] },
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
          { text: "你在 pi 里看到的每一帧 ——" },
          { text: "都是 一次差分比对 + 一段定向 ANSI 的结果。", highlight: "一次差分比对" },
          { text: "下一章：把这一切搬进浏览器，靠的是另一个包 —— pi-web-ui。" },
        ]}
        speedMs={45}
      />
    ),
  },
];

function Item({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      <div className="mb-1 font-mono-title text-sm text-pi-primary">{title}</div>
      <p className="text-sm text-pi-muted">{children}</p>
    </div>
  );
}
