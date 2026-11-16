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
  LayoutGrid,
  Map,
  MapPin,
  Ruler,
  SlidersHorizontal,
} from "lucide-react";
import {
  formatListingPrice,
  listingLocation,
  listingOperation,
  type Listing,
  type PropertyType,
} from "@/data/listings";
import { ListingsMapLazy } from "@/components/explore/listings-map-lazy";
import { cn } from "@/lib/utils";

type TypeFilter = "todos" | PropertyType;
export type ExploreView = "lista" | "mapa";

type ListingsGridProps = {
  listings: Listing[];
  typeFilter: TypeFilter;
  onTypeFilterChange: (next: TypeFilter) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  favoritesOnly: boolean;
  /** True when Convex/catalog has zero published listings (no seed yet). */
  catalogEmpty?: boolean;
  operationLabel?: "venta" | "alquiler";
  view?: ExploreView;
  onViewChange?: (next: ExploreView) => void;
  onSelectListing: (listing: Listing) => void;
  onResetFilters: () => void;
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
  catalogEmpty = false,
  operationLabel,
  view = "lista",
  onViewChange,
  onSelectListing,
  onResetFilters,
}: ListingsGridProps) {
  const exploreView = view;

  return (
    <section
      id="inmuebles"
      className="scroll-mt-24 bg-background py-6 sm:py-8"
      aria-label="Explorar inmuebles"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                      : "border-border bg-card text-muted-foreground hover:border-neon/35 hover:text-foreground",
                  )}
                >
                  <Icon className="size-3.5" aria-hidden />
                  {item.label}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex rounded-full border border-border p-0.5"
              role="tablist"
              aria-label="Vista"
            >
              <button
                type="button"
                role="tab"
                aria-selected={exploreView === "lista"}
                onClick={() => onViewChange?.("lista")}
                className={cn(
                  "interactive-surface inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                  exploreView === "lista"
                    ? "bg-neon text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="size-3.5" aria-hidden />
                Lista
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={exploreView === "mapa"}
                onClick={() => onViewChange?.("mapa")}
                className={cn(
                  "interactive-surface inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm",
                  exploreView === "mapa"
                    ? "bg-neon text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Map className="size-3.5" aria-hidden />
                Mapa
              </button>
            </div>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {listings.length} inmueble{listings.length === 1 ? "" : "s"}
              {favoritesOnly ? " guardados" : ""}
            </p>
          </div>
        </div>

        {listings.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card px-6 py-12 text-center">
            <Home className="mx-auto size-8 text-neon" aria-hidden />
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              {favoritesOnly
                ? "Tu próximo lugar empieza con un favorito."
                : catalogEmpty
                  ? "Todavía no hay inmuebles publicados."
                  : "No hay inmuebles con estos filtros."}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {favoritesOnly
                ? "Guarda los espacios que te gustan para encontrarlos aquí."
                : catalogEmpty
                  ? "Pronto verás fichas aquí. Si tienes un inmueble, puedes publicarlo."
                  : "Prueba otra ciudad o amplía el presupuesto."}
            </p>
            {catalogEmpty && !favoritesOnly ? (
              <a
                href="/publicar"
                className="interactive-surface mt-6 inline-flex h-10 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground hover:bg-white"
              >
                Publicar inmueble
              </a>
            ) : (
              <button
                type="button"
                onClick={onResetFilters}
                className="interactive-surface mt-6 inline-flex h-10 items-center rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
              >
                Explorar todos
              </button>
            )}
          </div>
        ) : exploreView === "mapa" ? (
          <div className="mt-10 space-y-4">
            <p className="text-sm text-muted-foreground">
              Puntos de las fichas con estos filtros. Usa el pin exacto si el
              vendedor lo marcó al publicar.
            </p>
            <ListingsMapLazy
              listings={listings}
              national={listings.length > 3}
              className="h-[min(72vh,640px)] w-full overflow-hidden rounded-2xl border border-border"
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {listings.map((listing) => {
              const liked = isFavorite(listing.id);
              return (
                <article
                  key={listing.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <button
                      type="button"
                      aria-label={`Ver ${listing.title}`}
                      onClick={() => onSelectListing(listing)}
                      className="absolute inset-0 z-0"
                    >
                      <Image
                        src={listing.image}
                        alt={listing.alt}
                        fill
                        className="object-cover transition duration-500 ease-out hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </button>
                    <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5">
                      <span className="rounded-md bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                        {listingOperation(listing) === "alquiler"
                          ? "Alquiler"
                          : "Venta"}
                      </span>
                      {listing.trustBadge === "musas_reviewed" ? (
                        <span className="rounded-md border border-neon/50 bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-neon backdrop-blur-md">
                          Musas Revisado
                        </span>
                      ) : null}
                      {listing.badge ? (
                        <span className="rounded-md bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                          {listing.badge}
                        </span>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      aria-label={
                        liked ? "Quitar de favoritos" : "Guardar favorito"
                      }
                      aria-pressed={liked}
                      onClick={() => onToggleFavorite(listing.id)}
                      className="interactive-surface absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-ink/45 text-white backdrop-blur-md hover:bg-ink/70"
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
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                      {listing.title}
                    </h3>
                    <p className="text-lg font-medium text-foreground">
                      {formatListingPrice(listing)}
                      <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                        USD
                      </span>
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

                  <div className="flex items-center justify-between border-t border-border px-4 py-3.5 text-sm sm:px-5">
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Check className="size-3.5 text-neon" aria-hidden />
                      {listing.trustBadge === "musas_reviewed"
                        ? "Musas Revisado"
                        : "Ficha publicada"}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectListing(listing)}
                      className="interactive-surface inline-flex items-center gap-1.5 text-neon hover:text-foreground"
                    >
                      Ver inmueble
                      <ArrowUpRight className="size-3.5" aria-hidden />
                    </button>
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
