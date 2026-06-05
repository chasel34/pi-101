import { Ascii, Callout, CodeBlock, DeepDive } from "@/components/article";

/* ── Ch.9 Session Tree ─────────────────────────────────────────────── */
export const sessionTreeArticle = (
  <>
    <h2>会话不是一条直线，是一棵树</h2>
    <p>
      最朴素的会话是线性日志：一条接一条往下记。但真实使用里你会想「回到刚才那一步，换个方向再试」——这就需要
      <strong>分支（branching）</strong>。pi 把会话建模成一棵树：每条消息是一个节点，<code>parentId</code> 指向上一条；从任意节点都能岔出新分支。
    </p>

    <Ascii>{`            ● root (system)
            │
            ● user: 帮我重构这个模块
            │
            ● assistant + toolCalls
           ╱ ╲
   分支 A ●   ● 分支 B   ← 从同一节点岔开
          │   │
          ●   ●
        「线性日志」只是树上的一条路径`}</Ascii>

    <h2>树图 vs 线性日志</h2>
    <ul>
      <li><strong>线性日志</strong>：当前这条「活跃路径」从根到叶的展开，是你正在对话的视图。</li>
      <li><strong>树</strong>：所有走过的可能性。回退 + 重发 = 在树上新开一个兄弟节点，旧分支并不消失。</li>
    </ul>

    <CodeBlock title="节点的形状（精简）">{`interface SessionNode {
  id: string
  parentId: string | null   // 指向上一条 → 构成树
  message: AgentMessage      // 这一步的内容
  timestamp: number
}
// 活跃路径 = 从某个叶子沿 parentId 一路回溯到 root`}</CodeBlock>

    <Callout>
      <p>
        分支让「探索」变得无损：你可以大胆地让 pi 试一条激进的方案，不满意就回到岔口换路——之前的尝试完整留在树上，随时可对比。
      </p>
    </Callout>

    <DeepDive title="为什么用 parentId 而不是数组？">
      <p>
        用 <code>parentId</code> 指针建模，分支天然免费：新分支只是一个 <code>parentId</code> 指向旧节点的新节点，不需要复制整条历史。重建任意路径只要从叶子回溯到根即可。
      </p>
      <p>
        线性数组要实现分支，得整段复制或维护复杂的版本号；指针树用最小的数据，表达了最大的灵活性。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.10 Session Manager ─────────────────────────────────────────── */
export const sessionManagerArticle = (
  <>
    <h2>会话要落地：JSONL 持久化</h2>
    <p>
      关掉终端，对话不能就此蒸发。<strong>Session Manager</strong> 负责把会话写进磁盘——用
      <strong>JSONL</strong>（每行一个 JSON）格式：每产生一条消息，就<strong>追加一行</strong>。崩溃、断电也只会丢最后一行，已写的内容安然无恙。
    </p>

    <Ascii>{`~/.pi/agent/sessions/--Users-you-projectA--/<id>.jsonl
                       └─ cwd 编码进目录名（绑定项目）
  {"type":"node","id":"n1","parentId":null,"message":{…}}
  {"type":"node","id":"n2","parentId":"n1","message":{…}}
  {"type":"node","id":"n3","parentId":"n2","message":{…}}
  └─ append-only：新事件就是新的一行`}</Ascii>

    <h2>为什么是 JSONL 而不是一个大 JSON？</h2>
    <ul>
      <li><strong>追加便宜</strong>：写一行就行，不必每次重写整个文件。</li>
      <li><strong>抗损坏</strong>：解析时逐行读，坏掉的一行不会带走整份会话。</li>
      <li><strong>可流式</strong>：恢复会话时边读边重建树，无需一次性载入全部。</li>
    </ul>

    <h2>cwd-bound services：会话认得「在哪个项目」</h2>
    <p>
      Session Manager 是<strong>绑定当前工作目录</strong>的：cwd 被编码进 <code>~/.pi/agent/sessions/</code> 下的子目录名。于是在 <code>~/projectA</code> 启动 pi，列出的就是 projectA 的历史会话；切到 <code>~/projectB</code> 又是另一批。会话、CLAUDE.md、技能——都以 cwd 为锚点。
    </p>

    <CodeBlock title="恢复 = 逐行重放">{`function loadSession(path): SessionTree {
  const tree = new SessionTree()
  for (const line of readLines(path)) {
    const entry = JSON.parse(line)        // 每行带 type 判别字段
    if (entry.type === "node")
      tree.addNode(entry.id, entry.parentId, entry.message)
  }
  return tree
}`}</CodeBlock>

    <Callout>
      <p>
        持久化（JSONL）+ 数据结构（树）+ 作用域（cwd）三者合起来，才有了 pi 「关掉再开还能接着聊、还能回到任意岔口」的体验。
      </p>
    </Callout>

    <DeepDive title="多个 pi 同时开同一个项目会冲突吗？">
      <p>
        每个会话有自己独立的 <code>&lt;id&gt;.jsonl</code> 文件，append-only 写入，互不覆盖。cwd-bound 的是「列出哪些会话」，而不是「锁住整个项目」——所以同时开多个会话是安全的。
      </p>
    </DeepDive>
  </>
);
