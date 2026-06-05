"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import type { ChapterMeta } from "@/content/chapters";
import { neighbors } from "@/content/chapters";
import { sitePath } from "@/lib/site-path";

export type Scene = {
  id: string;
  render: React.ReactNode;
};

export function ChapterShell({
  chapter,
  scenes,
  article,
}: {
  chapter: ChapterMeta;
  scenes: Scene[];
  article?: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const total = scenes.length;
  const { prev, next } = neighbors(chapter.slug);
  const articleRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
    },
    [total],
  );

  const atStart = index === 0;
  const atEnd = index === total - 1;

  // 走到最后一个场景 → 解锁向下滚动（只解锁一次，回看不会重新锁上）
  useEffect(() => {
    if (atEnd) setUnlocked(true);
  }, [atEnd]);

  // 场景未走完时锁住页面滚动，走完后恢复
  useEffect(() => {
    if (article && !unlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [article, unlocked]);

  const scrollToArticle = useCallback(() => {
    articleRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowDown" || e.key === " ") {
        // 解锁后让方向键/空格走原生滚动
        if (!unlocked || !atEnd) {
          e.preventDefault();
          go(1);
        }
      } else if (e.key === "ArrowUp") {
        if (!unlocked) {
          e.preventDefault();
          go(-1);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, unlocked, atEnd]);

  return (
    <div className="flex">
      <div className="sticky top-0 hidden h-screen self-start lg:block">
        <Sidebar activeSlug={chapter.slug} />
      </div>

      <main className="relative min-w-0 flex-1">
        <div className="absolute top-4 right-6 z-10 select-none rounded-md border border-pi-line bg-pi-surface px-2 py-1 font-mono-title text-xs">
          <span className="text-pi-primary">ZH</span>
        </div>

        {/* 场景舞台：占满一屏 */}
        <section className="relative flex h-screen flex-col">
          <div className="flex flex-1 items-center justify-center px-6 py-20">
            <div
              className="relative w-full max-w-3xl"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.closest("button, a, input, [data-interactive]")) return;
                if (atEnd) {
                  if (article) scrollToArticle();
                  return;
                }
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x > rect.width * 0.55) go(1);
                else if (x < rect.width * 0.2) go(-1);
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={scenes[index].id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {scenes[index].render}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            {scenes.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`场景 ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-2 bg-pi-ink" : "w-2 bg-pi-line hover:bg-pi-faint"
                }`}
              />
            ))}
          </div>

          {/* 走完场景：滚动提示；否则显示左右章节导航 */}
          <div className="relative mt-6 mb-8 flex h-12 items-center justify-between px-6 text-sm text-pi-muted">
            <div>
              {prev && atStart && (
                <Link href={sitePath(`/chapters/${prev.slug}/`)} className="hover:text-pi-ink">
                  ← {String(prev.number).padStart(2, "0")} {prev.title}
                </Link>
              )}
            </div>
            <div className="font-mono-title text-xs text-pi-faint">
              {index + 1} / {total}
            </div>
            <div>
              {next && atEnd && !article && (
                <Link href={sitePath(`/chapters/${next.slug}/`)} className="hover:text-pi-ink">
                  {String(next.number).padStart(2, "0")} {next.title} →
                </Link>
              )}
            </div>
          </div>

          {article && atEnd && (
            <button
              type="button"
              onClick={scrollToArticle}
              className="scroll-indicator"
              aria-label="向下滚动，深入了解"
            >
              <span>向下滚动，深入了解</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 4v12M5 11l5 5 5-5" />
              </svg>
            </button>
          )}
        </section>

        {article && (
          <div ref={articleRef}>
            {article}
          </div>
        )}
      </main>
    </div>
  );
}
