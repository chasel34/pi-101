import { AnnotatedSource, Ascii, Callout, CodeBlock, DeepDive } from "@/components/article";

/* ── Ch.5 Agent vs AgentSession ────────────────────────────────────── */
export const agentVsSessionArticle = (
  <>
    <h2>一个引擎，一个门面</h2>
    <p>
      上一章的 <code>agentLoop()</code> 是<strong>底层引擎</strong>：给它 context、config、一个 stream 函数，它就吐事件、转圈圈，纯粹、无状态、不关心你是谁。但真实产品里还需要有人管「这是哪个会话、历史存哪、用户中途插话怎么办、权限谁来批」——这就是
      <strong>AgentSession</strong>，业务门面。
    </p>

    <Ascii>{`┌───────────────────────────────────────────────┐
│ AgentSession  (packages/coding-agent)           │
│  • 持有会话状态 / 历史 / cwd 服务               │
│  • submitMessage() 入队、起一轮 turn            │
│  • 提供 hooks：beforeToolCall / shouldStop …    │
│  • 把 AgentEvent 转译给 UI                       │
│        │ 调用                                    │
│        ▼                                         │
│  agentLoop()  (packages/agent)  ← 无状态引擎     │
│  • 思考 → 行动 → 观察 → 重复                     │
└───────────────────────────────────────────────┘`}</Ascii>

    <h2>为什么要分两层？</h2>
    <ul>
      <li><strong>可测试</strong>：引擎纯函数式，喂假 stream 就能测循环逻辑，不碰文件系统。</li>
      <li><strong>可复用</strong>：同一个引擎，CLI、Web、SDK 三种门面都能接。</li>
      <li><strong>可治理</strong>：权限、压缩、停止策略都通过 config 上的 hook 注入，引擎本身保持干净。</li>
    </ul>

    <Callout>
      <p>
        记忆口诀：<strong>agentLoop 负责「怎么转」，AgentSession 负责「为谁转、转的过程谁说了算」。</strong>
      </p>
    </Callout>

    <DeepDive title="submitMessage 之后发生了什么？">
      <p>
        <code>AgentSession.submitMessage()</code> 把用户输入包成 message 入队，组装当前 context，然后启动 <code>agentLoop</code>。循环吐出的每个 <code>AgentEvent</code> 被 session 转译成 UI 能懂的更新，同时把新消息持久化进会话历史。
      </p>
      <p>
        所以「门面」的价值在于：把无状态的循环，接进有状态的世界。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.6 Built-in Tools ───────────────────────────────────────────── */
export const toolsArticle = (
  <>
    <h2>七张工具卡：你的手和脚</h2>
    <p>
      Model 给了你思考，Context 给了你视野，Agent Loop 给了你心跳——但真正让你「碰到世界」的是
      <strong>工具</strong>。pi 内置的核心工具就七个：
    </p>

    <Ascii>{` read   读文件（按行 / 偏移）        find   按文件名 / 通配符找
 write  写文件（整文件覆盖）        grep   按内容正则搜
 edit   精确替换片段                ls     列目录
 bash   跑命令 / 子进程`}</Ascii>

    <h2>工具是「带 schema 的函数」</h2>
    <p>
      每个工具向模型暴露三样东西：<strong>名字、描述、参数 schema</strong>。模型据此决定调谁、填什么参数；执行层拿到结果，再作为 <code>toolResult</code> 回灌 Context。
    </p>

    <CodeBlock title="工具的形状（精简）">{`interface AgentTool {
  name: string                       // "read" / "edit" ...
  description: string                // 给模型看的说明
  parameters: JSONSchema             // 入参约束
  execute(input, ctx): Promise<Result>
}`}</CodeBlock>

    <h2>为什么是「整文件 write」+「精确 edit」两件套？</h2>
    <p>
      <code>write</code> 适合新建或重写；<code>edit</code> 适合在大文件里改一小段。<code>edit</code> 要求待替换片段<strong>唯一</strong>——找不到或不唯一就报错，逼模型提供更多上下文来精确定位。这种「严格匹配」是避免乱改代码的安全阀。
    </p>

    <Callout>
      <p>
        默认情况下，pi 把同一轮里的多个工具调用<strong>并行</strong>执行以求快——读和写都不例外。那「同时改同一个文件」怎么不打架？靠一把<strong>按文件加锁的队列</strong>，而不是让整批退化成串行。下一章细看。
      </p>
    </Callout>

    <DeepDive title="bash 为什么最危险也最强大？">
      <p>
        <code>bash</code> 是唯一能执行任意命令的工具——装依赖、跑测试、git 操作都靠它。但它也意味着无限可能的副作用，因此它是权限闸门（beforeToolCall）最常拦截的对象。
      </p>
      <p>
        pi 的设计哲学是：给模型足够的手脚，但每一只手都能被 hook 按住。能力与约束同时存在。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.7 Tool Policies ────────────────────────────────────────────── */
export const toolPoliciesArticle = (
  <>
    <h2>权限闸门：beforeToolCall / afterToolCall</h2>
    <p>
      工具能改文件、跑命令，所以不能让模型「想调就调」。pi 在每个工具调用前后各设一道关卡：
      <code>beforeToolCall</code> 决定<strong>放行 / 拒绝 / 改参数</strong>，<code>afterToolCall</code> 可以<strong>截断 / 重写</strong>结果。
    </p>

    <Ascii>{`toolCall
   │
   ▼
beforeToolCall ── 拒绝 ─▶ 返回拒绝结果，不执行
   │ 放行 / 改参数
   ▼
执行工具（parallel | sequential）
   │
   ▼
afterToolCall ── 重写 / 截断 ─▶ 干净的 toolResult 回灌 context`}</Ascii>

    <h2>并行 vs 串行</h2>
    <p>
      同一轮里模型可能一次性发起多个工具调用。pi <strong>默认全部并行</strong>跑——快。引擎也允许某个工具把自己标记成 <code>executionMode: "sequential"</code>；只要批次里有一个这样的工具，整批就退化为顺序执行：
    </p>

    <CodeBlock title="packages/agent/src/agent-loop.ts —— 决定并行还是串行">{`const hasSequentialToolCall = toolCalls.some(
  (tc) => tools.find((t) => t.name === tc.name)
    ?.executionMode === "sequential",
)
if (config.toolExecution === "sequential" || hasSequentialToolCall)
  return executeToolCallsSequential(...)
return executeToolCallsParallel(...)`}</CodeBlock>

    <p>
      但 pi 的<strong>内置工具都没有</strong>标记 sequential——它们照样并行。那「同时改同一个文件」的竞态怎么办？答案不是串行整批，而是一把<strong>按文件路径加锁的队列</strong>：<code>edit</code> / <code>write</code> 都包在 <code>withFileMutationQueue(filePath, fn)</code> 里，同一文件的写操作排队进行，不同文件依旧并行。
    </p>

    <CodeBlock title="coding-agent/.../file-mutation-queue.ts —— 按文件序列化写操作">{`// 改同一个文件 → 排队；改不同文件 → 并行
export async function withFileMutationQueue(filePath, fn) {
  const key = realpath(filePath)
  const prev = queues.get(key) ?? Promise.resolve()
  const next = prev.then(() => fn())   // 接在上一个操作之后
  queues.set(key, next.catch(() => {}))
  return next
}`}</CodeBlock>

    <Callout>
      <p>
        <code>afterToolCall</code> 的一个经典用途：把超长命令输出换成「…省略 N 行」，既保住关键信息，又不撑爆 Context。
      </p>
    </Callout>

    <DeepDive title="hook 是怎么注入的？">
      <p>
        这些 hook 挂在 <code>AgentLoopConfig</code> 上，由 AgentSession（或扩展）提供。引擎只负责在恰当的时机 <code>await</code> 它们——它不知道、也不关心策略是「自动批准读操作」还是「每个 bash 都问用户」。
      </p>
      <p>
        策略与机制分离：这让同一个引擎既能跑全自动模式，也能跑步步确认模式。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.8 Compaction ───────────────────────────────────────────────── */
export const compactionArticle = (
  <>
    <h2>脑容量满了怎么办</h2>
    <p>
      Context 必须塞进 <code>model.contextWindow</code>。可是长会话里历史越堆越多，迟早撑爆。pi 的答案是
      <strong>Compaction（压缩）</strong>：当 token 逼近上限，把早期对话<strong>摘要化</strong>，腾出空间，让会话能一直跑下去。
    </p>

    <Ascii>{`token 用量
  ▲
  │                      ┌─ 阈值（窗口的 X%）
  │            ╱╲       │
  │          ╱    ╲     │
  │        ╱        ╲   ▼  触发 compaction
  │      ╱            ╲────────┐
  │    ╱               压缩后  ╲___
  │  ╱                              ╲___
  └──────────────────────────────────▶ 轮次`}</Ascii>

    <h2>压缩不是删除，是「摘要 + 边界」</h2>
    <p>
      压缩会在历史里立一道<strong>compact boundary</strong>：边界之前的内容被一段摘要替代，边界之后保持原样。之后每轮只取边界后的消息再拼 Context——既保留近期细节，又不丢早期脉络。
    </p>

    <AnnotatedSource
      filePath="packages/coding-agent/src/core/compaction/compaction.ts（精简）"
      code={`// 每轮 API 调用前：检查是否需要压缩
const { compactionResult } = await autocompact(
  messagesForQuery, ctx,
  { systemPrompt, userContext },
)

// 只取「压缩边界」之后的消息参与本轮请求
function getMessagesAfterCompactBoundary(messages) {
  const idx = messages.findLastIndex(
    (m) => m.type === "compact_boundary",
  )
  return idx === -1 ? messages : messages.slice(idx)
}

// 摘要：让模型把早期对话浓缩成一段
const summary = await summarize(earlyMessages)
messages.push({ type: "compact_boundary", summary })`}
      annotations={[
        { startLine: 1, endLine: 5, title: "自动触发", color: "#f59e0b",
          body: <>压缩不需要用户操心——每轮请求前自动评估 token 用量，逼近窗口就出手。</> },
        { startLine: 7, endLine: 13, title: "按边界切片", color: "#3b82f6",
          body: <>findLastIndex 找到最近一次压缩边界，只把它之后的消息送给模型，早期内容由摘要代表。</> },
        { startLine: 15, endLine: 17, title: "摘要 + 立界", color: "#22c55e",
          body: <>把早期对话交给模型浓缩成 summary，再以 compact_boundary 形式写回历史。记忆没丢，只是被压扁了。</> },
      ]}
    />

    <Callout>
      <p>
        这就是为什么 pi 能处理跨越成百上千轮的超长任务：它会主动「忘掉细节、记住要点」，像人一样管理自己有限的工作记忆。
      </p>
    </Callout>

    <DeepDive title="压缩会丢信息吗？">
      <p>
        会，也不会。逐字细节会丢（这是压缩的代价），但关键决策、已完成的步骤、约束条件会被摘要保留。pi 的摘要 prompt 专门强调「保留对后续任务有用的事实与状态」。
      </p>
      <p>
        重要的不是记住每个字，而是记住<strong>足以继续工作的上下文</strong>——这正是 Compaction 的设计目标。
      </p>
    </DeepDive>
  </>
);
