import type { Scene } from "@/components/ChapterShell";
import type { ChapterMeta } from "@/content/chapters";
import { chapter1Scenes } from "./chapter-1-provider-model";
import { chapter2Scenes } from "./chapter-2-stream-message";
import { chapter3Scenes } from "./chapter-3-context";
import { chapter4Scenes } from "./chapter-4-agent-loop";
import { chapter5Scenes } from "./chapter-5-agent-vs-session";
import { chapter6Scenes } from "./chapter-6-tools";
import { chapter7Scenes } from "./chapter-7-tool-policies";
import { chapter8Scenes } from "./chapter-8-compaction";
import { chapter9Scenes } from "./chapter-9-session-tree";
import { chapter10Scenes } from "./chapter-10-session-manager";
import { chapter11Scenes } from "./chapter-11-resource-loader";
import { chapter12Scenes } from "./chapter-12-skills";
import { chapter13Scenes } from "./chapter-13-extensions";
import { chapter14Scenes } from "./chapter-14-prompts-themes";
import { chapter15Scenes } from "./chapter-15-pi-packages";
import { chapter16Scenes } from "./chapter-16-five-modes";
import { chapter17Scenes } from "./chapter-17-pi-tui";
import { chapter18Scenes } from "./chapter-18-pi-web-ui";
import { placeholderScenes } from "./placeholder";

const REGISTRY: Record<string, Scene[]> = {
  "provider-model": chapter1Scenes,
  "stream-message": chapter2Scenes,
  context: chapter3Scenes,
  "agent-loop": chapter4Scenes,
  "agent-vs-session": chapter5Scenes,
  tools: chapter6Scenes,
  "tool-policies": chapter7Scenes,
  compaction: chapter8Scenes,
  "session-tree": chapter9Scenes,
  "session-manager": chapter10Scenes,
  "resource-loader": chapter11Scenes,
  skills: chapter12Scenes,
  extensions: chapter13Scenes,
  "prompts-themes": chapter14Scenes,
  "pi-packages": chapter15Scenes,
  "five-modes": chapter16Scenes,
  "pi-tui": chapter17Scenes,
  "pi-web-ui": chapter18Scenes,
};

export function scenesFor(chapter: ChapterMeta): Scene[] {
  return REGISTRY[chapter.slug] ?? placeholderScenes(chapter);
}
