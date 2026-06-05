import Link from "next/link";
import { CATEGORIES, CHAPTERS, type Category } from "@/content/chapters";
import { sitePath } from "@/lib/site-path";

export function Sidebar({ activeSlug }: { activeSlug?: string }) {
  const byCat = (id: Category["id"]) => CHAPTERS.filter((c) => c.category === id);

  return (
    <aside className="hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-pi-line bg-pi-bg px-4 py-6 lg:block">
      <Link
        href={sitePath("/")}
        className="block px-2 pb-4 font-mono-title text-base font-bold tracking-tight"
      >
        ▶ Pi 101
      </Link>

      <nav className="space-y-5">
        {(Object.values(CATEGORIES) as Category[]).map((cat) => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 px-2 py-1 text-xs text-pi-muted">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: cat.color }}
              />
              <span>{cat.title}</span>
            </div>
            <ul>
              {byCat(cat.id).map((ch) => {
                const active = ch.slug === activeSlug;
                return (
                  <li key={ch.slug}>
                    <Link
                      href={sitePath(`/chapters/${ch.slug}/`)}
                      className={`flex items-baseline gap-3 rounded-md px-2 py-1.5 text-sm transition ${
                        active
                          ? "bg-pi-primary-soft text-pi-primary"
                          : "text-pi-ink hover:bg-pi-surface"
                      }`}
                    >
                      <span
                        className={`font-mono-title text-xs ${
                          active ? "text-pi-primary" : "text-pi-faint"
                        }`}
                      >
                        {String(ch.number).padStart(2, "0")}
                      </span>
                      <span className="truncate">{ch.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
