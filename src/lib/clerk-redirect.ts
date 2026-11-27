/** Internal path only — blocks open redirects. */
export function safeRedirectPath(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  if (raw.startsWith("/sign-in") || raw.startsWith("/sign-up")) return null;
  return raw;
}

export function instagramHref(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      if (!/(^|\.)instagram\.com$/i.test(u.hostname)) return null;
      return u.toString();
    } catch {
      return null;
    }
  }
  const handle = trimmed.replace(/^@/, "").replace(/\/+$/, "");
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;
  return `https://instagram.com/${handle}`;
}

export function normalizeInstagram(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const u = new URL(trimmed);
      const parts = u.pathname.split("/").filter(Boolean);
      return parts[0] ? `@${parts[0]}` : trimmed;
    } catch {
      return trimmed;
    }
  }
  return trimmed.startsWith("@") ? trimmed : `@${trimmed.replace(/^@/, "")}`;
}
