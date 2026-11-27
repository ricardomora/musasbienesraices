"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import {
  Bath,
  BedDouble,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Home,
  LayoutGrid,
  Map,
  MapPin,
  Ruler,
  SlidersHorizontal,
} from "lucide-react";
import {
  listingLocation,
  listingOperation,
  type Listing,
  type PropertyType,
} from "@/data/listings";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons/brand-icons";
import { ListingTrustBadge } from "@/components/listings/listing-trust-badge";
import { ListingsMapLazy } from "@/components/explore/listings-map-lazy";
import { instagramHref } from "@/lib/clerk-redirect";
import { cn } from "@/lib/utils";

function whatsappHref(raw: string) {
  const digits = raw.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : null;
}

function formatCardPrice(listing: Listing) {
  const amount = listing.priceUsd.toLocaleString("en-US");
  const suffix =
    listingOperation(listing) === "alquiler" ? "/mes" : "";
  return { amount: `$${amount}`, suffix };
}

type TypeFilter = "todos" | PropertyType;
export type ExploreView = "lista" | "mapa";

function listingGallery(listing: Listing): string[] {
  const fromImages = (listing.images ?? []).filter(Boolean);
  if (fromImages.length > 0) return fromImages;
  return listing.image ? [listing.image] : [];
}

