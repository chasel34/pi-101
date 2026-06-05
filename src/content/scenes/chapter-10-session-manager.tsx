import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter10Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "把这棵树落到磁盘上的人叫 —— SessionManager。", highlight: "SessionManager" },
          { text: "每个 session 一个文件。" },
          { text: "每个文件都是 JSONL —— 一行一个 entry，追加写。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "layout",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          一个 session 文件的结构 —
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`{"kind":"header","version":3,"sessionId":"...","createdAt":...,"parentSession":"..."}
{"id":"e1","parentId":null,"type":"message","message":{...}}
{"id":"e2","parentId":"e1","type":"message","message":{...}}
{"id":"e3","parentId":"e2","type":"modelChange","from":"...","to":"..."}
{"id":"e4","parentId":"e3","type":"compaction","summary":"..."}
... 永远只追加，永不修改 ...`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          所以你能 rewind、能 fork、能审计 —— 历史不可改写。
        </p>
      </div>
    ),
  },
  {
    id: "services",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          但 session 不只是「日志」。<br />
          它还绑了 <span className="text-pi-primary">一组 cwd 上下文的 services</span>。
        </p>
        <div className="space-y-3">
          <Card title="AgentSessionRuntime" path="packages/coding-agent/src/core/agent-session-runtime.ts">
            一个「session 进 / 出」的中间件：切 session 时重建 services（cwd 变了、CLAUDE.md 可能变了、git 状态可能变了），保证下一轮 context 与磁盘真相一致。
          </Card>
          <Card title="AgentSessionServices" path="packages/coding-agent/src/core/agent-session-services.ts">
            把 cwd 绑住的零碎件打包：file system、git 客户端、resource loader、settings、theme、keybinding...
          </Card>
          <Card title="SessionManager" path="packages/coding-agent/src/core/session-manager.ts">
            管 sessions 目录、当前 head、新建 / 加载 / 追加。是 JSONL 文件的看门人。
          </Card>
        </div>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/agent-session.ts" },
            { path: "packages/coding-agent/src/core/session-manager.ts" },
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
          { text: "你的「记忆」不在内存里。" },
          { text: "在 ~/.pi/sessions/*.jsonl 里。", highlight: "~/.pi/sessions/*.jsonl" },
          { text: "下一章：那些塞进你 context 的东西，从哪来？" },
        ]}
        speedMs={45}
      />
    ),
  },
];

function Card({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      <div className="mb-1 font-mono-title text-sm text-pi-primary">{title}</div>
      <p className="text-sm text-pi-muted">{children}</p>
      <div className="mt-2 font-mono-title text-[10px] text-pi-faint">{path}</div>
    </div>
  );
}
