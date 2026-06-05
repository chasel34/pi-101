export function TerminalHero() {
  return (
    <div className="mx-auto w-fit">
      <div className="rounded-t-md bg-[#1a1a1f] px-3 py-2 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mt-2 font-mono-title text-sm text-[#9ca3af]">
          <span className="text-[#28c840]">$</span> pi
        </div>
      </div>
    </div>
  );
}
