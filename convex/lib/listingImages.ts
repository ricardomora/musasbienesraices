/** Allowed listing image hosts (UploadThing + local public paths). */
const ALLOWED_HOST_SUFFIXES = [
  "utfs.io",
  "ufs.sh",
  "uploadthing.com",
] as const;

export function isAllowedListingImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("/")) {
    // Local public assets (demo / placeholders)
    return !trimmed.includes("://") && !trimmed.startsWith("//");
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`),
    );
  } catch {
    return false;
  }
}

export function assertListingImages(images: string[]) {
  for (const url of images) {
    if (!isAllowedListingImageUrl(url)) {
      throw new Error(
        "URL de imagen no permitida. Sube fotos con el cargador de Musas.",
      );
    }
  }
}
