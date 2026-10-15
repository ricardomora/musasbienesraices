"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Building2,
  Check,
  Heart,
  Home,
  MapPin,
  Ruler,
  SlidersHorizontal,
} from "lucide-react";
import {
  formatUsd,
  listingLocation,
  type Listing,
  type PropertyType,
} from "@/data/listings";
import { cn } from "@/lib/utils";

type TypeFilter = "todos" | PropertyType;

type ListingsGridProps = {
  listings: Listing[];
  typeFilter: TypeFilter;
  onTypeFilterChange: (next: TypeFilter) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  favoritesOnly: boolean;
};

const FILTERS: {
  id: TypeFilter;
  label: string;
  icon: typeof SlidersHorizontal;
}[] = [
  { id: "todos", label: "Todos", icon: SlidersHorizontal },
  { id: "apartamentos", label: "Apartamentos", icon: Building2 },
  { id: "casas", label: "Casas", icon: Home },
];

export function ListingsGrid({
  listings,
  typeFilter,
  onTypeFilterChange,
  isFavorite,
  onToggleFavorite,
  favoritesOnly,
}: ListingsGridProps) {
  return (
    <section
      id="inmuebles"
      className="scroll-mt-24 bg-background py-16 sm:py-24"
      aria-label="Explorar inmuebles"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-neon uppercase">
              — Espacios con historia. Nuevos comienzos.
            </p>
            <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-semibold tracking-tight text-white">
              Encuentra un lugar que se sienta tuyo.
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              {favoritesOnly
                ? "Tus espacios guardados. Ábrelos cuando quieras volver."
                : "Una selección de espacios extraordinarios para tu próxima etapa."}
            </p>
          </div>
          <a
            href="#inmuebles"
            className="interactive-surface inline-flex items-center gap-1.5 text-sm text-white/75 hover:text-neon"
          >
            Ver todos los inmuebles
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Tipo">
            {FILTERS.map((item) => {
              const active = typeFilter === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onTypeFilterChange(item.id)}
                  className={cn(
                    "interactive-surface inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm",
                    active
                      ? "border-neon bg-neon text-primary-foreground"
                      : "border-white/15 bg-white/[0.03] text-white/80 hover:border-white/30",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted-foreground">
            {listings.length} inmueble{listings.length === 1 ? "" : "s"}
            {favoritesOnly ? " en favoritos" : " disponibles"}
          </p>
        </div>

        {listings.length === 0 ? (
          <p className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-muted-foreground">
            No hay inmuebles con estos filtros. Prueba otra ciudad, tipo o
            presupuesto.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => {
              const liked = isFavorite(listing.id);
              return (
                <article
                  key={listing.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#070b0a]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={listing.image}
                      alt={listing.alt}
                      fill
                      className="object-cover transition duration-500 ease-out hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {listing.badge ? (
                      <span className="absolute left-3 top-3 rounded-md bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                        {listing.badge}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      aria-label={
                        liked ? "Quitar de favoritos" : "Guardar favorito"
                      }
                      aria-pressed={liked}
                      onClick={() => onToggleFavorite(listing.id)}
                      className="interactive-surface absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-ink/45 text-white backdrop-blur-md hover:bg-ink/70"
                    >
                      <Heart
                        className={cn(
                          "size-4",
                          liked ? "fill-neon text-neon" : "text-white",
                        )}
                        aria-hidden
                      />
                    </button>
                  </div>

                  <div className="space-y-3 p-4 sm:p-5">
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin
                        className="size-3.5 shrink-0 text-neon/80"
                        aria-hidden
                      />
                      {listingLocation(listing)}
                    </p>
                    <h3 className="text-xl font-semibold tracking-tight text-white">
                      {listing.title}
                    </h3>
                    <p className="text-lg font-medium text-white">
                      {formatUsd(listing.priceUsd)}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <BedDouble className="size-3.5" aria-hidden />
                        {listing.beds} hab.
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
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 px-4 py-3.5 text-sm sm:px-5">
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Check className="size-3.5 text-neon" aria-hidden />
                      Ficha completa
                    </span>
                    <a
                      href={`#${listing.slug}`}
                      className="interactive-surface inline-flex items-center gap-1.5 text-neon hover:text-white"
                    >
                      Ver inmueble
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
