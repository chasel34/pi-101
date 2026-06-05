import { Ascii, Callout, CodeBlock, DeepDive } from "@/components/article";

/* ── Ch.11 Resource Loader ─────────────────────────────────────────── */
export const resourceLoaderArticle = (
  <>
    <h2>四源雷达：能力从哪来</h2>
    <p>
      pi 的工具、技能、提示词、配置不是写死在代码里的——它们从<strong>四个来源</strong>被扫描、加载、合并。
      <strong>Resource Loader</strong> 就是这台四源雷达。
    </p>

    <Ascii>{`持久优先级：package < user < project（就近覆盖）
 ┌────────┐ ┌─────────┐ ┌────────┐      ┌──────────┐
 │ package │ │  user   │ │ project│  +   │   CLI    │
 │ 内置/npm │ │ ~/.pi   │ │ ./.pi  │      │ 临时注入  │
 └────────┘ └─────────┘ └────────┘      └──────────┘
  同名资源：project 盖 user 盖 package    --extension`}</Ascii>

    <h2>四个来源</h2>
    <ul>
      <li><strong>package</strong>：随包分发的内置资源，或安装的 npm 扩展包。优先级最低。</li>
      <li><strong>user</strong>：<code>~/.pi</code> 下的个人配置，跨项目通用。</li>
      <li><strong>project</strong>：项目根目录 <code>./.pi</code>（含 <code>CLAUDE.md</code>），团队共享、随仓库走。持久来源里优先级最高。</li>
      <li><strong>CLI</strong>：启动时用 <code>--extension</code> 等参数<strong>临时注入</strong>（temporary 作用域），只在本次会话生效，不写进任何配置文件。</li>
    </ul>

    <Callout>
      <p>
        持久来源的合并规则是「就近覆盖」：同名资源，<strong>project &gt; user &gt; package</strong>。于是个人习惯能盖过包默认，项目规范又能盖过个人。CLI 注入则像一张「便利贴」——这次有效，关掉就没。
      </p>
    </Callout>

    <DeepDive title="为什么 project 要随仓库走？">
      <p>
        把 <code>./.pi</code> 和 <code>CLAUDE.md</code> 提交进仓库，团队每个人 clone 下来就自动拥有同一套技能、提示词和约定——pi 的行为因此对全队一致，新人开箱即用。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.12 Skills ──────────────────────────────────────────────────── */
export const skillsArticle = (
  <>
    <h2>技能：可复用的小专家</h2>
    <p>
      有些任务有固定套路（发布流程、代码审查清单、特定框架的写法）。把这些套路写成一份
      <strong>Skill</strong>——本质是一段带元数据的 Markdown 说明书。需要时，pi 把它「请进」Context，瞬间获得一个领域专家。
    </p>

    <CodeBlock title="一个 skill 的形状">{`---
name: release-checklist
description: 发布前的标准检查流程   # 给模型判断「该不该用我」
---

1. 确认 CHANGELOG 已更新
2. 跑全量测试与类型检查
3. 打 tag、写 release notes
...`}</CodeBlock>

    <h2>按需注入，而不是全塞进去</h2>
    <p>
      技能可能有几十上百个，不可能全部塞进 Context（会撑爆窗口）。pi 的做法是：Context 里只放一份<strong>技能索引</strong>（名字 + 一句话描述）；当模型判断某个技能相关，才把它的<strong>完整内容</strong>加载进来。
    </p>

    <Ascii>{`Context 常驻：  技能索引（轻量）
  • release-checklist — 发布前检查
  • code-review      — 审查清单
  • ...
        │ 模型判断「我需要发布」
        ▼
  按需加载 release-checklist 全文 → 注入 Context`}</Ascii>

    <Callout>
      <p>
        这和人类一样：你不会把所有专业手册都背在脑子里，而是「知道有这本书」，需要时再翻开。索引常驻、正文按需——是有限 Context 下的最优解。
      </p>
    </Callout>

    <DeepDive title="Skill 和 Tool 有什么区别？">
      <p>
        <strong>Tool</strong> 是能执行副作用的函数（读写文件、跑命令）；<strong>Skill</strong> 是注入给模型的<strong>知识 / 流程</strong>，本身不执行任何东西。技能告诉 pi「该怎么做」，工具让 pi「真的去做」。
      </p>
      <p>
        一个好的技能，往往就是教模型「在什么时候、按什么顺序、调用哪些工具」。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.13 Extensions ──────────────────────────────────────────────── */
export const extensionsArticle = (
  <>
    <h2>扩展：把零件拼成你自己的 agent</h2>
    <p>
      工具、技能、提示词、hook、主题——这些都是「零件」。<strong>Extension</strong> 是把若干零件打包在一起的单元：装上它，pi 就多出一组能力；卸下它，干干净净。
    </p>

    <CodeBlock title="一个 extension 长什么样（真实 API）">{`import { defineTool, type ExtensionAPI } from "@earendil-works/pi-coding-agent"

// 扩展是一个「拿到 pi 句柄」的函数，在函数体里注册能力
export default function myExtension(pi: ExtensionAPI) {
  pi.registerTool(myTool)                  // 新增工具
  pi.registerCommand("deploy", { ... })    // 新增斜杠命令
  pi.registerMessageRenderer("my", render) // 自定义消息渲染

  pi.on("turn_start", () => { ... })        // 订阅事件
  pi.on("tool_call", (call) => { ... })
  pi.on("tool_result", (res) => { ... })
}`}</CodeBlock>

    <p>
      注意：扩展<strong>不是</strong>一个声明式配置对象，而是一个<strong>命令式注册函数</strong>——pi 把句柄 <code>ExtensionAPI</code> 交给你，你在函数体里 <code>registerTool</code> / <code>registerCommand</code>、用 <code>pi.on(...)</code> 订阅事件。真实示例见仓库里的 <code>examples/extensions/learning-tour.ts</code>。
    </p>

    <h2>装 / 卸都只是「合并 / 移除」</h2>
    <p>
      还记得 Resource Loader 的多源合并吗？扩展正是合并的参与者。装一个扩展，就是把它注册的工具、命令、事件订阅并进当前运行时；卸载则是从中拿掉。<strong>实时累计的 token 预算</strong>也随之增减——工具与技能装得越多，常驻 Context 越大。
    </p>

    <Ascii>{`基础能力  +  extension A  +  extension B
   tools          +myTool        +deploy
   命令           +/review       +/k8s
   事件订阅       +on(turn_start) +on(tool_call)
   ───────────────────────────────────────
   合并后的运行时（token 预算随之累加）`}</Ascii>

    <Callout>
      <p>
        扩展机制让 pi 从「一个固定的 coding agent」变成「一个可塑的 agent 平台」——同一个引擎，换一套扩展，就是另一个专用助手。
      </p>
    </Callout>

    <DeepDive title="扩展会不会互相打架？">
      <p>
        工具名、命令名可能撞车，这时仍按 Resource Loader 的优先级「就近覆盖」。而 <code>pi.on(...)</code> 注册的事件订阅是<strong>叠加</strong>的——多个扩展都监听 <code>tool_call</code> 时，它们都会被依次通知到，互不抢占。
      </p>
      <p>
        所以设计扩展时，给工具和命令起独特的名字（带前缀）、事件回调里只处理自己关心的那部分，就能和其他扩展和平共处。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.14 Prompt Templates & Themes ───────────────────────────────── */
export const promptsThemesArticle = (
  <>
    <h2>定制气质：提示词模板与主题</h2>
    <p>
      同一个引擎，可以有完全不同的「气质」。这由两层决定：<strong>Prompt Templates</strong> 塑造 pi 怎么思考、怎么说话；<strong>Themes</strong> 塑造它在终端里长什么样。
    </p>

    <h2>Prompt Templates：可参数化的系统提示</h2>
    <p>
      系统提示不是一段死字符串，而是带占位符的模板：环境信息、项目规则、人格设定、工具约定被分块拼装。换一套模板，pi 就从「严谨的工程师」变成「话痨的结对伙伴」。
    </p>

    <CodeBlock title="模板按块拼装（精简）">{`const systemPrompt = [
  personaBlock,            // 人格
  environmentBlock(cwd),   // cwd / 平台 / 日期
  projectBlock(claudeMd),  // 项目级 CLAUDE.md
  skillsIndexBlock,        // 技能索引
  toolConventionsBlock,    // 工具使用约定
].join("\\n\\n")`}</CodeBlock>

    <h2>Themes：终端里的视觉语言</h2>
    <p>
      主题决定配色、强调色、工具卡片样式、思考块的呈现方式。它纯属表现层——换主题不改变任何行为，只改变你看它的感受。
    </p>

    <Callout>
      <p>
        提示词管「里子」，主题管「面子」。两者都通过 Resource Loader 的四源加载，于是你能在 <code>~/.pi</code> 放个人偏好的主题，在 <code>./.pi</code> 放团队统一的提示词模板。
      </p>
    </Callout>

    <DeepDive title="改提示词为什么要谨慎？">
      <p>
        系统提示直接决定模型行为的边界——安全约束、工具调用纪律、输出格式都写在里面。随手删掉一段，可能让 pi 变得啰嗦、越权，或不再遵守编辑工具的严格匹配规则。
      </p>
      <p>
        建议：在模板里<strong>追加</strong>你的定制块，而不是改写基础块，以保留原有的安全与纪律。
      </p>
    </DeepDive>
  </>
);

/* ── Ch.15 Pi Packages ─────────────────────────────────────────────── */
export const piPackagesArticle = (
  <>
    <h2>打包分发：npm 与 git</h2>
    <p>
      你攒了一套好用的工具、技能和提示词，想分享给别人或在多个项目复用——这时把它们做成一个
      <strong>Pi Package</strong>。它本质就是一个能被 Resource Loader 识别的扩展包，可以通过 npm 或 git 分发。
    </p>

    <Ascii>{`发布           安装                运行时
 npm publish ─▶ pi add <pkg>     ─▶ Resource Loader
 git push    ─▶ pi add <git-url>     扫描并合并进四源`}</Ascii>

    <h2>一个包里有什么</h2>
    <ul>
      <li><strong>入口</strong>：<code>export default function(pi)</code> 注册贡献的工具 / 命令 / 事件订阅。</li>
      <li><strong>资源目录</strong>：技能 Markdown、提示词模板、主题文件。</li>
      <li><strong>清单</strong>：<code>package.json</code> 里的 <code>pi</code> 字段声明各类资源的入口，便于发现。</li>
    </ul>

    <CodeBlock title="package.json 里的 pi 清单（PiManifest）">{`{
  "name": "@you/pi-ext-deploy",
  "pi": {
    "extensions": ["./dist/index.js"],  // 都是字符串数组
    "skills":     ["./skills"],
    "themes":     ["./themes"]
  },
  "files": ["dist", "skills", "themes"]
}`}</CodeBlock>

    <Callout>
      <p>
        把能力包成包，pi 的生态就「飞轮」起来了：每个人都能发布自己的专长，别人 <code>pi add</code> 一下就拥有同样的能力。这是从「工具」走向「平台」的最后一块拼图。
      </p>
    </Callout>

    <DeepDive title="npm 包 vs git 包，怎么选？">
      <p>
        <strong>npm</strong> 适合稳定发布、带版本号、给广大用户用；<strong>git</strong> 适合私有团队、内部仓库、还在快速迭代的包——直接指向某个分支或 commit 即可，无需走发布流程。
      </p>
      <p>
        两者最终都被 Resource Loader 一视同仁地当作 package 源加载，运行时没有区别。
      </p>
    </DeepDive>
  </>
);
