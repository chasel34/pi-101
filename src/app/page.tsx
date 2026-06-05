import Link from "next/link";
import { TerminalHero } from "@/components/TerminalHero";
import { ChapterList } from "@/components/ChapterList";
import { ArchitectureMap } from "@/components/ArchitectureMap";
import { CHAPTERS } from "@/content/chapters";

export default function HomePage() {
  const firstSlug = CHAPTERS[0].slug;

  return (
    <main className="min-h-screen pb-24">
      <header className="px-6 pt-16 pb-12 text-center">
        <TerminalHero />
        <h1 className="mt-6 font-mono-title text-5xl font-bold tracking-tight">
          Pi 101
        </h1>
        <p className="mt-4 text-pi-muted">
          以 AI 的第一人称视角
          <br />
          交互式理解{" "}
          <em className="font-serif italic text-pi-ink">pi-mono</em>{" "}
          的工作原理
        </p>
        <div className="mt-6 flex justify-center gap-2 text-xs">
          <Pill>18 章深度解读</Pill>
          <Pill>真实源码批注</Pill>
          <Pill>交互式可视化</Pill>
        </div>
        <div className="mt-8">
          <Link
            href={`/chapters/${firstSlug}/`}
            className="inline-flex items-center gap-2 rounded-full bg-pi-primary px-7 py-3 font-medium text-white shadow-sm transition hover:bg-pi-primary-hover"
          >
            开始旅程 <span>→</span>
          </Link>
        </div>
      </header>

      <ChapterList />

      <ArchitectureMap />

      <footer className="mt-24 text-center text-sm text-pi-muted">
        <a
          href="https://github.com/earendil-works/pi-mono"
          className="inline-flex items-center gap-1 hover:text-pi-ink"
        >
          <span>GitHub · pi-mono</span>
        </a>
      </footer>
    </main>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-pi-surface px-3 py-1 text-pi-muted shadow-[inset_0_0_0_1px_var(--color-pi-line)]">
      {children}
    </span>
  );
}
