import { Ascii, Callout, CodeBlock, DeepDive } from "@/components/article";

/* ── Ch.16 Five Modes ──────────────────────────────────────────────── */
export const fiveModesArticle = (
  <>
    <h2>同一个引擎，五种用法</h2>
    <p>
      <code>agentLoop</code> 是无状态引擎，<code>AgentSession</code> 是门面——在它们之上，pi 暴露出五种<strong>运行模式</strong>，对应五种使用场景。从「人盯着终端聊」到「程序之间对接」，覆盖全谱。
    </p>

    <Ascii>{`             人在看                    程序在看
 ┌────────────┬────────────┬────────────┬───────┬───────┐
 │ interactive │   print   │    JSON    │  RPC  │  SDK  │
 │  交互式 TUI │ 单次输出   │ 结构化流   │ 长连接 │ 库调用 │
 └────────────┴────────────┴────────────┴───────┴───────┘`}</Ascii>

    <h2>五种模式</h2>
    <ul>
      <li><strong>interactive</strong>：默认的 TUI 对话，人坐在终端前，实时看思考与工具调用。</li>
      <li><strong>print</strong>：<code>pi -p "问题"</code>，跑完打印结果就退出——适合脚本、CI、一次性任务。</li>
      <li><strong>JSON</strong>：把 AgentEvent 流以 JSON 逐行输出，给别的程序解析。</li>
      <li><strong>RPC</strong>：长连接、双向通信，宿主程序能边发指令边收事件。</li>
      <li><strong>SDK</strong>：直接以库的形式 <code>import</code>，在你自己的 Node 程序里嵌入一个 agent。</li>
    </ul>

    <CodeBlock title="同一引擎，不同出口（AgentSession 真实 API）">{`// 订阅事件，再提交消息：subscribe 返回一个取消订阅函数
const unsubscribe = session.subscribe((ev) => {
  // print 模式：实时打印文字
  if (ev.type === "text_delta") process.stdout.write(ev.delta)
  // JSON 模式：把每个事件原样吐成一行 JSON
  // console.log(JSON.stringify(ev))
})
await session.submitMessage(prompt)
unsubscribe()`}</CodeBlock>

    <Callout>
      <p>
        五种模式共享同一套核心——区别只在「事件流怎么进、怎么出」。这正是前面「引擎 / 门面」分层的回报：一次实现，五处复用。
      </p>
    </Callout>

    <DeepDive title="什么时候用 SDK 而不是 RPC？">
      <p>
        <strong>SDK</strong> 适合同进程嵌入——你完全用 JS/TS，想要最低延迟和最直接的控制。<strong>RPC</strong> 适合跨进程 / 跨语言——宿主是 Python、Go 或一个 GUI 应用，通过协议和 pi 通信。
      </p>
      <p>
        判断标准：你的宿主程序和 pi 是否在同一个 Node 运行时里。是，用 SDK；否，用 RPC。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.17 pi-tui ──────────────────────────────────────────────────── */
export const piTuiArticle = (
  <>
    <h2>终端也是一块画布</h2>
    <p>
      <code>pi-tui</code> 是 pi 的终端渲染引擎。终端不像浏览器有 DOM，它只是一格格字符。要在上面画出流畅的对话、可滚动的历史、弹窗和焦点切换，靠的是三件事：<strong>差分渲染、focus 管理、overlay</strong>。
    </p>

    <h2>差分渲染：只重画变了的部分</h2>
    <p>
      每帧都清屏重画会闪烁、会慢。pi-tui 维护一份「上一帧」的字符缓冲，新一帧算出来后<strong>只 diff 出变化的格子</strong>，仅把这些差异写进终端。流式输出时，这意味着每来一个 token 只更新末尾几格。
    </p>

    <Ascii>{`上一帧缓冲 ─┐
            ├─▶ diff ─▶ 只发生变化的单元格 ─▶ 写入终端
新一帧缓冲 ─┘            （而非整屏重绘）`}</Ascii>

    <h2>focus 与 overlay</h2>
    <ul>
      <li><strong>focus</strong>：决定键盘事件送给谁——输入框、历史列表，还是某个弹窗。Tab / 方向键在可聚焦组件间流转。</li>
      <li><strong>overlay</strong>：在主界面之上盖一层——命令面板、确认框、模型选择器。它临时抢占 focus，关掉后焦点归还。</li>
    </ul>

    <CodeBlock title="差分渲染的核心思路（精简）">{`function render(next: Cell[][]) {
  for (let y = 0; y < next.length; y++)
    for (let x = 0; x < next[y].length; x++)
      if (!eq(prev[y][x], next[y][x])) {
        moveCursor(x, y)
        write(next[y][x])     // 只写变化的格子
      }
  prev = next
}`}</CodeBlock>

    <Callout>
      <p>
        正是差分渲染，让 pi 在终端里也能有「丝滑流式」的体验——边吐 token 边更新，却几乎不闪、不卡。
      </p>
    </Callout>

    <DeepDive title="为什么不直接用现成的 TUI 框架？">
      <p>
        通用框架往往为「表单 / 仪表盘」优化，而 pi 的核心场景是<strong>高频流式追加 + 长历史滚动 + 临时 overlay</strong>。自研渲染层能把差分粒度、滚动复用、焦点模型都按这个场景调到最优。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.18 pi-web-ui ───────────────────────────────────────────────── */
export const piWebUiArticle = (
  <>
    <h2>把 Agent 接到浏览器</h2>
    <p>
      <code>pi-web-ui</code> 把同一个 agent 引擎搬进网页。核心组件是 <strong>ChatPanel</strong>：它订阅 AgentSession 的事件流，把 <code>text / thinking / toolCall / toolResult</code> 渲染成网页里的气泡、折叠块和工具卡片。
    </p>

    <Ascii>{` 浏览器 ChatPanel
     ▲   │ 用户输入
事件 │   ▼
 ┌───┴────────────┐
 │  传输层 (RPC)   │  ← 同 Ch.16 的 RPC 模式
 └───┬────────────┘
     ▼
  AgentSession ─▶ agentLoop（和 CLI 完全相同的引擎）`}</Ascii>

    <h2>和 TUI 共享什么、不同什么</h2>
    <ul>
      <li><strong>共享</strong>：引擎、会话、工具、压缩、权限——一切核心逻辑。</li>
      <li><strong>不同</strong>：只有最外层的渲染（DOM vs 终端字符）和传输（RPC / WebSocket vs 进程内）。</li>
    </ul>

    <CodeBlock title="ChatPanel 消费事件流（精简）">{`function ChatPanel({ session }) {
  const [blocks, setBlocks] = useState([])
  useEffect(() => {
    // subscribe(listener) 返回取消订阅函数，直接作为 cleanup
    return session.subscribe((ev) => {
      if (ev.type === "text_delta") appendText(ev.delta)
      if (ev.type === "tool_call") addToolCard(ev)
      if (ev.type === "tool_result") resolveToolCard(ev)
    })
  }, [session])
  return <MessageList blocks={blocks} />
}`}</CodeBlock>

    <Callout>
      <p>
        到这里 18 章串成了一条线：<strong>Model 给思考，Context 给视野，Agent Loop 给心跳，Tools 给手脚，Session 给记忆，Extensions 给可塑性，五种模式 + TUI / Web UI 给出口。</strong>同一个引擎，撑起了整个 pi。
      </p>
    </Callout>

    <DeepDive title="为什么 Web 和 CLI 能共用引擎？">
      <p>
        因为引擎从一开始就被设计成<strong>「事件进、事件出」的纯逻辑</strong>，不依赖任何具体 UI 或 IO。CLI 把事件画成字符，Web 把事件画成 DOM——但产生事件的那颗心脏，是同一颗。
      </p>
      <p>
        这就是贯穿全书的那条原则：<strong>把机制和表现分开</strong>。理解了它，你就理解了 pi 的全部架构。
      </p>
    </DeepDive>
  </>
);
