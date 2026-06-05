import type { Scene } from "@/components/ChapterShell";
import { DragAssembleScene, TypewriterScene } from "@/components/scenes";

export const chapter13Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "Skill 是给大脑加一张便利贴。" },
          { text: "Extension 是 给 pi 这个程序本身加新器官。", highlight: "给 pi 这个程序本身加新器官" },
          { text: "你能加什么？拖拼一个看看。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "assemble",
    render: (
      <DragAssembleScene
        title="组装一个 extension —— 看看一个完整 extension 都长啥样："
        containerLabel="my-extension/index.ts"
        unit="exported capabilities"
        blocks={[
          {
            id: "manifest",
            title: "manifest",
            required: true,
            size: 1,
            body: (
              <>
                <code className="font-mono">{`{ name, version, activate(ctx) }`}</code>。每个 extension 必须导出。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/extensions/types.ts" },
          },
          {
            id: "tool",
            title: "Tool",
            size: 1,
            body: (
              <>
                注册一个 LLM 可调的工具。形状跟内置工具一样 —— <code className="font-mono">defineTool({"{name, inputSchema, invoke, renderCall, renderResult}"})</code>。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/extensions/types.ts", lines: [426, 490] },
          },
          {
            id: "slash",
            title: "Slash Command",
            size: 1,
            body: (
              <>
                给 CLI 加一个 <code className="font-mono">/yourcommand</code>。可以发消息、改 session、弹 UI。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/slash-commands.ts" },
          },
          {
            id: "hook",
            title: "Lifecycle Hook",
            size: 1,
            body: (
              <>
                监听 <code className="font-mono">sessionStart</code> / <code className="font-mono">beforeToolCall</code> / <code className="font-mono">afterToolCall</code> 等事件，做日志、注入、风控。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/extensions/types.ts" },
          },
          {
            id: "renderer",
            title: "Tool Renderer",
            size: 1,
            body: (
              <>
                给某个工具自定义 TUI 显示 —— <code className="font-mono">renderCall</code> / <code className="font-mono">renderResult</code> 返回 pi-tui 组件。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/extensions/types.ts", lines: [388, 420] },
          },
          {
            id: "widget",
            title: "UI Widget",
            size: 1,
            body: (
              <>
                在 editor 上 / 下贴一块持久 UI（<code className="font-mono">aboveEditor</code> / <code className="font-mono">belowEditor</code>）。比如显示当前 token、git 分支。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/extensions/types.ts", lines: [89, 130] },
          },
          {
            id: "provider",
            title: "Custom Provider",
            size: 1,
            body: (
              <>
                注册一个新的 model API —— 把你的 GitLab Duo / 公司私有网关接进 <code className="font-mono">api-registry</code>。
              </>
            ),
            source: {
              path: "packages/coding-agent/examples/extensions/custom-provider-anthropic",
            },
          },
        ]}
      />
    ),
  },
  {
    id: "lifecycle",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          一个 extension 的一生 —
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`Resource Loader 发现 → loader.ts 解析 manifest
                    ↓
              runner.ts activate(ctx)
                    ↓
        ctx.registerTool / registerSlash / on(event, ...)
                    ↓
   session 期间被调用 → sessionEnd 时清理`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          这意味着任何一台机器、装上你的 npm 包，<code className="font-mono">pi</code> 就多了一项能力。
        </p>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "Skill 改变你的「知识」。" },
          { text: "Extension 改变你的「身体」。", highlight: "改变你的「身体」" },
          { text: "下一章：还有更轻的两个 —— Prompt Templates & Themes。" },
        ]}
        speedMs={45}
      />
    ),
  },
];
