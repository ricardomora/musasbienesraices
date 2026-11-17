"use client";

import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import {
  Bath,
  BedDouble,
  MapPin,
  Pencil,
  Plus,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { cityName, type CityId } from "@/data/cities";
import { formatUsd } from "@/data/listings";
import { PROPERTY_TYPE_LABELS, type PropertyType } from "@/lib/property-types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<string, string> = {
  draft: "Borrador",
  published: "Publicado",
  paused: "Pausado",
};

function MyListings() {
  const listings = useQuery(api.listings.myListings);
  const setStatus = useMutation(api.listings.setListingStatus);

  return (
    <div className="mx-auto w-full max-w-[96rem] px-5 py-10 sm:px-8 lg:px-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mis inmuebles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edita, pausa o publica tus fichas.
            {listings
              ? ` · ${listings.length} ficha${listings.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
        <Link
          href="/publicar"
          className="interactive-surface inline-flex h-10 items-center gap-2 rounded-full bg-neon px-4 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" aria-hidden />
          Nuevo
        </Link>
      </div>

      {listings === undefined ? (
        <p className="mt-10 text-muted-foreground">Cargando…</p>
      ) : listings.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-foreground">Aún no tienes inmuebles.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Publica tu primera ficha con fotos, precio en USD y pin en el mapa.
          </p>
          <Link
            href="/publicar"
            className="interactive-surface mt-6 inline-flex h-11 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground"
          >
            Publicar inmueble
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {listings.map((l) => {
            const cover = l.images[0] ?? "/villa-dusk.png";
            const op = l.operationType ?? "venta";
            const typeLabel =
              PROPERTY_TYPE_LABELS[l.type as PropertyType] ?? l.type;
            const status = STATUS_LABEL[l.status] ?? l.status;
            return (
              <li
                key={l._id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/40">
                  <Image
                    src={cover}
                    alt={l.alt ?? l.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized={cover.startsWith("http")}
                  />
                  <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                    <span className="rounded-md bg-ink/75 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
                      {op === "alquiler" ? "Alquiler" : "Venta"}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-[11px] font-medium backdrop-blur-md",
                        l.status === "published"
                          ? "border border-neon/50 bg-ink/75 text-neon"
                          : l.status === "paused"
                            ? "bg-amber-500/80 text-white"
                            : "bg-ink/70 text-white/80",
                      )}
                    >
                      {status}
                    </span>
                  </div>
                  {l.images.length > 1 ? (
                    <span className="absolute bottom-2 right-2 rounded-md bg-ink/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-md">
                      {l.images.length} fotos
                    </span>
                  ) : null}
                </div>

                <div className="space-y-2.5 p-4">
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin
                      className="size-3.5 shrink-0 text-neon/80"
                      aria-hidden
                    />
                    <span className="truncate">
                      {l.neighborhood
                        ? `${l.neighborhood}, `
                        : ""}
                      {cityName(l.cityId as CityId)}
                    </span>
                  </p>
                  <h2 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                    {l.title}
                  </h2>
                  <p className="text-xs text-muted-foreground">{typeLabel}</p>
                  <p className="text-lg font-medium text-foreground">
                    {formatUsd(l.priceUsd)}
                    <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                      USD{op === "alquiler" ? "/mes" : ""}
                    </span>
                  </p>
                  {(l.beds > 0 || l.baths > 0 || l.areaM2 > 0) && (
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      {l.beds > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <BedDouble className="size-3.5" aria-hidden />
                          {l.beds}
                        </span>
                      ) : null}
                      {l.baths > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <Bath className="size-3.5" aria-hidden />
                          {l.baths}
                        </span>
                      ) : null}
                      {l.areaM2 > 0 ? (
                        <span className="inline-flex items-center gap-1">
                          <Ruler className="size-3.5" aria-hidden />
                          {l.areaM2} m²
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3">
                  {l.status === "published" ? (
                    <Link
                      href={`/inmuebles/${l.slug}`}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent"
                    >
                      Ver ficha
                    </Link>
                  ) : null}
                  <Link
                    href={`/dashboard/inmuebles/${l._id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent"
                  >
                    <Pencil className="size-3" aria-hidden />
                    Editar
                  </Link>
                  {l.status === "published" ? (
                    <button
                      type="button"
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent"
                      onClick={() =>
                        void setStatus({ id: l._id, status: "paused" })
                          .then(() => toast.success("Pausado"))
                          .catch((e) =>
                            toast.error(
                              e instanceof Error ? e.message : "Error",
                            ),
                          )
                      }
                    >
                      Pausar
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="rounded-full border border-neon/40 px-3 py-1.5 text-xs text-neon"
                      onClick={() =>
                        void setStatus({ id: l._id, status: "published" })
                          .then(() => toast.success("Publicado"))
                          .catch((e) =>
                            toast.error(
                              e instanceof Error ? e.message : "Error",
                            ),
                          )
                      }
                    >
                      Publicar
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function DashboardListingsPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="el dashboard de vendedor">
        <DashboardNav />
        <MyListings />
      </BackendGate>
    </main>
  );
}
