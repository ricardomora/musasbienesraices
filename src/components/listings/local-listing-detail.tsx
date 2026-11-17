"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Check,
  Heart,
  MapPin,
  Ruler,
} from "lucide-react";
import {
  formatUsd,
  LISTINGS,
  listingLocation,
} from "@/data/listings";
import { useFavorites } from "@/hooks/use-favorites";

export function LocalListingDetail({ slug }: { slug: string }) {
  const listing = LISTINGS.find((l) => l.slug === slug);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!listing) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-muted-foreground">Inmueble no encontrado.</p>
        <Link href="/" className="mt-4 inline-block text-neon">
          Volver al inicio
        </Link>
      </main>
    );
  }

  const liked = isFavorite(listing.id);

  return (
    <main className="flex-1 bg-background pb-20">
      <div className="mx-auto max-w-3xl px-5 pt-8 sm:px-8">
        <Link
          href="/#inmuebles"
          className="interactive-surface inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon"
        >
          <ArrowLeft className="size-4" /> Volver
        </Link>

        <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-2xl border border-border">
          <Image
            src={listing.image}
            alt={listing.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 48rem"
            priority
          />
        </div>

        <p className="mt-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5 text-neon/80" />
          {listingLocation(listing)}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {listing.title}
        </h1>
        <p className="mt-4 text-muted-foreground">{listing.description}</p>
        <p className="mt-4 text-2xl font-semibold text-foreground">
          {formatUsd(listing.priceUsd)}{" "}
          <span className="text-sm font-normal text-muted-foreground">USD</span>
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5" /> {listing.beds} habitaciones
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="size-3.5" /> {listing.baths} baños
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Ruler className="size-3.5" /> {listing.areaM2} m² construcción
          </span>
          {listing.lotM2 && listing.lotM2 > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <Ruler className="size-3.5" /> {listing.lotM2} m² terreno
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Condominio mensual</span>
          <strong className="text-foreground">
            {formatUsd(listing.administrationUsd)}
          </strong>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {listing.features.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-foreground"
            >
              <Check className="size-3 text-neon" />
              {f}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => toggleFavorite(listing.id)}
            className="interactive-surface inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-sm text-foreground hover:bg-accent"
          >
            <Heart className={`size-4 ${liked ? "fill-neon text-neon" : ""}`} />
            {liked ? "Guardado" : "Guardar inmueble"}
          </button>
          <button
            type="button"
            disabled
            className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm text-muted-foreground/60"
            title="Disponible con backend Musas"
          >
            Preguntar al vendedor
          </button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Demo local. Con keys Musas (Clerk + Convex) se activa preguntar,
          favoritos sync y publicación real.
        </p>
      </div>
    </main>
  );
}
