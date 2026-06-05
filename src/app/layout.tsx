import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pi 101 — 交互式理解 pi-mono",
  description: "以 AI 的第一人称视角，交互式理解 pi-mono 的工作原理",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
