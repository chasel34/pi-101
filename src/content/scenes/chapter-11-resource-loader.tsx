import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

function RadarSvg() {
  const sources = [
    { angle: 0, label: "user", path: "~/.pi" },
    { angle: 90, label: "project", path: "<cwd>/.pi" },
    { angle: 180, label: "CLI", path: "--extension flags" },
    { angle: 270, label: "package", path: "pi-* npm packages" },
  ];
  const r = 90;
  const cx = 130;
  const cy = 130;
  return (
    <svg viewBox="0 0 260 260" className="mx-auto h-64 w-64">
      <circle cx={cx} cy={cy} r={r * 0.33} fill="none" stroke="#ececec" />
      <circle cx={cx} cy={cy} r={r * 0.66} fill="none" stroke="#ececec" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ececec" />
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#ececec" />
      <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="#ececec" />
      {sources.map((s) => {
        const rad = (s.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r * 0.85;
        const y = cy + Math.sin(rad) * r * 0.85;
        return (
          <g key={s.label}>
            <circle cx={x} cy={y} r="6" fill="#7c5cff">
              <animate
                attributeName="r"
                values="6;8;6"
                dur="2.5s"
                repeatCount="indefinite"
                begin={`${(s.angle / 360) * 2.5}s`}
              />
            </circle>
            <text
              x={x + 10}
              y={y + 4}
              fontSize="11"
              fill="#1a1a1a"
              fontFamily="ui-monospace, monospace"
            >
              {s.label}
            </text>
            <text
              x={x + 10}
              y={y + 18}
              fontSize="9"
              fill="#a8a8a8"
              fontFamily="ui-monospace, monospace"
            >
              {s.path}
            </text>
          </g>
        );
      })}
      <text
        x={cx}
        y={cy + 4}
        fontSize="11"
        textAnchor="middle"
        fill="#7c5cff"
        fontFamily="ui-monospace, monospace"
      >
        resources
      </text>
    </svg>
  );
}

export const chapter11Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你的「能力」不是写死在代码里的。" },
          { text: "Skills、extensions、prompt templates、themes —— 都是 资源 (resources)。", highlight: "资源 (resources)" },
          { text: "有一个雷达 同时扫四个方向。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "radar",
    render: (
      <div className="space-y-4">
        <div className="text-center font-serif text-xl">
          Resource Loader 的四源 —
        </div>
        <RadarSvg />
        <ul className="mx-auto inline-block text-left text-sm text-pi-muted">
          <li>
            <strong>user</strong> — <code className="font-mono">~/.pi</code> 下你为自己装的（跨项目）
          </li>
          <li>
            <strong>project</strong> — <code className="font-mono">&lt;cwd&gt;/.pi</code> 下随仓库走的
          </li>
          <li>
            <strong>CLI</strong> — 这次启动时 <code className="font-mono">--extension</code> 临时加的
          </li>
          <li>
            <strong>package</strong> — npm 装的 <code className="font-mono">pi-*</code> 包里自带的
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "priority",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl leading-relaxed">
          冲突时怎么办？—— resources 自带 <em>diagnostic</em>。
        </p>
        <div className="rounded-xl bg-pi-surface p-4 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
          <p className="mb-2 text-sm text-pi-muted">
            两个来源都注册了同名 skill（比如「code-review」），<code className="font-mono">DefaultResourceLoader</code> 不会偷偷选一个 ——
            它会发出一条 <code className="font-mono">ResourceCollision</code> 诊断，UI 提示用户决断。
          </p>
          <p className="text-sm text-pi-muted">
            CLI 临时加的、project 级、user 级、package 级 —— 各自有 scope（temporary / permanent）和 origin
            （top-level / package），决定它能不能被「记住」。
          </p>
        </div>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/resource-loader.ts", lines: [153, 220] },
            { path: "packages/coding-agent/src/core/resource-loader.ts", lines: [320, 400] },
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
          { text: "你不是一个固定的实体。" },
          { text: "你是 四个来源的资源在某个 cwd 下的合成。", highlight: "四个来源的资源在某个 cwd 下的合成" },
          { text: "接下来三章 ——你会逐个见到这些资源。" },
        ]}
        speedMs={45}
      />
    ),
  },
];
