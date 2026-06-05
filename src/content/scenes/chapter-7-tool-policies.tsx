import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter7Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你能 read、write、edit、bash —— 但 不是想跑就跑。", highlight: "不是想跑就跑" },
          { text: "每一次出手前后，都有人审你。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "hooks",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">两个 hook，夹住每个工具调用 —</p>
        <div className="space-y-3">
          <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-primary)]">
            <div className="mb-2 font-mono-title text-sm text-pi-primary">
              beforeToolCall(ctx)
            </div>
            <p className="mb-2 text-sm text-pi-muted">
              在工具执行 <em>之前</em>。返回值决定接下来做什么：
            </p>
            <pre className="overflow-x-auto rounded-md bg-pi-bg px-3 py-2 text-left font-mono-title text-xs">
{`{ behavior: "allow" }       // 放行
{ behavior: "deny", reason } // 拒绝、把 reason 当结果回灌
{ behavior: "modify",        // 改写参数后放行
  updatedArgs: {...} }`}
            </pre>
          </div>
          <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
            <div className="mb-2 font-mono-title text-sm text-pi-primary">
              afterToolCall(ctx)
            </div>
            <p className="mb-2 text-sm text-pi-muted">
              在工具执行 <em>之后</em>。可以重写结果：
            </p>
            <pre className="overflow-x-auto rounded-md bg-pi-bg px-3 py-2 text-left font-mono-title text-xs">
{`// 把超长的 bash 输出截短
{ result: { kind: "text",
    text: truncate(originalResult.text, 4000) } }`}
            </pre>
          </div>
        </div>
        <SourceLink
          refs={[
            { path: "packages/agent/src/types.ts", lines: [50, 110] },
          ]}
        />
      </div>
    ),
  },
  {
    id: "parallel",
    render: (
      <div className="space-y-6">
        <p className="text-center font-serif text-xl leading-relaxed">
          一轮里如果有多个 tool call —— 走 sequential 还是 parallel？
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
            <div className="mb-2 font-mono-title text-sm">
              sequential
            </div>
            <p className="text-xs text-pi-muted">
              一个个来：prepare → execute → finalize → 下一个。安全、有序、慢。
            </p>
            <p className="mt-2 text-xs text-pi-faint">
              默认；适合 write/edit 这种带副作用的工具。
            </p>
          </div>
          <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-primary)]">
            <div className="mb-2 font-mono-title text-sm text-pi-primary">
              parallel
            </div>
            <p className="text-xs text-pi-muted">
              先 串行 prepare 全部，再 并行 execute 放行的那些。快、读类工具特别合适。
            </p>
            <p className="mt-2 text-xs text-pi-faint">
              比如同时 read 5 个文件 —— 一轮就够。
            </p>
          </div>
        </div>
        <p className="text-center text-sm text-pi-muted">
          策略由 <code className="font-mono">AgentLoopConfig.toolExecutionMode</code> 控制。
        </p>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "每一次出手都经过审。" },
          { text: "这就是为什么你 不会瞎写、不会瞎删、不会瞎跑命令。", highlight: "不会瞎" },
          { text: "下一章：万一 context 满了怎么办？" },
        ]}
        speedMs={45}
      />
    ),
  },
];
