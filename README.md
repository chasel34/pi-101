# Pi 101 — 交互式理解 pi-mono

本项目受 [airingursb/claude-101](https://github.com/airingursb/claude-101) 启发，沿用“交互式章节 + 真实源码批注 + AI 第一人称视角”的学习方式，改写为面向 `pi-mono` 的中文学习站点。

`pi-101` 用 18 章内容解释 `pi-mono` 的核心包、代理循环、工具策略、会话记忆、扩展机制和 TUI/Web UI。它面向想快速理解 `pi-mono` 架构与源码路径的读者，不依赖真实 LLM 调用，所有交互动画均为本地 mock。

## 跑起来

```bash
npm install
npm run dev          # http://localhost:3000
```

提交前检查：

```bash
npm run check
```

## 构建静态站

```bash
npm run build        # 输出到 out/
```

`out/` 可以直接发到 GitHub Pages、Vercel、Cloudflare Pages。

部署到 GitHub Pages 时设置 `GITHUB_PAGES=true`，站点会使用 `/pi-101` 作为子路径。

线上地址：`https://chasel34.github.io/pi-101/`

## 结构

```
src/
├── app/
│   ├── page.tsx                 # 首页：hero + 章节列表 + 架构图
│   ├── layout.tsx
│   ├── globals.css              # Tailwind v4 主题
│   └── chapters/[slug]/page.tsx # 动态章节路由（generateStaticParams 预渲染）
├── components/
│   ├── ChapterShell.tsx         # scene 翻页容器（方向键 + 进度点 + 点击）
│   ├── Sidebar.tsx              # 18 章 × 5 类目 + 当前激活态
│   ├── TerminalHero.tsx
│   ├── ChapterList.tsx
│   ├── ArchitectureMap.tsx      # 首页底部包依赖瀑布图
│   └── scenes/
│       ├── TypewriterScene.tsx  # 打字稿叙事
│       ├── SliderScene.tsx      # 拖块改变量
│       ├── CardGridScene.tsx    # 卡片网格点开
│       ├── StepPlayerScene.tsx  # 步骤播放器（▶/❚❚/0.5x/1x/2x）
│       ├── DragAssembleScene.tsx# 装 / 卸模块 + 实时累计 token
│       └── SourceLink.tsx       # 批注式源码链接
├── content/
│   ├── chapters.ts              # 章节元数据（slug / 标题 / 副标题 / 类目）
│   └── scenes/                  # 每章一个 scenes 文件
└── lib/source-link.ts           # 真实源码 GitHub blob/main 链接
```

## 章节地图

| # | 类目 | slug |
|---|---|---|
| 01–03 | 基础感知 | provider-model · stream-message · context |
| 04–08 | 心跳与手脚 | agent-loop · agent-vs-session · tools · tool-policies · compaction |
| 09–10 | 记忆与会话 | session-tree · session-manager |
| 11–15 | 扩展宇宙 | resource-loader · skills · extensions · prompts-themes · pi-packages |
| 16–18 | 模式与 UI | five-modes · pi-tui · pi-web-ui |

## 加新章节

1. 在 `src/content/chapters.ts` 添加 `ChapterMeta` 条目（决定 sidebar + 路由）
2. 在 `src/content/scenes/` 新建 `chapter-N-slug.tsx`，导出 `chapterNScenes: Scene[]`
3. 在 `src/content/scenes/index.tsx` 的 `REGISTRY` 注册它

新章默认拿到 `placeholderScenes()` 占位，写到一半也不会破坏链路。

## 源码批注规范

```tsx
<SourceLink refs={[
  { path: "packages/ai/src/types.ts", lines: [528, 558], label: "Model 定义" },
  { path: "packages/coding-agent/src/core/system-prompt.ts" },
]} />
```

行号链到 `https://github.com/earendil-works/pi-mono/blob/main/...#L528-L558`，行号会随 main 漂移 —— 接受。

## 设计决策

- **仅 ZH**（不引 i18n 依赖）
- **静态导出**（`output: "export"`，无服务端依赖）
- **主角称谓「你」**（贯穿 18 章的第一人称）
- **不引真实 LLM 调用**（动画都是 mock，避免 API key 依赖）

## License

GPL-3.0。为保持与启发项目一致，本项目使用与 `airingursb/claude-101` 仓库 `LICENSE` 文件相同的许可证。
