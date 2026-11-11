"use client";

import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  packageName,
  PREFERENTIAL_STATUS_LABELS,
  type PreferentialStatus,
} from "@/lib/preferential-packages";

const STATUSES = Object.keys(
  PREFERENTIAL_STATUS_LABELS,
) as PreferentialStatus[];

function AdminPanel() {
  const me = useQuery(api.users.me);
  const requests = useQuery(
    api.preferential.listAdmin,
    me?.role === "admin" ? {} : "skip",
  );
  const listings = useQuery(
    api.listings.listAllAdmin,
    me?.role === "admin" ? {} : "skip",
  );
  const updateStatus = useMutation(api.preferential.updateStatus);
  const setListingStatus = useMutation(api.listings.setListingStatus);
  const seed = useMutation(api.seed.seedDemoListings);

  if (me === undefined) {
    return <p className="p-10 text-muted-foreground">Cargando…</p>;
  }

  if (!me || me.role !== "admin") {
    return (
      <p className="mx-auto max-w-lg p-10 text-muted-foreground">
        Necesitas rol admin. Configura{" "}
        <code className="text-neon">ADMIN_EMAILS</code> en Convex con tu email
        de Clerk Musas.
      </p>
    );
  }

  const requestCount = requests?.length ?? 0;
  const listingCount = listings?.length ?? 0;
  const publishedCount =
    listings?.filter((l) => l.status === "published").length ?? 0;
  const openPreferential =
    requests?.filter((r) => r.status !== "done" && r.status !== "cancelled")
      .length ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ops Musas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cola Preferencial + moderar fichas en venta. Contacto ops:{" "}
            <span className="text-white/80">
              {process.env.NEXT_PUBLIC_OPS_EMAIL || "definir NEXT_PUBLIC_OPS_EMAIL"}
            </span>
          </p>
          <p className="mt-3 text-xs text-white/55">
            {openPreferential} Preferencial abiertas · {publishedCount}{" "}
            publicadas · {listingCount} fichas totales
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-neon/40 px-4 py-2 text-sm text-neon"
          onClick={() =>
            void seed({})
              .then((r) =>
                toast.success(
                  r.created > 0
                    ? `Seed OK: ${r.created} inmuebles en venta`
                    : "Seed: catálogo ya existía (0 nuevos)",
                ),
              )
              .catch((e) =>
                toast.error(e instanceof Error ? e.message : "Error"),
              )
          }
        >
          Seed catálogo (si home vacío)
        </button>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white">
          Solicitudes Preferencial
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Acción: lee WhatsApp → actualiza estado → coordina/paga fuera de
          Musas.
        </p>
        {requestCount === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-muted-foreground">
            Sin solicitudes. Cuando llegue una, cambia el estado y escribe al
            teléfono del vendedor.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(requests ?? []).map((r) => (
              <li
                key={r._id}
                className="rounded-xl border border-white/10 p-4 text-sm"
              >
                <p className="text-white">
                  {r.userName ?? r.userEmail} ·{" "}
                  {r.packageKeys.map(packageName).join(" · ")}
                </p>
                {r.contactPhone ? (
                  <p className="mt-1 text-neon">WhatsApp: {r.contactPhone}</p>
                ) : (
                  <p className="mt-1 text-amber-200/80">
                    Sin teléfono — revisar notas o email
                  </p>
                )}
                {r.listingTitle ? (
                  <p className="text-muted-foreground">{r.listingTitle}</p>
                ) : null}
                <p className="mt-1 text-muted-foreground">{r.notes}</p>
                <label className="mt-3 block space-y-1">
                  <span className="text-xs text-white/55">Estado</span>
                  <select
                    className="w-full rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-white sm:w-auto"
                    value={r.status}
                    onChange={(e) =>
                      void updateStatus({
                        id: r._id,
                        status: e.target.value as PreferentialStatus,
                      }).then(() => toast.success("Estado actualizado"))
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {PREFERENTIAL_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white">
          Inmuebles (moderación)
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Pausa fichas basura o incorrectas. Solo venta USD en producto.
        </p>
        {listingCount === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-muted-foreground">
            Sin fichas. Usa «Seed catálogo» arriba o espera la primera
            publicación real desde /publicar.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(listings ?? []).map((l) => (
              <li
                key={l._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm"
              >
                <span className="text-white">
                  {l.title} · {l.status}
                </span>
                {l.status === "published" ? (
                  <button
                    type="button"
                    className="text-neon hover:underline"
                    onClick={() =>
                      void setListingStatus({ id: l._id, status: "paused" })
                    }
                  >
                    Pausar
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="admin">
        <DashboardNav />
        <AdminPanel />
      </BackendGate>
    </main>
  );
}
