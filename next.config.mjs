import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  outputFileTracingRoot: here,
  ...(siteBasePath
    ? { basePath: siteBasePath, assetPrefix: `${siteBasePath}/` }
    : {}),
};

export default nextConfig;