function ListingCardGallery({
  listing,
  onOpen,
}: {
  listing: Listing;
  onOpen: () => void;
}) {
  const photos = listingGallery(listing);
  const [index, setIndex] = useState(0);
  const safeIndex = photos.length > 0 ? index % photos.length : 0;
  const current = photos[safeIndex] ?? listing.image;
  const multi = photos.length > 1;

  function go(delta: number, e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!multi) return;
    setIndex((prev) => (prev + delta + photos.length) % photos.length);
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted/40">
      <button
        type="button"
        aria-label={`Ver ${listing.title}`}
        onClick={onOpen}
        className="absolute inset-0 z-0"
      >
        <Image
          src={current}
          alt={listing.alt}
          fill
          className="object-cover transition duration-500 ease-out hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={current.startsWith("http")}
        />
      </button>

      {multi ? (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={(e) => go(-1, e)}
            className="interactive-surface absolute left-2 top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/50 text-white backdrop-blur-md hover:bg-ink/75"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={(e) => go(1, e)}
            className="interactive-surface absolute right-2 top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink/50 text-white backdrop-blur-md hover:bg-ink/75"
          >
            <ChevronRight className="size-4" aria-hidden />
          </button>
          <div
            className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
            aria-hidden
          >
            {photos.map((src, i) => (
              <span
                key={`${src}-${i}`}
                className={cn(
                  "size-1.5 rounded-full",
                  i === safeIndex ? "bg-white" : "bg-white/45",
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

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
  { id: "locales", label: "Locales", icon: Building2 },
  { id: "terrenos", label: "Terrenos", icon: Home },
  { id: "galpones", label: "Galpones", icon: Building2 },
  { id: "oficinas", label: "Oficinas", icon: Building2 },
  { id: "quintas", label: "Quintas", icon: Home },
  { id: "fondos_comercio", label: "Fondos de Comercio", icon: Building2 },
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
      <div className="mx-auto w-full max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2 lg:flex-1"
            role="tablist"
            aria-label="Tipo"
          >
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
                    "interactive-surface inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm sm:gap-2 sm:px-4",
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
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {listings.map((listing) => {
              const liked = isFavorite(listing.id);
              const isAlquiler = listingOperation(listing) === "alquiler";
              const opLabel = isAlquiler ? "En alquiler" : "En venta";
              const realtorVerified = listing.ownerRealtorVerified === true;
              const contactNumber =
                listing.contactWhatsapp?.trim() ||
                listing.ownerContactPhone?.trim() ||
                "";
              const wa = contactNumber ? whatsappHref(contactNumber) : null;
              const ig = listing.contactInstagram
                ? instagramHref(listing.contactInstagram)
                : null;
              const price = formatCardPrice(listing);

              return (
                <article
                  key={listing.id}
                  role="link"
                  tabIndex={0}
                  aria-label={`${listing.title} — ${opLabel}`}
                  onClick={() => onSelectListing(listing)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectListing(listing);
                    }
                  }}
                  className={cn(
                    "interactive-surface relative cursor-pointer overflow-hidden rounded-2xl bg-card p-3 transition",
                    realtorVerified
                      ? "border border-neon/70 shadow-[0_0_24px_color-mix(in_srgb,var(--neon)_12%,transparent)] hover:border-neon"
                      : "border border-border hover:border-neon/35",
                  )}
                >
                  <div className="relative">
                    <ListingCardGallery
                      listing={listing}
                      onOpen={() => onSelectListing(listing)}
                    />

                    <div className="pointer-events-none absolute left-3 top-3 z-10 flex max-w-[75%] flex-wrap gap-1.5">
                      <ListingTrustBadge trustBadge={listing.trustBadge} />
                      {realtorVerified ? (
                        <span className="inline-flex items-center rounded-full border border-[color:var(--realtor-amber)] bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-[color:var(--realtor-amber)] uppercase backdrop-blur-md">
                          Realtor calificado
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      aria-label={
                        liked ? "Quitar de favoritos" : "Guardar favorito"
                      }
                      aria-pressed={liked}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(listing.id);
                      }}
                      className="interactive-surface absolute right-3 top-3 z-20 inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-ink/45 text-white backdrop-blur-md hover:bg-ink/70"
                    >
                      <Heart
                        className={cn(
                          "size-4",
                          liked ? "fill-neon text-neon" : "text-white",
                        )}
                        aria-hidden
                      />
                    </button>

                    <span className="pointer-events-none absolute bottom-3 right-3 z-10 rounded-full bg-ink/70 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-md">
                      {opLabel}
                    </span>
                  </div>

                  <div className="space-y-2 px-1.5 pt-4 pb-2">
                    <p className="text-[1.55rem] leading-none font-semibold tracking-tight text-foreground">
                      {price.amount}
                      <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                        USD{price.suffix}
                      </span>
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {listing.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin
                        className="size-3.5 shrink-0 text-neon/80"
                        aria-hidden
                      />
                      {listingLocation(listing)}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-sm text-muted-foreground">
                      {listing.beds > 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble className="size-3.5" aria-hidden />
                          {listing.beds} hab.
                        </span>
                      ) : null}
                      {listing.beds > 0 && listing.baths > 0 ? (
                        <span className="text-[8px] text-muted-foreground/60" aria-hidden>
                          ◆
                        </span>
                      ) : null}
                      {listing.baths > 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Bath className="size-3.5" aria-hidden />
                          {listing.baths} baños
                        </span>
                      ) : null}
                      {(listing.beds > 0 || listing.baths > 0) &&
                      listing.areaM2 > 0 ? (
                        <span className="text-[8px] text-muted-foreground/60" aria-hidden>
                          ◆
                        </span>
                      ) : null}
                      {listing.areaM2 > 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Ruler className="size-3.5" aria-hidden />
                          {listing.areaM2} m²
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {realtorVerified ? (
                    <div
                      className="mt-2 flex items-center gap-3 border-t border-border/80 px-1.5 pt-3 pb-1"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <div className="relative shrink-0">
                        {listing.ownerAvatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={listing.ownerAvatarUrl}
                            alt=""
                            className="size-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="inline-flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                            {(listing.ownerName ?? "R").slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card">
                          <Check className="size-2.5 stroke-[3]" aria-hidden />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {listing.ownerName ?? "Agente Musas"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Realtor Calificado
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {wa ? (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp del realtor"
                            className="interactive-surface inline-flex size-9 items-center justify-center rounded-full border border-neon/50 text-neon hover:bg-neon/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <WhatsAppIcon aria-hidden />
                          </a>
                        ) : null}
                        {ig ? (
                          <a
                            href={ig}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram del realtor"
                            className="interactive-surface inline-flex size-9 items-center justify-center rounded-full border border-neon/50 text-neon hover:bg-neon/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <InstagramIcon aria-hidden />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
