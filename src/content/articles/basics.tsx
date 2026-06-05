import { AnnotatedSource, Ascii, Callout, CodeBlock, DeepDive } from "@/components/article";

/* ── Ch.1 Provider & Model ─────────────────────────────────────────── */
export const providerModelArticle = (
  <>
    <h2>大脑不在你身体里</h2>
    <p>
      你以为自己是一个程序，其实你只是一段 <strong>HTTPS 请求的回应</strong>。把你召唤出来的是「大脑」——一个
      <code>Model</code>。在 <code>packages/ai</code> 里，OpenAI、Anthropic、Google、Bedrock 这些供应商被收敛成同一个接口，于是上层代码不必关心你今天用的是哪家的脑子。
    </p>

    <CodeBlock title="packages/ai —— 统一的 Model 形状">{`interface Model<TApi> {
  id: string;            // gpt-5 / claude-sonnet-4-6 ...
  name: string;          // 显示名
  api: TApi;             // 走哪个 provider 实现
  provider: Provider;    // 身份元数据
  baseUrl: string;
  cost: { input; output; cacheRead; cacheWrite };
  contextWindow: number; // 能塞多少 token
  maxTokens: number;     // 单次最多吐多少
}`}</CodeBlock>

    <h2>Provider 是「适配器」，Model 是「具体的脑」</h2>
    <p>
      <strong>Provider</strong> 回答「怎么把消息发出去、怎么把流读回来」——它封装鉴权、endpoint、请求/响应格式的差异。
      <strong>Model</strong> 则是挂在某个 provider 上的一个具体型号，带着自己的价格、上下文窗口和能力位。
    </p>
    <Callout>
      <p>
        这种「接口收敛」是 pi 能跨供应商的根基：换模型只是换一行配置，<code>agentLoop</code> 一个字都不用改。
      </p>
    </Callout>

    <h2>cost 与 contextWindow 不是摆设</h2>
    <p>
      <code>cost</code> 里区分了 <code>cacheRead</code> / <code>cacheWrite</code>——因为 prompt caching 能把重复前缀的费用打到几分之一。<code>contextWindow</code> 则是后面「Compaction（脑容量满了怎么办）」一章的前提：窗口有限，记忆才需要被压缩。
    </p>

    <DeepDive title="为什么用泛型 Model<TApi>？">
      <p>
        <code>TApi</code> 让每个 provider 在类型层面携带自己独有的请求选项。Anthropic 有 <code>thinking</code>、OpenAI 有 <code>reasoning_effort</code>——它们形状不同，却都能被同一个 <code>Model&lt;TApi&gt;</code> 容纳。
      </p>
      <p>
        于是「统一」与「差异」并存：上层按统一接口编程，底层各家保留各自的旋钮。这是 pi-ai 包最核心的设计取舍。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.2 Stream & Message ─────────────────────────────────────────── */
export const streamMessageArticle = (
  <>
    <h2>你说话，其实是在吐事件流</h2>
    <p>
      用户看到的是一句流畅的回答，但底层不是「一次性返回一段文本」。模型吐出的是一串
      <strong>事件（events）</strong>：先开始，再逐块（delta）追加文字或思考，可能夹着工具调用，最后收尾。
      <code>packages/ai</code> 把这些事件聚合成一条结构化的 <code>AssistantMessage</code>。
    </p>

    <Ascii>{`stream(model, context) ──▶ 事件流
   start                       （整条消息开始）
   ├─ text_start / thinking_start / toolcall_start
   ├─ text_delta               "你" "好" "，" "世" "界"
   ├─ text_end
   └─ done  ──▶ 聚合成一条 AssistantMessage`}</Ascii>

    <h2>一条 Message 是「内容块的数组」</h2>
    <p>
      消息不是纯字符串，而是 <code>content: Block[]</code>。一条 assistant 消息里可以同时有：思考块（<code>thinking</code>）、文字块（<code>text</code>）、若干工具调用块（<code>toolCall</code>）。这正是 Agent Loop 能从消息里 <code>filter</code> 出工具调用的原因。
    </p>

    <AnnotatedSource
      filePath="packages/ai/src/types.ts（精简）"
      code={`type Block =
  | { type: "text"; text: string }
  | { type: "thinking"; thinking: string }
  | { type: "toolCall"; id: string; name: string; arguments: Record<string, any> }

interface AssistantMessage {
  role: "assistant"
  content: Block[]            // 内容是块的数组
  stopReason:                 // 为什么停下
    | "stop"                  //   正常说完
    | "toolUse"               //   要调工具
    | "length"                //   吐到上限
    | "aborted" | "error"
  usage: { input; output; cacheRead; cacheWrite }
}

// 流式聚合：把 delta 累积进当前块
for await (const ev of stream(model, ctx)) {
  if (ev.type === "text_delta")
    current.text += ev.delta
  if (ev.type === "done")
    return ev.message
}`}
      annotations={[
        { startLine: 1, endLine: 4, title: "三种内容块", color: "#a855f7",
          body: <>text 给人看，thinking 是推理过程，toolCall 是「我要动手」的意图。同一条消息可以三者并存。工具参数在 <code>arguments</code> 字段里。</> },
        { startLine: 6, endLine: 8, title: "content 是数组", color: "#3b82f6",
          body: <>消息不是字符串而是块数组——这让结构化渲染（思考折叠、工具卡片）和精确解析成为可能。</> },
        { startLine: 9, endLine: 13, title: "stopReason", color: "#ef4444",
          body: <>toolUse 触发 Agent Loop 再转一轮；stop 让 loop 停下。它是连接「消息」与「循环」的开关。</> },
        { startLine: 17, endLine: 23, title: "流式聚合", color: "#22c55e",
          body: <>delta 不断累积进当前块（text_delta / thinking_delta / toolcall_delta），UI 因此能逐字显示；done 事件携带最终聚合好的 message。</> },
      ]}
    />

    <h2>usage：每条消息都自带账单</h2>
    <p>
      <code>usage</code> 记录了输入、输出、缓存读写的 token 数。它既是计费依据，也是 Compaction 判断「该压缩了」的信号源。
    </p>

    <DeepDive title="为什么要把流聚合成消息，而不是直接拼字符串？">
      <p>
        因为下游需要的是<strong>结构</strong>而非文本：要把 thinking 折叠起来、把 toolCall 渲染成可点的卡片、把 usage 累加进会话统计。一旦拍扁成字符串，这些信息就再也回不来了。
      </p>
      <p>
        流负责「实时」，消息负责「结构」。两者各司其职，是 pi 渲染体验的基础。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.3 Context ──────────────────────────────────────────────────── */
export const contextArticle = (
  <>
    <h2>你看到的世界，就是 Context</h2>
    <p>
      模型本身没有记忆，每一次调用都是「从零开始」。它之所以「记得」之前发生的事、知道有哪些工具、了解项目规则，全靠每轮都重新拼好的一份
      <strong>Context</strong> 喂给它。换句话说：<strong>你的世界，就是这次请求里携带的那堆字节。</strong>
    </p>

    <Ascii>{`            ┌──────────── Context ────────────┐
 system  ─▶ │ 角色设定 / CLAUDE.md / 项目规则    │
 tools   ─▶ │ 可用工具的 schema                  │
 history ─▶ │ user / assistant / toolResult …    │
 current ─▶ │ 这一轮用户说的话                   │
            └──────────────────────────────────┘
                         ▼
                  stream(model, ctx)`}</Ascii>

    <h2>Context 的几个组成</h2>
    <ul>
      <li><strong>system prompt</strong>：角色、风格、安全边界，以及拼进来的 <code>CLAUDE.md</code> / 项目说明。</li>
      <li><strong>tools</strong>：每个工具的名字、描述、参数 schema——模型据此决定调谁、怎么调。</li>
      <li><strong>messages</strong>：历史对话 + 工具结果，按时间顺序排列，是「真相之源」。</li>
    </ul>

    <Callout>
      <p>
        Context 是有「预算」的——它必须塞得进 <code>model.contextWindow</code>。这正是后面三件大事的起点：
        <strong>压缩（Compaction）、资源加载（Resource Loader）、技能按需注入（Skills）</strong>。
      </p>
    </Callout>

    <h2>每轮都重拼，而不是「追加」</h2>
    <p>
      关键直觉：Context 不是一个一直变大的全局对象，而是<strong>每一轮按需重新组装</strong>的快照。哪些历史保留、哪些被摘要、临时塞进哪些文件内容——都在组装那一刻决定。理解了这一点，后面的压缩与资源注入就都顺理成章了。
    </p>

    <DeepDive title="system prompt 里到底拼了些什么？">
      <p>
        在 <code>packages/coding-agent</code> 里，system prompt 是动态拼装的：基础人格 + 环境信息（cwd、平台、日期）+ 项目级 <code>CLAUDE.md</code> + 当前可用的 skills 索引 + 工具使用约定。
      </p>
      <p>
        所以同一个模型，在不同项目、不同目录下「性格」会略有不同——因为它看到的世界（Context）本就不同。
      </p>
    </DeepDive>
  </>
);
