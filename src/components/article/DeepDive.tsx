"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function DeepDive({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="deep-dive">
      <button
        type="button"
        className="deep-dive__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <svg
          className={`deep-dive__arrow ${open ? "deep-dive__arrow--open" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 4 10 8 6 12" />
        </svg>
        <span className="deep-dive__label">深入了解</span>
        <span className="deep-dive__title">{title}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            style={{ overflow: "hidden" }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="deep-dive__inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
