export const SITE_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function sitePath(path: `/${string}`) {
  return `${SITE_BASE_PATH}${path}`;
}
