"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { formatUsd } from "@/data/listings";

function MyListings() {
  const listings = useQuery(api.listings.myListings);
  const setStatus = useMutation(api.listings.setListingStatus);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mis inmuebles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Edita, pausa o publica tus fichas.
          </p>
        </div>
        <Link
          href="/publicar"
          className="interactive-surface inline-flex h-10 items-center rounded-full bg-neon px-4 text-sm font-semibold text-primary-foreground"
        >
          Nuevo
        </Link>
      </div>

      <ul className="mt-8 space-y-4">
        {(listings ?? []).map((l) => (
          <li
            key={l._id}
            className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium text-foreground">{l.title}</p>
              <p className="text-sm text-muted-foreground">
                {formatUsd(l.priceUsd)} · {l.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/inmuebles/${l.slug}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent"
              >
                Ver
              </Link>
              <Link
                href={`/dashboard/inmuebles/${l._id}`}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent"
              >
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
        ))}
        {listings?.length === 0 ? (
          <p className="text-muted-foreground">Aún no tienes inmuebles.</p>
        ) : null}
      </ul>
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
