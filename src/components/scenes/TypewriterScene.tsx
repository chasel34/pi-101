"use client";

import { useEffect, useState } from "react";
import type { SourceRef } from "@/lib/source-link";
import { SourceLink } from "./SourceLink";

export type TypewriterLine = {
  text: string;
  highlight?: string;
  className?: string;
};

export function TypewriterScene({
  lines,
  speedMs = 35,
  sources,
}: {
  lines: TypewriterLine[];
  speedMs?: number;
  sources?: SourceRef[];
}) {
  const [shown, setShown] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShown([]);
    setDone(false);
    let lineIdx = 0;
    let charIdx = 0;
    const current: string[] = [];

    const tick = setInterval(() => {
      if (lineIdx >= lines.length) {
        clearInterval(tick);
        setDone(true);
        return;
      }
      const line = lines[lineIdx];
      charIdx += 1;
      current[lineIdx] = line.text.slice(0, charIdx);
      setShown([...current]);
      if (charIdx >= line.text.length) {
        lineIdx += 1;
        charIdx = 0;
      }
    }, speedMs);

    return () => clearInterval(tick);
  }, [lines, speedMs]);

  return (
    <div className="space-y-5 text-center font-serif text-2xl leading-relaxed">
      {lines.map((line, i) => {
        const text = shown[i] ?? "";
        const isCurrent = !done && shown.length - 1 === i && text.length < line.text.length;
        let body: React.ReactNode = text;
        if (line.highlight && text.includes(line.highlight)) {
          const parts = text.split(line.highlight);
          body = (
            <>
              {parts[0]}
              <span className="text-pi-primary">{line.highlight}</span>
              {parts.slice(1).join(line.highlight)}
            </>
          );
        }
        return (
          <p key={i} className={`${line.className ?? ""} ${isCurrent ? "caret" : ""}`}>
            {body || (i === 0 && !text ? " " : body)}
          </p>
        );
      })}
      {done && sources && <SourceLink refs={sources} />}
    </div>
  );
}
