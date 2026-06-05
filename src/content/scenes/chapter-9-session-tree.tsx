import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

function TreeSvg() {
  return (
    <svg viewBox="0 0 360 220" className="mx-auto h-56 w-full max-w-md">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#a8a8a8" />
        </marker>
      </defs>
      {[
        ["M40,30 L40,60", null],
        ["M40,60 L40,90", null],
        ["M40,90 L40,120", null],
        ["M40,120 L40,150", null],
        ["M40,90 L150,90 L150,120", "branch-a"],
        ["M150,120 L150,150", null],
        ["M40,120 L260,120 L260,150", "branch-b"],
        ["M260,150 L260,180", null],
      ].map((d, i) => (
        <path key={i} d={d[0] as string} stroke="#cbd5e1" strokeWidth="1.5" fill="none" markerEnd="url(#arr)" />
      ))}
      {[
        { cx: 40, cy: 30, label: "root", main: true },
        { cx: 40, cy: 60, label: "user", main: true },
        { cx: 40, cy: 90, label: "asst+tools", main: true },
        { cx: 40, cy: 120, label: "user", main: true },
        { cx: 40, cy: 150, label: "asst (head)", main: true },
        { cx: 150, cy: 90, label: "compaction", branch: true },
        { cx: 150, cy: 120, label: "asst", branch: true },
        { cx: 150, cy: 150, label: "branch summary", branch: true },
        { cx: 260, cy: 120, label: "rewind 试", branch: true },
        { cx: 260, cy: 150, label: "user (alt)", branch: true },
        { cx: 260, cy: 180, label: "asst (alt)", branch: true },
      ].map((n) => (
        <g key={`${n.cx}-${n.cy}`}>
          <circle
            cx={n.cx}
            cy={n.cy}
            r="6"
            fill={n.main ? "#7c5cff" : "#a8a8a8"}
          />
          <text
            x={n.cx + 12}
            y={n.cy + 4}
            fontSize="10"
            fill="#6b6b6b"
            fontFamily="ui-monospace, monospace"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export const chapter9Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "「会话」不是一根线。" },
          { text: "它是一棵 树。", highlight: "树" },
          { text: "每一次 compaction、每一次 rewind，都是开一根新枝。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "tree",
    render: (
      <div className="space-y-5">
        <div className="text-center font-serif text-xl">
          一棵真实的 session tree 长这样 —
        </div>
        <TreeSvg />
        <p className="text-center text-xs text-pi-muted">
          每个节点都有 <code className="font-mono">id</code> + <code className="font-mono">parentId</code>。
          紫色那条是当前「head」分支。
        </p>
      </div>
    ),
  },
  {
    id: "kinds",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          一个 entry 可以是这几种 type —
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`type SessionEntry =
  | SessionMessageEntry          // user / assistant / tool message
  | ModelChangeEntry             // 切了模型
  | ThinkingLevelChangeEntry     // 切了思考强度
  | CompactionEntry              // 这里开始用摘要替代往前的历史
  | BranchSummaryEntry           // 跨分支汇总
  | LabelEntry                   // 给某个点起个名（人写的）
  | SessionInfoEntry             // sessionDescription、isResolved...
  | CustomMessageEntry           // 扩展自带数据
  | CustomEntry                  // 扩展自定义事件`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          这些 entry 顺序追加进一个 <strong>JSONL 文件</strong>，构成完整 session。
        </p>
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "你不是「在一根线上活的人」。" },
          { text: "你是「一棵树上的当前 head」。", highlight: "当前 head" },
          { text: "下一章：谁在把这棵树写到磁盘上？" },
        ]}
        sources={[
          { path: "packages/coding-agent/src/core/session-manager.ts", lines: [27, 150] },
        ]}
        speedMs={45}
      />
    ),
  },
];
