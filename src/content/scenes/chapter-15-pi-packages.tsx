import type { Scene } from "@/components/ChapterShell";
import { SourceLink, TypewriterScene } from "@/components/scenes";

export const chapter15Scenes: Scene[] = [
  {
    id: "open",
    render: (
      <TypewriterScene
        lines={[
          { text: "你写了 skill、extension、theme、template。" },
          { text: "怎么 给别人用？", highlight: "给别人用" },
          { text: "答案：打包成 Pi Package。" },
        ]}
        speedMs={45}
      />
    ),
  },
  {
    id: "what",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          Pi Package = 一个普通的 npm 包，但 <code className="font-mono">package.json</code> 里多了一节：
        </p>
        <pre className="mx-auto w-fit max-w-full overflow-x-auto rounded-lg bg-pi-surface px-5 py-4 text-left font-mono-title text-xs leading-relaxed shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
{`{
  "name": "my-pi-toolkit",
  "version": "0.3.0",
  "pi": {
    "extensions": ["./dist/extension.js"],
    "skills":     ["./skills"],
    "prompts":    ["./prompts"],
    "themes":     ["./themes/midnight.json"]
  },
  "main": "./dist/extension.js"
}`}
        </pre>
        <p className="text-center text-sm text-pi-muted">
          <code className="font-mono">PackageManager</code> 解析这个字段，把里面的资源喂给 <code className="font-mono">DefaultResourceLoader</code>。
        </p>
      </div>
    ),
  },
  {
    id: "distribute",
    render: (
      <div className="space-y-4">
        <p className="text-center font-serif text-xl">
          分发方式有 三种 —
        </p>
        <div className="space-y-3">
          <Row tag="npm">
            <code className="font-mono">npm i my-pi-toolkit</code> —— 装哪 pi 就在哪用。
          </Row>
          <Row tag="git">
            <code className="font-mono">--extension git+https://...</code> —— 不发 npm，直接拉源码。
          </Row>
          <Row tag="local">
            <code className="font-mono">--extension ./path</code> —— 还在写的时候，本地直接挂上。
          </Row>
        </div>
      </div>
    ),
  },
  {
    id: "examples",
    render: (
      <div className="space-y-5">
        <p className="text-center font-serif text-xl">
          仓库里就有几个现成的例子 —
        </p>
        <ul className="mx-auto inline-block text-left text-sm text-pi-muted">
          <li>
            <code className="font-mono">examples/extensions/with-deps/</code> — 带 npm 依赖的最小示例
          </li>
          <li>
            <code className="font-mono">examples/extensions/custom-provider-anthropic/</code> — 注册自定义 provider
          </li>
          <li>
            <code className="font-mono">examples/extensions/custom-provider-gitlab-duo/</code> — 接公司私有大模型网关
          </li>
          <li>
            <code className="font-mono">examples/extensions/sandbox/</code> — 用 sandbox-runtime 封一个隔离 bash
          </li>
        </ul>
        <SourceLink
          refs={[
            { path: "packages/coding-agent/src/core/package-manager.ts" },
            { path: "packages/coding-agent/examples/extensions" },
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
          { text: "你写一次。" },
          { text: "全世界都能 npm i 你。", highlight: "npm i 你" },
          { text: "下一章：你以为只有 CLI？pi 一共有 五种运行模式。", highlight: "五种运行模式" },
        ]}
        speedMs={45}
      />
    ),
  },
];

function Row({ tag, children }: { tag: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-3 rounded-xl bg-pi-surface p-3 shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      <span className="rounded-full bg-pi-primary-soft px-2 py-0.5 font-mono-title text-xs text-pi-primary">
        {tag}
      </span>
      <span className="text-sm text-pi-muted">{children}</span>
    </div>
  );
}
