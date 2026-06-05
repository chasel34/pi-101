import type { Scene } from "@/components/ChapterShell";
import type { ChapterMeta } from "@/content/chapters";

export function placeholderScenes(chapter: ChapterMeta): Scene[] {
  return [
    {
      id: "wip-1",
      render: (
        <div className="space-y-6 text-center">
          <div className="font-mono-title text-xs text-pi-faint">
            第 {String(chapter.number).padStart(2, "0")} 章
          </div>
          <h2 className="text-3xl font-serif">{chapter.title}</h2>
          <p className="text-pi-muted">{chapter.subtitle}</p>
          <div className="pt-8">
            <span className="rounded-full bg-pi-surface px-3 py-1 text-xs text-pi-muted shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
              内容正在创作中
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "wip-2",
      render: (
        <div className="text-center text-pi-muted">
          <p>用方向键 / 点击右半屏继续看下一章。</p>
        </div>
      ),
    },
  ];
}
