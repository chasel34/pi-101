const REPO_BASE = "https://github.com/earendil-works/pi-mono/blob/main";

export type SourceRef = {
  path: string;
  lines?: [number, number] | number;
  label?: string;
};

export function sourceUrl(ref: SourceRef): string {
  const lineSuffix = ref.lines === undefined
    ? ""
    : typeof ref.lines === "number"
      ? `#L${ref.lines}`
      : `#L${ref.lines[0]}-L${ref.lines[1]}`;
  return `${REPO_BASE}/${ref.path}${lineSuffix}`;
}

export function sourceLabel(ref: SourceRef): string {
  if (ref.label) return ref.label;
  const lineSuffix = ref.lines === undefined
    ? ""
    : typeof ref.lines === "number"
      ? `:${ref.lines}`
      : `:${ref.lines[0]}-${ref.lines[1]}`;
  return `${ref.path}${lineSuffix}`;
}
