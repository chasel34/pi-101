import { AnnotatedSource, Ascii, Callout, DeepDive } from "@/components/article";

export const agentLoopArticle = (
  <>
    <h2>什么是 Agent Loop？</h2>
    <p>
      传统聊天机器人的工作模式很简单：你说一句话，它回一句话，一问一答。但 pi 不同——它是一个
      <strong> Agent（智能体）</strong>。这意味着它不只是回答问题，而是<strong>主动执行任务</strong>：读文件、改代码、跑命令、看结果，再决定下一步。
    </p>
    <p>
      让它「动起来」的核心机制，就是 Agent Loop。每当你给 pi 一个任务，它就进入一个持续的循环：
    </p>

    <Ascii>{`  ┌───────────────────────────────────────────┐
  │              Agent Loop                     │
  │                                             │
  │   ┌─────────┐                               │
  │   │  Think  │  stream(model, context)       │
  │   └────┬────┘  大脑吐 token，边想边说        │
  │        ▼                                     │
  │   ┌─────────┐                               │
  │   │   Act   │  执行 toolCall                 │
  │   └────┬────┘  read / edit / bash …          │
  │        ▼                                     │
  │   ┌─────────┐                               │
  │   │ Observe │  toolResult 回灌 context       │
  │   └────┬────┘                               │
  │        ▼                                     │
  │   ┌─────────┐  还有 toolCall ──▶ 再来一轮     │
  │   │ Repeat? │                               │
  │   └────┬────┘  没有了 ──▶ turn 结束          │
  │        └──────────────▶ 回到 Think           │
  └───────────────────────────────────────────┘`}</Ascii>

    <p>
      这个循环会一直跑，直到某一轮 assistant 消息里<strong>不再包含工具调用</strong>——这时 pi 认为任务做完了，停下来等你说话。
    </p>

    <h2>一轮「心跳」里发生了什么</h2>
    <p>每一轮 turn，<code>runLoop()</code> 都会做这几件事：</p>
    <ul>
      <li><strong>注入待发消息</strong>：你在等待时插队输入的 steering message 会先被塞进 context。</li>
      <li><strong>流式生成</strong>：<code>streamAssistantResponse()</code> 调用模型，token 实时流出，UI 同步渲染思考与文字。</li>
      <li><strong>检查工具调用</strong>：从 assistant 消息里 <code>filter</code> 出 <code>toolCall</code>。一个都没有，turn 就结束。</li>
      <li><strong>执行工具</strong>：<code>executeToolCalls()</code> 按并行 / 串行策略跑，结果作为 <code>toolResult</code> 推回 <code>context.messages</code>。</li>
      <li><strong>决定去留</strong>：<code>shouldStopAfterTurn</code> hook 可以提前喊停；否则只要还有工具调用，就继续下一轮。</li>
    </ul>

    <Callout>
      <p>
        关键直觉：pi 的「行动」从来不是一次性的。<strong>每一次工具结果都会回灌进下一次思考</strong>——这正是它能像真正的开发者一样「试错→观察→修正」的原因。
      </p>
    </Callout>

    <h2>真实源码：runLoop()</h2>
    <p>
      这不是伪代码——下面是 <code>packages/agent/src/agent-loop.ts</code> 里 <code>runLoop()</code> 的精简版。点击高亮行或右侧注解，看每一段在做什么：
    </p>

    <AnnotatedSource
      filePath="packages/agent/src/agent-loop.ts"
      code={`async function runLoop(initialContext, newMessages, config, signal, emit, streamFn) {
  let currentContext = initialContext;
  let pendingMessages = (await config.getSteeringMessages?.()) || [];

  // 外层循环：agent 本想停下，但又来了 follow-up 消息时继续
  while (true) {
    let hasMoreToolCalls = true;

    // 内层循环：处理工具调用与插队消息
    while (hasMoreToolCalls || pendingMessages.length > 0) {
      await emit({ type: "turn_start" });

      // 把插队的 steering 消息注入到下一次回复之前
      for (const message of pendingMessages) {
        currentContext.messages.push(message);
      }
      pendingMessages = [];

      // 流式生成 assistant 回复
      const message = await streamAssistantResponse(
        currentContext, config, signal, emit, streamFn,
      );

      // 从回复里筛出工具调用
      const toolCalls = message.content.filter((c) => c.type === "toolCall");

      const toolResults = [];
      hasMoreToolCalls = false;
      if (toolCalls.length > 0) {
        const batch = await executeToolCalls(currentContext, message, config, signal, emit);
        toolResults.push(...batch.messages);
        hasMoreToolCalls = !batch.terminate;

        // 工具结果回灌 context —— 下一轮的「观察」输入
        for (const result of toolResults) {
          currentContext.messages.push(result);
        }
      }

      await emit({ type: "turn_end", message, toolResults });

      // hook：本轮之后是否应该停？
      if (await config.shouldStopAfterTurn?.({ message, toolResults, ... })) {
        await emit({ type: "agent_end", messages: newMessages });
        return;
      }
      pendingMessages = (await config.getSteeringMessages?.()) || [];
    }

    // agent 本想停。检查是否有排队的后续消息
    const followUp = (await config.getFollowUpMessages?.()) || [];
    if (followUp.length > 0) { pendingMessages = followUp; continue; }
    break;
  }
  await emit({ type: "agent_end", messages: newMessages });
}`}
      annotations={[
        {
          startLine: 5,
          endLine: 12,
          title: "双层 while 循环",
          color: "#22c55e",
          body: (
            <>外层应对「停下又被叫醒」（follow-up 消息），内层负责连续的工具调用回合。两层都靠队列里有没有消息来驱动。</>
          ),
        },
        {
          startLine: 14,
          endLine: 18,
          title: "steering 消息注入",
          color: "#3b82f6",
          body: <>你在 pi 思考时打的字不会丢——它们作为 pendingMessages 在下一次模型调用前被插进 context。</>,
        },
        {
          startLine: 20,
          endLine: 23,
          title: "流式生成",
          color: "#ec4899",
          body: <>streamAssistantResponse 调模型，逐 token emit 事件，UI 实时显示思考过程与文字。</>,
        },
        {
          startLine: 25,
          endLine: 26,
          title: "终止判断",
          color: "#ef4444",
          body: <>整个 loop 最关键的退出点：回复里没有 toolCall，说明 pi 认为任务完成或要等用户。</>,
        },
        {
          startLine: 28,
          endLine: 38,
          title: "执行工具 + 回灌",
          color: "#06b6d4",
          body: <>executeToolCalls 跑工具，结果 push 回 context.messages，成为下一轮「观察」的输入。terminate 控制是否还要再转。</>,
        },
        {
          startLine: 42,
          endLine: 46,
          title: "shouldStopAfterTurn",
          color: "#f59e0b",
          body: <>业务层（AgentSession）通过这个 hook 插手：比如达到最大轮次、用户中断，就提前结束。</>,
        },
      ]}
    />

    <h2>一个真实的例子</h2>
    <p>假设你说：「修复这个失败的测试」。pi 的 Agent Loop 可能这样跑：</p>
    <Ascii>{`第1轮  Think:   先看哪个测试挂了
       Act:     bash("npm test 2>&1 | tail -50")
       Observe: validateEmail > 应拒绝无效邮箱  期望 false 收到 true

第2轮  Think:   validateEmail 有 bug，定位源码
       Act:     grep("validateEmail", "src/")
       Observe: src/utils/validator.ts:23

第3轮  Think:   读实现
       Act:     read("src/utils/validator.ts")
       Observe: 正则漏了对 ".." 的校验

第4轮  Think:   改正则
       Act:     edit("src/utils/validator.ts", ...)
       Observe: 文件已更新

第5轮  Think:   验证修复
       Act:     bash("npm test")
       Observe: All tests passed ✓  → 无 toolCall，loop 结束`}</Ascii>
    <p>
      五轮循环，每一轮都基于上一轮的观察做新决策。如果第 5 轮还失败，pi 会继续循环、换方案——这就是「自动错误恢复」。
    </p>

    <DeepDive title="为什么用 EventStream 而不是直接 return？">
      <p>
        <code>agentLoop()</code> 返回的是一个 <code>EventStream&lt;AgentEvent, AgentMessage[]&gt;</code>。它在内部 <code>void runAgentLoop(...)</code> 异步跑，把 <code>turn_start / message_start / turn_end / agent_end</code> 等事件
        <code>push</code> 进流，最后 <code>end(messages)</code> 收尾。
      </p>
      <p>
        好处是：调用方（TUI、Web UI、SDK）可以 <code>for await</code> 这个流，<strong>边产生边渲染</strong>，而不必等整轮跑完。同一个引擎，三种前端都能接。
      </p>
    </DeepDive>

    <h2>与简单问答的区别</h2>
    <ul>
      <li><strong>传统聊天机器人</strong>：输入 → 输出 → 结束。只能生成文本，不能执行操作。</li>
      <li><strong>Agent Loop</strong>：输入 → 思考 → 执行工具 → 观察 → 再思考 → … → 返回结果。可以主动探索、实验、迭代。</li>
    </ul>
    <p>
      正是这个循环，让 pi 从「语言模型」进化成「智能体」——面对开放式任务，自己找到路径。下一章我们会看到，在这个底层引擎之上，还有一个业务门面：<strong>AgentSession</strong>。
    </p>
  </>
);
