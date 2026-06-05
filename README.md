# Pi 101

> 受 [airingursb/claude-101](https://github.com/airingursb/claude-101) 启发：一个用 AI 第一人称视角讲解 `pi-mono` 的交互式学习网站，包含真实源码引用和交互式可视化。

[在线演示](https://chasel34.github.io/pi-101/)

## 功能

- 18 章系统讲解 `pi-mono` 的核心架构
- 真实源码引用，链接到 GitHub 上的 `pi-mono` 实现文件
- 交互式可视化，覆盖 agent loop、工具、会话、压缩、扩展、包和 UI 层
- 中文叙事，从 AI 的第一人称视角解释系统如何工作
- 静态导出，无后端服务，也不调用真实 LLM API

## 章节

### 基础

| # | 主题 | 重点 |
|---|---|---|
| 01 | Provider & Model | provider 与 model 元数据如何塑造 AI 运行时 |
| 02 | Stream & Message | assistant 输出如何变成消息事件流 |
| 03 | Context | agent 推理时能看到什么 |

### 工具与执行

| # | 主题 | 重点 |
|---|---|---|
| 04 | Agent Loop | 思考、行动、观察的循环 |
| 05 | Agent vs AgentSession | 底层引擎与面向应用的会话门面 |
| 06 | Built-in Tools | read、write、edit、bash、find、grep、ls |
| 07 | Tool Policies | hook 点与串行/并行执行策略 |
| 08 | Compaction | 长上下文如何被压缩 |

### 记忆与会话

| # | 主题 | 重点 |
|---|---|---|
| 09 | Session Tree | 分支会话与线性日志 |
| 10 | Session Manager | JSONL 持久化与 cwd 绑定服务 |

### 扩展

| # | 主题 | 重点 |
|---|---|---|
| 11 | Resource Loader | user、project、CLI、package 四类资源 |
| 12 | Skills | 可复用的任务专家 |
| 13 | Extensions | 扩展模块如何被组装 |
| 14 | Prompt Templates & Themes | 运行时定制入口 |
| 15 | Pi Packages | 打包与分发 |

### 模式与 UI

| # | 主题 | 重点 |
|---|---|---|
| 16 | Five Modes | interactive、print、JSON、RPC、SDK 五种模式 |
| 17 | pi-tui | 终端渲染、焦点与 overlay |
| 18 | pi-web-ui | 通过 ChatPanel 接入浏览器 UI |

## 交互组件

| 组件 | 说明 |
|---|---|
| `ChapterShell` | 全屏章节场景播放器，支持键盘导航 |
| `TypewriterScene` | 渐进式文本叙事场景 |
| `StepPlayerScene` | 带播放速度控制的步骤动画 |
| `DragAssembleScene` | 用拖拽/组装解释可组合概念 |
| `SliderScene` | 用变量变化解释机制 |
| `ArchitectureMap` | 展示 `pi-mono` 包依赖关系 |
| `SourceLink` | 把章节概念链接回真实源码 |

## 技术栈

- 框架：[Next.js](https://nextjs.org/) 静态导出
- UI：[React](https://react.dev/)
- 样式：[Tailwind CSS](https://tailwindcss.com/) v4
- 动画：[Framer Motion](https://www.framer.com/motion/)
- 源码引用：链接到 `earendil-works/pi-mono` 的 GitHub 源码
- 语言：TypeScript

## 开始使用

```bash
pnpm install
pnpm run dev
```

运行类型检查：

```bash
pnpm run check
```

构建静态站点：

```bash
pnpm run build
```

GitHub Pages 构建时使用：

```bash
NEXT_PUBLIC_BASE_PATH=/pi-101 pnpm run build
```

## 项目结构

```text
src/
├── app/                     # Next.js 路由与元数据
├── components/              # 通用布局、文章与场景组件
├── content/
│   ├── chapters.ts          # 章节元数据
│   ├── articles/            # 章节长文
│   └── scenes/              # 交互章节场景定义
└── lib/                     # 源码链接与站点路径工具
```

## 工作方式

每一章由三层组成：

1. 场景：用于解释核心概念的全屏交互体验
2. 文章：场景之后的长文说明
3. 源码引用：从学习内容跳转到真实 `pi-mono` 实现文件

站点会导出为静态 HTML，并通过 GitHub Actions 部署到 GitHub Pages。

## 参考

- 启发项目：[airingursb/claude-101](https://github.com/airingursb/claude-101)
- 源码项目：[earendil-works/pi-mono](https://github.com/earendil-works/pi-mono)

## License

GPL-3.0
