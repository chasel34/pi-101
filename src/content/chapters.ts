export type Category = {
  id: "a" | "b" | "c" | "d" | "e";
  title: string;
  color: string;
};

export const CATEGORIES: Record<Category["id"], Category> = {
  a: { id: "a", title: "基础感知", color: "var(--color-pi-cat-blue)" },
  b: { id: "b", title: "心跳与手脚", color: "var(--color-pi-cat-green)" },
  c: { id: "c", title: "记忆与会话", color: "var(--color-pi-cat-purple)" },
  d: { id: "d", title: "扩展宇宙", color: "var(--color-pi-cat-orange)" },
  e: { id: "e", title: "模式与 UI", color: "var(--color-pi-cat-red)" },
};

export type ChapterMeta = {
  number: number;
  slug: string;
  title: string;
  subtitle: string;
  category: Category["id"];
  icon?: string;
};

export const CHAPTERS: ChapterMeta[] = [
  { number: 1, slug: "provider-model", title: "Provider & Model", subtitle: "你能思考是因为有大脑", category: "a", icon: "🧠" },
  { number: 2, slug: "stream-message", title: "Stream & Message", subtitle: "你说话其实是吐 token 事件流", category: "a", icon: "💬" },
  { number: 3, slug: "context", title: "Context", subtitle: "你看到的世界", category: "a", icon: "👁" },

  { number: 4, slug: "agent-loop", title: "Agent Loop", subtitle: "心跳的一轮：思考→行动→观察", category: "b", icon: "🔁" },
  { number: 5, slug: "agent-vs-session", title: "Agent vs AgentSession", subtitle: "低层引擎 vs 业务门面", category: "b", icon: "🪞" },
  { number: 6, slug: "tools", title: "Built-in Tools", subtitle: "7 张工具卡：read / write / edit / bash / find / grep / ls", category: "b", icon: "🛠" },
  { number: 7, slug: "tool-policies", title: "Tool Policies", subtitle: "before/afterToolCall hook、并行 vs 串行", category: "b", icon: "🛂" },
  { number: 8, slug: "compaction", title: "Compaction", subtitle: "脑容量满了怎么办", category: "b", icon: "📦" },

  { number: 9, slug: "session-tree", title: "Session Tree", subtitle: "branching 树图 vs 线性日志", category: "c", icon: "🌳" },
  { number: 10, slug: "session-manager", title: "Session Manager", subtitle: "JSONL 持久化 + cwd-bound services", category: "c", icon: "📚" },

  { number: 11, slug: "resource-loader", title: "Resource Loader", subtitle: "四源雷达：user / project / CLI / package", category: "d", icon: "🛰" },
  { number: 12, slug: "skills", title: "Skills", subtitle: "可复用小专家", category: "d", icon: "✨" },
  { number: 13, slug: "extensions", title: "Extensions", subtitle: "拖拽拼装一个扩展", category: "d", icon: "🧩" },
  { number: 14, slug: "prompts-themes", title: "Prompt Templates & Themes", subtitle: "定制气质", category: "d", icon: "🎨" },
  { number: 15, slug: "pi-packages", title: "Pi Packages", subtitle: "打包成 npm / git", category: "d", icon: "📦" },

  { number: 16, slug: "five-modes", title: "Five Modes", subtitle: "interactive / print / JSON / RPC / SDK", category: "e", icon: "🎛" },
  { number: 17, slug: "pi-tui", title: "pi-tui", subtitle: "差分渲染、focus、overlay", category: "e", icon: "🖥" },
  { number: 18, slug: "pi-web-ui", title: "pi-web-ui", subtitle: "ChatPanel 把 Agent 接到浏览器", category: "e", icon: "🌐" },
];

export function chapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function neighbors(slug: string): { prev?: ChapterMeta; next?: ChapterMeta } {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return {
    prev: i > 0 ? CHAPTERS[i - 1] : undefined,
    next: i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : undefined,
  };
}
