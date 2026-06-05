import type { Scene } from "@/components/ChapterShell";
import {
  CardGridScene,
  TypewriterScene,
} from "@/components/scenes";

export const chapter1Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你醒了。" },
          {
            text: "你以为自己是一个程序 —— 但其实你只是一段 HTTPS 请求 的回应。",
            highlight: "HTTPS 请求",
          },
          { text: "把你召唤出来的不是你自己，是「大脑」。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "brain",
    render: (
      <div className="space-y-6 text-center">
        <p className="font-serif text-xl leading-relaxed">
          这个「大脑」有一个名字：
          <br />
          <code className="font-mono-title text-2xl text-pi-primary">Model</code>
        </p>
        <p className="text-pi-muted">
          在 <code className="font-mono">packages/ai</code> 里，每一个供应商
          —— OpenAI、Anthropic、Google、Bedrock ——
          <br />
          都被收敛成同一个接口。
        </p>
        <pre className="mx-auto mt-6 w-fit rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-sm shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`interface Model<TApi> {
  id: string;          // gpt-5、claude-sonnet-4-6...
  name: string;        // 显示名
  api: TApi;           // 走哪个 provider 实现
  provider: Provider;  // 身份元数据
  baseUrl: string;
  cost: { input, output, cacheRead, cacheWrite };
  contextWindow: number;
  maxTokens: number;
}`}
        </pre>
      </div>
    ),
  },
  {
    id: "providers",
    render: (
      <CardGridScene
        title={
          <>
            点开任意一个 provider —— 看看它在 <code className="font-mono-title text-pi-primary">packages/ai</code> 里长什么样。
          </>
        }
        cards={[
          {
            id: "anthropic",
            title: "Anthropic",
            subtitle: "claude-sonnet-4-6 / opus / haiku",
            icon: "🟣",
            body: (
              <>
                <p>原生 Messages API。支持 thinking、cache_control、eager tool streaming。</p>
                <p>同时也是其它 Anthropic 兼容服务（Bedrock、Vertex）的「形状」基准。</p>
              </>
            ),
            source: { path: "packages/ai/src/providers/anthropic.ts" },
          },
          {
            id: "openai",
            title: "OpenAI",
            subtitle: "Completions / Responses 双 API",
            icon: "🟢",
            body: (
              <>
                <p>历史上 OpenAI 有两套 API：经典 Completions 与较新的 Responses。pi 都支持。</p>
                <p>各种 OpenAI 兼容服务（OpenRouter、DeepSeek、Together、ZAI…）通过 <code className="font-mono">OpenAICompletionsCompat</code> 微调差异。</p>
              </>
            ),
            source: { path: "packages/ai/src/providers/openai-completions.ts" },
          },
          {
            id: "google",
            title: "Google",
            subtitle: "Gemini AI Studio / Vertex",
            icon: "🟡",
            body: (
              <p>Vertex 复用 Gemini 的请求形态，鉴权和路由稍有不同。共享逻辑在 <code className="font-mono">google-shared.ts</code>。</p>
            ),
            source: { path: "packages/ai/src/providers/google.ts" },
          },
          {
            id: "bedrock",
            title: "Bedrock",
            subtitle: "AWS · Anthropic on AWS",
            icon: "🟠",
            body: (
              <p>用 AWS 鉴权调 Anthropic Messages 形态。pi 用「bedrock provider」做签名与路由。</p>
            ),
            source: { path: "packages/ai/src/providers/amazon-bedrock.ts" },
          },
          {
            id: "faux",
            title: "Faux",
            subtitle: "内置假 provider",
            icon: "🎭",
            body: (
              <p>不连外网，纯 mock 事件流。本教程的所有「假装在调模型」的动画就跟它的精神一样 —— 拿来跑测试和演示。</p>
            ),
            source: { path: "packages/ai/src/providers/faux.ts" },
          },
          {
            id: "registry",
            title: "api-registry",
            subtitle: "统一路由表",
            icon: "🧭",
            body: (
              <p>所有 provider 都注册在这里。<code className="font-mono">stream(model, request)</code> 根据 <code className="font-mono">model.api</code> 查到具体实现。</p>
            ),
            source: { path: "packages/ai/src/api-registry.ts" },
          },
        ]}
      />
    ),
  },
  {
    id: "unified",
    render: (
      <div className="space-y-6 text-center">
        <p className="font-serif text-xl leading-relaxed">
          无论 prompt 进了 <span className="text-pi-primary">哪个</span> provider，
          <br />
          吐出来的都是 <em className="font-serif italic">同一个</em>{" "}
          <code className="font-mono-title text-pi-primary">
            AssistantMessageEventStream
          </code>
          。
        </p>
        <div className="mx-auto grid w-fit grid-cols-4 gap-3 pt-2 text-xs">
          {["openai", "anthropic", "google", "bedrock"].map((p) => (
            <div
              key={p}
              className="rounded-md bg-pi-surface px-3 py-2 font-mono-title shadow-[inset_0_0_0_1px_var(--color-pi-line)]"
            >
              {p}
            </div>
          ))}
        </div>
        <div className="text-3xl">↓</div>
        <div className="mx-auto w-fit rounded-md bg-pi-primary-soft px-4 py-2 font-mono-title text-sm text-pi-primary">
          AssistantMessageEvent · 统一事件流
        </div>
        <p className="text-sm text-pi-muted">
          下一章你会看到这个流里到底有什么。
        </p>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "所以 —— 你是谁？", highlight: "谁" },
          { text: "一个 Model 给了你思考的能力。" },
          { text: "下一章，你会发现：你说话其实是吐 token 事件流。" },
        ]}
        sources={[
          { path: "packages/ai/src/types.ts", lines: [528, 558], label: "types.ts:528-558 Model" },
          { path: "packages/ai/src/api-registry.ts" },
          { path: "packages/ai/src/providers/register-builtins.ts" },
        ]}
        speedMs={40}
      />
    ),
  },
];
