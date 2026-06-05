import { sourceLabel, sourceUrl, type SourceRef } from "@/lib/source-link";

export function SourceLink({ refs }: { refs: SourceRef[] }) {
  if (!refs?.length) return null;
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-pi-muted">
      <span>源码</span>
      {refs.map((ref) => (
        <a
          key={`${ref.path}-${String(ref.lines ?? "")}`}
          href={sourceUrl(ref)}
          target="_blank"
          rel="noreferrer"
          className="font-mono-title underline decoration-pi-line underline-offset-2 transition hover:text-pi-primary hover:decoration-pi-primary"
        >
          {sourceLabel(ref)}
        </a>
      ))}
    </div>
  );
}
