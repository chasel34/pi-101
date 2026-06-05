"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type Annotation = {
  /** 起始行（1-indexed，含） */
  startLine: number;
  /** 结束行（1-indexed，含） */
  endLine: number;
  title: string;
  body: ReactNode;
  /** 高亮色 */
  color: string;
};

export function AnnotatedSource({
  filePath,
  code,
  annotations,
  language = "typescript",
}: {
  filePath: string;
  code: string;
  annotations: Annotation[];
  language?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [autoIndex, setAutoIndex] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(true);
  const codeRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const lines = code.split("\n");

  // 自动播放：依次点亮每条注解
  useEffect(() => {
    if (!autoPlaying) return;
    if (autoIndex >= annotations.length) {
      setAutoPlaying(false);
      return;
    }
    const timer = setTimeout(
      () => {
        setActive(autoIndex);
        setAutoIndex((i) => i + 1);
      },
      autoIndex === 0 ? 700 : 2800,
    );
    return () => clearTimeout(timer);
  }, [autoIndex, autoPlaying, annotations.length]);

  // 切换注解时滚动到对应行
  useEffect(() => {
    if (active === null) return;
    const ann = annotations[active];
    if (!ann) return;
    const lineEl = lineRefs.current.get(ann.startLine);
    const container = codeRef.current;
    if (lineEl && container) {
      const targetTop = lineEl.offsetTop - container.offsetTop;
      const offset = container.clientHeight * 0.2;
      container.scrollTo({ top: Math.max(0, targetTop - offset), behavior: "smooth" });
    }
  }, [active, annotations]);

  const annIndexForLine = (lineNum: number): number | null => {
    for (let i = 0; i < annotations.length; i++) {
      if (lineNum >= annotations[i].startLine && lineNum <= annotations[i].endLine) return i;
    }
    return null;
  };

  const onLineClick = (lineNum: number) => {
    const idx = annIndexForLine(lineNum);
    if (idx !== null) {
      setAutoPlaying(false);
      setActive(idx === active ? null : idx);
    }
  };

  const onAnnClick = (idx: number) => {
    setAutoPlaying(false);
    setActive(idx === active ? null : idx);
  };

  const activeAnn = active !== null ? annotations[active] : null;

  return (
    <div className="ann-source" data-interactive>
      <div className="ann-source__header">
        <div className="ann-source__file">
          <span className="ann-source__file-icon">📄</span>
          <span className="ann-source__file-path">{filePath}</span>
          <span className="ann-source__file-lang">{language}</span>
        </div>
        <div className="ann-source__count">{annotations.length} 个注解</div>
      </div>

      <div className="ann-source__body">
        <div className="ann-source__code" ref={codeRef}>
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const idx = annIndexForLine(lineNum);
            const highlighted = idx !== null && idx === active;
            const annotatable = idx !== null;
            const ann = idx !== null ? annotations[idx] : null;
            const isFirst = ann && lineNum === ann.startLine;
            return (
              <div
                key={lineNum}
                ref={(el) => {
                  if (el) lineRefs.current.set(lineNum, el);
                }}
                className={`ann-source__line${highlighted ? " ann-source__line--active" : ""}${
                  annotatable ? " ann-source__line--annotatable" : ""
                }`}
                style={
                  highlighted && ann
                    ? { borderLeftColor: ann.color, background: `${ann.color}14` }
                    : undefined
                }
                onClick={() => onLineClick(lineNum)}
              >
                <span className="ann-source__line-num">{lineNum}</span>
                <span className="ann-source__line-code">{renderSyntax(line)}</span>
                {isFirst && highlighted && (
                  <span className="ann-source__line-badge" style={{ background: ann!.color }}>
                    {active! + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="ann-source__sidebar">
          <div className="ann-source__sidebar-title">注解（点击跳转）</div>
          <div className="ann-source__sidebar-list">
            {annotations.map((ann, idx) => (
              <button
                key={idx}
                type="button"
                className={`ann-source__sidebar-item${
                  idx === active ? " ann-source__sidebar-item--active" : ""
                }`}
                onClick={() => onAnnClick(idx)}
                style={idx === active ? { borderLeftColor: ann.color } : undefined}
              >
                <span className="ann-source__sidebar-num" style={{ background: ann.color }}>
                  {idx + 1}
                </span>
                <span className="ann-source__sidebar-label">{ann.title}</span>
                <span className="ann-source__sidebar-lines">
                  L{ann.startLine}-{ann.endLine}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeAnn && (
              <motion.div
                key={`ann-${active}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="ann-source__detail" style={{ borderLeftColor: activeAnn.color }}>
                  <div className="ann-source__detail-title">
                    <span className="ann-source__detail-num" style={{ background: activeAnn.color }}>
                      {active! + 1}
                    </span>
                    {activeAnn.title}
                  </div>
                  <div className="ann-source__detail-body">{activeAnn.body}</div>
                  <div className="ann-source__detail-lines">
                    行 {activeAnn.startLine}–{activeAnn.endLine}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "async", "await", "return", "if", "else",
  "for", "while", "import", "export", "from", "type", "interface", "new",
  "yield", "break", "continue", "typeof", "instanceof", "void", "class",
  "extends", "implements", "public", "private", "readonly", "abstract",
]);
const LITERALS = new Set(["true", "false", "null", "undefined", "this"]);

function renderSyntax(line: string): ReactNode {
  if (line.trimStart().startsWith("//")) {
    return <span className="ann-source__syn-comment">{line}</span>;
  }
  const parts = line.split(
    /(\b(?:const|let|var|function|async|await|return|if|else|for|while|import|export|from|type|interface|new|yield|break|continue|typeof|instanceof|void|class|extends|implements|public|private|readonly|abstract|true|false|null|undefined|this)\b|\/\/.*$|'[^']*'|"[^"]*"|`[^`]*`|\b\d+\b)/g,
  );
  return (
    <>
      {parts.map((part, i) => {
        if (KEYWORDS.has(part)) return <span key={i} className="ann-source__syn-keyword">{part}</span>;
        if (LITERALS.has(part)) return <span key={i} className="ann-source__syn-literal">{part}</span>;
        if (/^\/\//.test(part)) return <span key={i} className="ann-source__syn-comment">{part}</span>;
        if (/^['"`]/.test(part)) return <span key={i} className="ann-source__syn-string">{part}</span>;
        if (/^\d+$/.test(part)) return <span key={i} className="ann-source__syn-number">{part}</span>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
