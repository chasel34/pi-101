import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter12Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "有些事 —— 你不需要时刻记着，但偶尔需要 知道怎么做。", highlight: "知道怎么做" },
          { text: "这些就是 Skills。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "shape",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          一个 skill 就是一个目录，根上有一个 <code className="font-mono">SKILL.md</code>：
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`my-skill/
├── SKILL.md          # frontmatter: name, description, when_to_use
├── prompts.md        # 详细步骤
├── examples/
│   ├── before.ts
│   └── after.ts
└── scripts/
    └── helper.py`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          只在系统提示词里露出 <strong>名字 + description</strong>。需要的时候 AI 自己 <code className="font-mono">Read</code> 它的 SKILL.md。
        </p>
      </div>
    ),
  },
  {
    id: "why",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          为什么不直接把全部内容拼进 system prompt？
        </p>
        <div className="space-y-3">
          <Card title="省 token">
            10 个 skill × 一句话 = 几百 token。10 个 skill × 整篇 = 几万 token。前者放一辈子都没事。
          </Card>
          <Card title="按需展开">
            真正需要这个 skill 时再读，能拿到最新最完整的内容；不需要时不打扰大脑。
          </Card>
          <Card title="作者写起来自然">
            一个 Markdown 文件 + 一些示例。不用学新框架，不用打包。
          </Card>
        </div>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/skills.ts", lines: [68, 130] },
            { path: "packages/coding-agent/src/core/skills.ts", lines: [336, 370], label: "skills.ts:336-370 formatSkillsForPrompt" },
          ]}
        />
      </div>
    ),
  },
  {
    id: "closing",
    render: (
      <TypewriterScene
        lines={[
          { text: "Skill 不是把知识灌进你脑子。" },
          { text: "是 在桌面上给你贴一张便利贴 —— 上面只写「需要时去翻第 X 本书」。", highlight: "贴一张便利贴" },
          { text: "下一章：如果想给你装一整套新能力呢？" },
        ]}
        speedMs={45}
      />
    ),
  },
];

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      <div className="mb-1 font-mono-title text-sm text-pi-primary">{title}</div>
      <p className="text-sm text-pi-muted">{children}</p>
    </div>
  );
}
