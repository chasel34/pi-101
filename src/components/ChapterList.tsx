import Link from "next/link";
import { CATEGORIES, CHAPTERS, type Category } from "@/content/chapters";

export function ChapterList() {
  const byCat = (id: Category["id"]) => CHAPTERS.filter((c) => c.category === id);

  return (
    <div className="mx-auto max-w-2xl space-y-10 px-6">
      {(Object.values(CATEGORIES) as Category[]).map((cat) => (
        <section key={cat.id}>
          <div className="mb-3 flex items-center gap-2 text-sm text-pi-muted">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: cat.color }}
            />
            <span>{cat.title}</span>
          </div>
          <ul className="space-y-3">
            {byCat(cat.id).map((ch) => (
              <li key={ch.slug}>
                <Link
                  href={`/chapters/${ch.slug}/`}
                  className="group flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition hover:bg-pi-surface"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="w-6 text-right font-mono-title text-xs text-pi-faint">
                      {String(ch.number).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="font-medium text-pi-ink group-hover:text-pi-primary">
                        {ch.title}
                      </div>
                      <div className="text-sm text-pi-muted">{ch.subtitle}</div>
                    </div>
                  </div>
                  <span className="text-xl opacity-60 group-hover:opacity-100">
                    {ch.icon}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
