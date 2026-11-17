"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { CITIES, type CityId } from "@/data/cities";
import { VE_MAP_CENTER } from "@/data/geo";
import {
  budgetsForOperation,
  type Listing,
  type OperationType,
  type PropertyType,
} from "@/data/listings";
import { ListingsMapLazy } from "@/components/explore/listings-map-lazy";
import { usePublishedListings } from "@/hooks/use-musas-listings";
import { BackendGate } from "@/components/system/backend-gate";
import { AppChrome } from "@/components/system/app-chrome";
import { cn } from "@/lib/utils";

function MapExplore() {
  const [cityId, setCityId] = useState<CityId | "all">("all");
  const [operation, setOperation] = useState<OperationType | "all">("all");
  const [budgetId, setBudgetId] = useState("any");
  const [type, setType] = useState<PropertyType | "all">("all");

  const budgetMaxUsd =
    budgetsForOperation(operation === "alquiler" ? "alquiler" : "venta").find(
      (o) => o.id === budgetId,
    )?.maxUsd ?? null;

  const { listings: published, loading } = usePublishedListings({
    cityId,
    type: type === "all" ? undefined : type,
    operationType: operation === "all" ? undefined : operation,
    budgetMaxUsd: operation === "all" ? null : budgetMaxUsd,
  });

  const asListings: Listing[] = useMemo(
    () =>
      published.map((p) => ({
        id: p.id,
        slug: p.slug,
        type: p.type,
        operationType: p.operationType,
        cityId: p.cityId as CityId,
        neighborhood: p.neighborhood,
        title: p.title,
        badge: p.badge,
        trustBadge: p.trustBadge,
        priceUsd: p.priceUsd,
        beds: p.beds,
        baths: p.baths,
        areaM2: p.areaM2,
        lotM2: p.lotM2,
        image: p.image,
        images: p.images,
        alt: p.alt,
        description: p.description,
        administrationUsd: p.administrationUsd,
        features: p.features,
        lat: p.lat,
        lng: p.lng,
      })),
    [published],
  );

  const citiesWithPins = useMemo(() => {
    const set = new Set(asListings.map((l) => l.cityId));
    return CITIES.filter((c) => set.has(c.id));
  }, [asListings]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/#inmuebles"
            className="interactive-surface inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-neon"
          >
            <ArrowLeft className="size-4" /> Volver a explorar
          </Link>
          <h1 className="mt-4 flex items-center gap-2 text-2xl font-semibold text-foreground">
            <MapPin className="size-5 text-neon" aria-hidden />
            Mapa nacional
          </h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            Venezuela · venta y alquiler en USD. Pins por ciudad/sector
            (aprox.). Centro mapa: {VE_MAP_CENTER.lat.toFixed(1)}N,{" "}
            {Math.abs(VE_MAP_CENTER.lng).toFixed(1)}W.
          </p>
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {loading
            ? "Cargando…"
            : `${asListings.length} en mapa · ${citiesWithPins.length} ciudades`}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value as OperationType | "all");
            setBudgetId("any");
          }}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          <option value="all">Venta + alquiler</option>
          <option value="venta">Solo venta</option>
          <option value="alquiler">Solo alquiler</option>
        </select>
        <select
          value={cityId}
          onChange={(e) => setCityId(e.target.value as CityId | "all")}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          <option value="all">Todo el país</option>
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.state}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as PropertyType | "all")}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground"
        >
          <option value="all">Todos los tipos</option>
          <option value="apartamentos">Apartamentos</option>
          <option value="casas">Casas</option>
          <option value="locales">Locales</option>
          <option value="terrenos">Terrenos</option>
          <option value="galpones">Galpones</option>
          <option value="oficinas">Oficinas</option>
          <option value="quintas">Quintas</option>
        </select>
        {operation !== "all" ? (
          <select
            value={budgetId}
            onChange={(e) => setBudgetId(e.target.value)}
            className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground"
          >
            {budgetsForOperation(operation).map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {!loading && asListings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          No hay fichas publicadas con estos filtros.{" "}
          <Link href="/publicar" className="text-neon hover:underline">
            Publicar
          </Link>
        </div>
      ) : (
        <ListingsMapLazy
          listings={asListings}
          national={cityId === "all"}
        />
      )}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {asListings.slice(0, 12).map((l) => (
          <li key={l.id}>
            <Link
              href={`/inmuebles/${l.slug}`}
              className={cn(
                "block rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm transition hover:border-neon/35",
              )}
            >
              <p className="font-medium text-foreground">{l.title}</p>
              <p className="mt-0.5 text-muted-foreground">
                {l.neighborhood} ·{" "}
                {l.operationType === "alquiler" ? "Alquiler" : "Venta"}
                {l.trustBadge === "musas_reviewed" ? " · Revisado" : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MapaPage() {
  return (
    <AppChrome>
      <main className="flex-1 bg-background">
        <BackendGate feature="mapa">
          <MapExplore />
        </BackendGate>
      </main>
    </AppChrome>
  );
}
