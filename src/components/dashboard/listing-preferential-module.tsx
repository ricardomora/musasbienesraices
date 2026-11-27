"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  PREFERENTIAL_PACKAGES,
  isPreferentialActive,
  packageName,
  preferentialHref,
  preferentialStatusLabel,
} from "@/lib/preferential-packages";

type RequestRow = {
  _id: string;
  listingId?: string;
  status: string;
  packageKeys: string[];
  createdAt: number;
};

export function activeRequestForListing(
  requests: RequestRow[] | undefined,
  listingId: string,
) {
  return (requests ?? []).find(
    (r) => r.listingId === listingId && isPreferentialActive(r.status),
  );
}

/** Chip / CTA en la card de Mis inmuebles. */
export function ListingPreferentialChip({
  listingId,
  active,
}: {
  listingId: string;
  active?: RequestRow | null;
}) {
  if (active) {
    return (
      <Link
        href={`/dashboard/inmuebles/${listingId}`}
        className="rounded-full border border-neon/40 bg-neon/10 px-3 py-1.5 text-xs text-neon"
        title="Ver Preferencial en editar"
      >
        Pref · {preferentialStatusLabel(active.status)}
      </Link>
    );
  }
  return (
    <Link
      href={preferentialHref(listingId)}
      className="rounded-full border border-neon/40 px-3 py-1.5 text-xs text-neon hover:bg-neon/10"
    >
      Pedir una Musa
    </Link>
  );
}

/** Bloque Preferencial + historial de esta ficha (Editar). */
export function ListingPreferentialModule({
  listingId,
  requests,
  compact = false,
}: {
  listingId: string;
  requests: RequestRow[] | undefined;
  /** Sidebar estrecho: paquetes en columna. */
  compact?: boolean;
}) {
  const forListing = (requests ?? []).filter((r) => r.listingId === listingId);
  const active = forListing.find((r) => isPreferentialActive(r.status));

  return (
    <aside
      id="preferencial"
      className="scroll-mt-8 rounded-2xl border border-neon/25 bg-neon/5 p-5"
      aria-labelledby="preferential-module-title"
    >
      <p className="text-[11px] font-semibold tracking-[0.16em] text-neon uppercase">
        Preferencial
      </p>
      <h2
        id="preferential-module-title"
        className="mt-1 flex items-center gap-2 text-base font-semibold text-foreground sm:text-lg"
      >
        <Sparkles className="size-4 shrink-0 text-neon" aria-hidden />
        Una Musa para este inmueble
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Fotos, legal o acompañamiento. Cotización y pago fuera de la app.
      </p>

      <ul
        className={
          compact
            ? "mt-4 grid gap-2"
            : "mt-4 grid gap-2 sm:grid-cols-3"
        }
      >
        {PREFERENTIAL_PACKAGES.map((pkg) => (
          <li
            key={pkg.key}
            className="rounded-xl border border-border/80 bg-background/40 px-3 py-2.5"
          >
            <p className="text-sm font-medium text-foreground">{pkg.name}</p>
            <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
              {pkg.includes}
            </p>
          </li>
        ))}
      </ul>

      {active ? (
        <p className="mt-4 text-sm text-neon">
          Solicitud {preferentialStatusLabel(active.status).toLowerCase()}
          {" · "}
          {active.packageKeys.map(packageName).join(" · ")}
        </p>
      ) : null}

      <div className="mt-4">
        <Link
          href={preferentialHref(listingId)}
          className="interactive-surface inline-flex h-10 items-center rounded-full bg-neon px-4 text-sm font-semibold text-primary-foreground"
        >
          {active ? "Nueva solicitud" : "Solicitar"}
        </Link>
      </div>

      {forListing.length > 0 ? (
        <ul className="mt-5 space-y-2 border-t border-neon/20 pt-4">
          <li className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Solicitudes de esta ficha
          </li>
          {forListing.map((r) => (
            <li
              key={r._id}
              className="rounded-xl border border-border/70 bg-background/30 px-3 py-2 text-sm"
            >
              <span className="text-neon">
                {preferentialStatusLabel(r.status)}
              </span>
              {" · "}
              {r.packageKeys.map(packageName).join(" · ")}
              <span className="mt-0.5 block text-[11px] text-muted-foreground">
                {new Date(r.createdAt).toLocaleString("es-VE")}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
