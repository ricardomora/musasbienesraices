/**
 * Convex HTTP Actions base URL (.convex.site).
 * Derived from NEXT_PUBLIC_CONVEX_URL (.convex.cloud).
 */
export function convexSiteUrl(): string | null {
  const cloud = process.env.NEXT_PUBLIC_CONVEX_URL?.trim().replace(/\/$/, "");
  if (!cloud) return null;
  if (cloud.includes(".convex.site")) return cloud;
  return cloud.replace(".convex.cloud", ".convex.site");
}
