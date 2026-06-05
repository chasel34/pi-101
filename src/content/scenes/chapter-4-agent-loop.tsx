import type { Scene } from "@/components/ChapterShell";
import {
  SourceLink,
  StepPlayerScene,
  TypewriterScene,
} from "@/components/scenes";

export const chapter4Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "Model 给了你思考的能力，Context 给了你看见的世界。" },
          { text: "但你 还不能动。", highlight: "还不能动" },
          { text: "让你动起来的东西叫 —— Agent Loop。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "what",
    render: (
      <div className="space-y-6 text-center">
        <p className="font-serif text-2xl leading-relaxed">
          一个 Agent Loop = 一次「<span className="text-pi-primary">心跳</span>」。
        </p>
        <p className="text-pi-muted">
          每一次心跳里都发生 5 件事：思考 → 说话 → 调工具 → 看结果 → 决定要不要再来一轮。
        </p>
      </div>
    ),
  },
  {
    id: "step",
    render: (
      <StepPlayerScene
        title={
          <>
            点击 <span className="font-mono-title text-pi-primary">▶</span>，
            跟着 AI 走完一次真实的 Agent Loop —
          </>
        }
        steps={[
          {
            id: "1",
            title: "用户输入",
            badge: "input",
            body: (
              <>
                用户从 CLI 发来一句话。<code className="font-mono">AgentSession.submitMessage()</code> 把它丢进队列，启动一轮新的 turn。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/agent-session.ts" },
          },
          {
            id: "2",
            title: "拼装 Context",
            badge: "context",
            body: (
              <>
                把用户消息、之前的对话、CLAUDE.md、tools、skills 拼成一个完整 <code className="font-mono">AgentContext</code>。
              </>
            ),
            source: {
              path: "packages/coding-agent/src/core/system-prompt.ts",
              lines: [28, 80],
            },
          },
          {
            id: "3",
            title: "stream(model, ctx)",
            badge: "thinking",
            body: (
              <>
                进入 <code className="font-mono">agentLoop()</code>，调 <code className="font-mono">streamFn</code> 让大脑开始吐 token。UI 实时显示思考与文字。
              </>
            ),
            source: {
              path: "packages/agent/src/agent-loop.ts",
              lines: [31, 53],
            },
          },
          {
            id: "4",
            title: "AssistantMessage 收尾",
            badge: "speak",
            body: (
              <>
                收到 <code className="font-mono">done</code> 事件，本轮 assistant message 落地。如果里面没有 tool call，loop 结束。
              </>
            ),
            source: { path: "packages/ai/src/types.ts", lines: [347, 359] },
          },
          {
            id: "5",
            title: "beforeToolCall",
            badge: "guard",
            body: (
              <>
                逐个工具调用过 <code className="font-mono">beforeToolCall</code> hook：可放行、可拒绝、可改参数。这是「权限闸门」。
              </>
            ),
            source: { path: "packages/agent/src/types.ts", lines: [83, 110] },
          },
          {
            id: "6",
            title: "执行工具",
            badge: "act",
            body: (
              <>
                按 <code className="font-mono">parallel</code> / <code className="font-mono">sequential</code> 策略执行。文件改动、子进程、网络请求 —— 都在这里发生。
              </>
            ),
            source: { path: "packages/coding-agent/src/core/tools" },
          },
          {
            id: "7",
            title: "afterToolCall",
            badge: "observe",
            body: (
              <>
                结果回来后过 <code className="font-mono">afterToolCall</code>。可以截断 / 重写输出 —— 比如把超长的命令输出换成「省略 N 行」。
              </>
            ),
            source: { path: "packages/agent/src/types.ts", lines: [95, 110] },
          },
          {
            id: "8",
            title: "结果回灌 context",
            badge: "feed",
            body: (
              <>
                <code className="font-mono">toolResult</code> 作为新的 message 加进 <code className="font-mono">AgentContext.messages</code>。
              </>
            ),
            source: { path: "packages/agent/src/agent-loop.ts" },
          },
          {
            id: "9",
            title: "继续下一轮",
            badge: "next",
            body: (
              <>
                有 tool 用过就再来一轮 stream。AI 看到结果、判断、继续行动或停下来回话。这就是「Agentic Loop」。
              </>
            ),
          },
        ]}
      />
    ),
  },
  {
    id: "code",
    render: (
      <div className="space-y-6">
        <p className="text-center font-serif text-xl leading-relaxed">
          整个过程在 <code className="font-mono-title text-pi-primary">agentLoop()</code> 一个函数里。
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`export function agentLoop(
  prompts: AgentMessage[],
  context: AgentContext,
  config: AgentLoopConfig,
  signal?: AbortSignal,
  streamFn?: StreamFn,        // 默认走 pi-ai 的 stream
): EventStream<AgentEvent, AgentMessage[]>

// 调用方:
for await (const event of agentLoop(...)) {
  // turn_start / message_start / assistant_event / tool_call / tool_result / turn_end / agent_end
}`}
        </pre>
        <SourceLink
          refs={[
            { path: "packages/agent/src/agent-loop.ts", lines: [31, 53] },
            { path: "packages/agent/src/types.ts" },
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
          { text: "你的「行动」从来不是一次性的。" },
          { text: "每一次行动都进入下一次思考。", highlight: "每一次行动都进入下一次思考" },
          { text: "下一章：在这一层之上还有人 —— AgentSession。" },
        ]}
        speedMs={45}
      />
    ),
  },
];
