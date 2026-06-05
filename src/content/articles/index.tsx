import type { ReactNode } from "react";
import { ChapterArticle } from "@/components/article";
import type { ChapterMeta } from "@/content/chapters";
import { providerModelArticle, streamMessageArticle, contextArticle } from "./basics";
import { agentLoopArticle } from "./chapter-4-agent-loop";
import {
  agentVsSessionArticle,
  toolsArticle,
  toolPoliciesArticle,
  compactionArticle,
} from "./heartbeat";
import { sessionTreeArticle, sessionManagerArticle } from "./memory";
import {
  resourceLoaderArticle,
  skillsArticle,
  extensionsArticle,
  promptsThemesArticle,
  piPackagesArticle,
} from "./extensions";
import { fiveModesArticle, piTuiArticle, piWebUiArticle } from "./modes-ui";

const REGISTRY: Record<string, ReactNode> = {
  "provider-model": providerModelArticle,
  "stream-message": streamMessageArticle,
  context: contextArticle,
  "agent-loop": agentLoopArticle,
  "agent-vs-session": agentVsSessionArticle,
  tools: toolsArticle,
  "tool-policies": toolPoliciesArticle,
  compaction: compactionArticle,
  "session-tree": sessionTreeArticle,
  "session-manager": sessionManagerArticle,
  "resource-loader": resourceLoaderArticle,
  skills: skillsArticle,
  extensions: extensionsArticle,
  "prompts-themes": promptsThemesArticle,
  "pi-packages": piPackagesArticle,
  "five-modes": fiveModesArticle,
  "pi-tui": piTuiArticle,
  "pi-web-ui": piWebUiArticle,
};

/** 返回某章的「深入了解」长文，没有则返回 undefined（章节只展示场景）。 */
export function articleFor(chapter: ChapterMeta): ReactNode | undefined {
  const body = REGISTRY[chapter.slug];
  if (!body) return undefined;
  return <ChapterArticle slug={chapter.slug}>{body}</ChapterArticle>;
}
