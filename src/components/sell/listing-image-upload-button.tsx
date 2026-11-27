"use client";

import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { UploadButton, uploadThingFileUrl } from "@/lib/uploadthing";

type ListingImageUploadButtonProps = {
  /** Fotos ya en la ficha — cambia el copy a “agregar más”. */
  currentCount?: number;
  onUploaded: (urls: string[]) => void;
};

export function ListingImageUploadButton({
  currentCount = 0,
  onUploaded,
}: ListingImageUploadButtonProps) {
  const hasPhotos = currentCount > 0;

  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-4 py-5">
      <UploadButton
        endpoint="listingImageUploader"
        content={{
          button({ ready, isUploading }) {
            if (isUploading) return "Subiendo fotos…";
            if (!ready) return "Preparando…";
            return (
              <span className="inline-flex items-center gap-2">
                <ImagePlus className="size-4" aria-hidden />
                {hasPhotos ? "Agregar más fotos" : "Agregar fotos"}
              </span>
            );
          },
          allowedContent({ ready, isUploading }) {
            if (isUploading) return "No cierres esta ventana";
            if (!ready) return null;
            return hasPhotos
              ? `Tienes ${currentCount} foto${currentCount === 1 ? "" : "s"} · máx. 12 · hasta 8 MB c/u`
              : "JPG o PNG · hasta 8 MB · máximo 12 fotos";
          },
        }}
        appearance={{
          container: "flex flex-col items-center gap-2",
          button:
            "ut-ready:bg-neon ut-ready:text-primary-foreground ut-uploading:cursor-not-allowed rounded-full border-0 bg-neon px-5 py-2.5 text-sm font-semibold text-primary-foreground after:bg-neon/80 focus-within:ring-neon",
          allowedContent: "text-xs text-muted-foreground",
        }}
        onClientUploadComplete={(res) => {
          const urls = res
            .map((f) => uploadThingFileUrl(f))
            .filter((u): u is string => Boolean(u));
          onUploaded(urls);
          toast.success(
            urls.length === 1
              ? "Foto agregada"
              : urls.length > 1
                ? `${urls.length} fotos agregadas`
                : "Subida OK pero sin URL — reintenta",
          );
        }}
        onUploadError={(e) => {
          void toast.error(e.message);
        }}
      />
    </div>
  );
}
