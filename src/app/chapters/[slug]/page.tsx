import { notFound } from "next/navigation";
import { ChapterShell } from "@/components/ChapterShell";
import { CHAPTERS, chapterBySlug } from "@/content/chapters";
import { scenesFor } from "@/content/scenes";
import { articleFor } from "@/content/articles";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }));
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chapter = chapterBySlug(slug);
  if (!chapter) notFound();

  return (
    <ChapterShell
      chapter={chapter}
      scenes={scenesFor(chapter)}
      article={articleFor(chapter)}
    />
  );
}
