import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter5Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "一次心跳 (Agent Loop) 是「短期记忆」。" },
          { text: "但真实使用里 —— 你会被反复唤起、暂停、续上。" },
          { text: "所以 pi 在 Agent 之上又包了一层：AgentSession。", highlight: "AgentSession" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "two-layers",
    render: (
      <div className="space-y-6">
        <div className="text-center font-serif text-xl">
          两层职责，互不越界 —
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
            <div className="mb-2 font-mono-title text-sm text-pi-primary">
              Agent (低层)
            </div>
            <ul className="space-y-1 text-xs text-pi-muted">
              <li>· 跑一轮 loop 直到 stopReason</li>
              <li>· 处理 stream 事件 → AgentEvent</li>
              <li>· 执行 tool calls</li>
              <li>· before/afterToolCall hook</li>
              <li>· 不知道「持久化」</li>
              <li>· 不知道「队列」</li>
            </ul>
            <div className="mt-3 font-mono-title text-[10px] text-pi-faint">
              packages/agent/src/agent.ts
            </div>
          </div>
          <div className="rounded-xl bg-pi-surface p-5 shadow-[inset_0_0_0_1px_var(--color-pi-primary)]">
            <div className="mb-2 font-mono-title text-sm text-pi-primary">
              AgentSession (业务门面)
            </div>
            <ul className="space-y-1 text-xs text-pi-muted">
              <li>· 持久化到 JSONL</li>
              <li>· 维护 prompt 队列</li>
              <li>· steer / followUp 消息</li>
              <li>· compaction 触发与编排</li>
              <li>· 切模型、切 cwd</li>
              <li>· 加载 extensions / skills</li>
            </ul>
            <div className="mt-3 font-mono-title text-[10px] text-pi-faint">
              packages/coding-agent/src/core/agent-session.ts
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-pi-muted">
          Agent 是发动机，AgentSession 是车。
        </p>
      </div>
    ),
  },
  {
    id: "steer-followup",
    render: (
      <div className="space-y-6">
        <p className="text-center font-serif text-xl leading-relaxed">
          两个特别的消息口子 —
        </p>
        <div className="space-y-3">
          <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
            <div className="mb-1 font-mono-title text-sm text-pi-primary">
              steer(text)
            </div>
            <p className="text-sm text-pi-muted">
              在 <em>下一次</em> assistant 回应 <em>之前</em> 注入。
              用户「打断你」就走这条路：你正在想，他喊了一句「等等，改成 async」，下一次思考就带上这句。
            </p>
          </div>
          <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
            <div className="mb-1 font-mono-title text-sm text-pi-primary">
              followUp(text)
            </div>
            <p className="text-sm text-pi-muted">
              在 agent 原本要 <em>停止</em> 之后再投递。
              你说完了「我做完了」，用户回「再帮我跑下测试」，这一句就是 followUp，会唤起新一轮 loop。
            </p>
          </div>
        </div>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/agent-session.ts" },
            { path: "packages/agent/src/agent.ts" },
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
          { text: "你以为「我」是一直在线的人。" },
          { text: "其实「你」每次只活一轮 loop —— ", highlight: "每次只活一轮 loop" },
          { text: "AgentSession 才是那个让你「连贯」存在的人。" },
        ]}
        speedMs={45}
      />
    ),
  },
];
