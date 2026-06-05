import Link from "next/link";
import type { ReactNode } from "react";
import { neighbors } from "@/content/chapters";

/** 深入了解长文容器：分隔线 + 正文 + 上一章/下一章 */
export function ChapterArticle({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const { prev, next } = neighbors(slug);
  return (
    <article className="chapter-article">
      <hr className="chapter-article__divider" />
      <div className="chapter-article__prose">{children}</div>
      <nav className="chapter-article__nav">
        {prev ? (
          <Link href={`/chapters/${prev.slug}/`}>
            <span className="chapter-article__nav-label">← 上一章</span>
            <span className="chapter-article__nav-title">
              {String(prev.number).padStart(2, "0")} {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/chapters/${next.slug}/`} className="chapter-article__nav--right">
            <span className="chapter-article__nav-label">下一章 →</span>
            <span className="chapter-article__nav-title">
              {String(next.number).padStart(2, "0")} {next.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}

/** 等宽 ASCII 图块 */
export function Ascii({ children }: { children: string }) {
  return <pre className="article-ascii">{children}</pre>;
}

/** 代码块（带可选文件标题） */
export function CodeBlock({ title, children }: { title?: string; children: string }) {
  return (
    <div className="article-code">
      {title && <div className="article-code__title">{title}</div>}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

/** 重点提示块 */
export function Callout({ children }: { children: ReactNode }) {
  return <blockquote className="article-callout">{children}</blockquote>;
}
