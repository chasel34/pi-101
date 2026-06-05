import type { Scene } from "@/components/ChapterShell";
import {
  CardGridScene,
  SourceLink,
  TypewriterScene,
} from "@/components/scenes";

export const chapter6Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你不能只「说」。" },
          { text: "你得能 读、写、改、跑、找。", highlight: "读、写、改、跑、找" },
          { text: "pi 给了你一个工具箱 —— 7 个内置工具。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "grid",
    render: (
      <CardGridScene
        title="点开每一张卡片，看这个工具的形状："
        columns={3}
        cards={[
          {
            id: "read",
            title: "Read",
            subtitle: "读取文件 / 图片 / PDF",
            icon: "📖",
            body: (
              <>
                <p>支持文本、PDF（带页码）、Jupyter notebook 输出、图像。带「行号 + 制表符」格式输出。</p>
                <p>对 <code className="font-mono">CLAUDE.md</code> / <code className="font-mono">AGENTS.md</code> 有紧凑模式 —— 节省 token。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/core/tools/read.ts" },
          },
          {
            id: "write",
            title: "Write",
            subtitle: "整文件覆盖写入",
            icon: "✍",
            body: (
              <p>纯写。要求你已经先 Read 过同路径，避免「盲写覆盖」。</p>
            ),
            source: { path: "packages/coding-agent/src/core/tools/write.ts" },
          },
          {
            id: "edit",
            title: "Edit",
            subtitle: "精准字符串替换",
            icon: "✂",
            body: (
              <>
                <p>不返回 diff，让模型自己拼字符串。要求 <code className="font-mono">old_string</code> 唯一。</p>
                <p>背后用一个 file-mutation-queue 串行所有改动，避免并发互相踩。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/core/tools/edit.ts" },
          },
          {
            id: "bash",
            title: "Bash",
            subtitle: "跑 shell 命令",
            icon: "⌨",
            body: (
              <>
                <p>用户 profile 初始化的 shell。支持后台运行、监视、超时。</p>
                <p>有截断器（output-accumulator）—— 输出过长就给一段省略提示，省 token。</p>
              </>
            ),
            source: { path: "packages/coding-agent/src/core/tools/bash.ts" },
          },
          {
            id: "find",
            title: "Find (Glob)",
            subtitle: "按文件名通配",
            icon: "🔭",
            body: (
              <p>实际是个 glob —— <code className="font-mono">**/*.ts</code> 这种。返回按修改时间排序的命中列表。</p>
            ),
            source: { path: "packages/coding-agent/src/core/tools/find.ts" },
          },
          {
            id: "grep",
            title: "Grep",
            subtitle: "按内容搜索",
            icon: "🔎",
            body: (
              <p>ripgrep 的薄封装：支持 -i / 行号 / 上下文 / 类型过滤。命中量大会自动收敛。</p>
            ),
            source: { path: "packages/coding-agent/src/core/tools/grep.ts" },
          },
          {
            id: "ls",
            title: "LS",
            subtitle: "看目录",
            icon: "📂",
            body: (
              <p>列出某目录文件，自动忽略 node_modules / .git 之类的噪音。</p>
            ),
            source: { path: "packages/coding-agent/src/core/tools/ls.ts" },
          },
        ]}
      />
    ),
  },
  {
    id: "schema",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          每个工具的形状都长这样 —
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`type Tool = {
  name: string;
  description: string;               // 大脑读到的「使用说明」
  inputSchema: JSONSchema;           // 校验入参
  invoke: (args, ctx) => ToolResult; // 真正干活的函数
  render?: (call, result) => Node;   // UI 怎么画这一格
}`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          扩展工具也是这个形状 —— 第 13 章会让你亲手装一个。
        </p>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/tools/index.ts" },
            { path: "packages/coding-agent/src/core/tools/tool-definition-wrapper.ts" },
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
          { text: "有了工具，你能 read、write、edit、bash、find、grep、ls。" },
          { text: "但 —— 你不能 想跑就跑。", highlight: "想跑就跑" },
          { text: "下一章你会遇到看门人：Tool Policies。" },
        ]}
        speedMs={45}
      />
    ),
  },
];
