"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Ruler,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatUsd,
  listingLocation,
  type Listing,
} from "@/data/listings";

type PropertyDetailDialogProps = {
  listing: Listing | null;
  open: boolean;
  liked: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleFavorite: () => void;
  onRequestVisit: () => void;
};

export function PropertyDetailDialog({
  listing,
  open,
  liked,
  onOpenChange,
  onToggleFavorite,
  onRequestVisit,
}: PropertyDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 p-0 sm:max-w-2xl">
        {listing ? (
          <>
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
              <Image
                src={listing.image}
                alt={listing.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 42rem"
              />
              {listing.badge ? (
                <span className="absolute left-4 top-4 rounded-md bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                  {listing.badge}
                </span>
              ) : null}
            </div>

            <div className="space-y-4 px-5 pb-5 sm:px-6 sm:pb-6">
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 text-neon/80" aria-hidden />
                {listingLocation(listing)}
              </p>

              <DialogTitle>{listing.title}</DialogTitle>
              <DialogDescription>{listing.description}</DialogDescription>

              <p className="text-2xl font-semibold tracking-tight text-white">
                {formatUsd(listing.priceUsd)}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  USD
                </span>
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BedDouble className="size-3.5" aria-hidden />
                  {listing.beds} habitaciones
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bath className="size-3.5" aria-hidden />
                  {listing.baths} baños
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Ruler className="size-3.5" aria-hidden />
                  {listing.areaM2} m²
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  Administración mensual
                </span>
                <strong className="font-medium text-white">
                  {formatUsd(listing.administrationUsd)}
                </strong>
              </div>

              <div className="flex flex-wrap gap-2">
                {listing.features.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/85"
                  >
                    <Check className="size-3 text-neon" aria-hidden />
                    {feature}
                  </span>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-white/45">
                Inmueble de ejemplo con imágenes ilustrativas. Los precios y
                características son ficticios; no es una oferta comercial.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={onRequestVisit}
                  className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground hover:bg-white"
                >
                  Consultar visita
                  <ArrowUpRight className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-white hover:border-white/40 hover:bg-white/5"
                >
                  <Heart
                    className={`size-4 ${liked ? "fill-neon text-neon" : ""}`}
                    aria-hidden
                  />
                  {liked ? "Guardado" : "Guardar inmueble"}
                </button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
