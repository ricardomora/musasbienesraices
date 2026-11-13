"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
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
  const setTrustBadge = useMutation(api.listings.setTrustBadge);
  const reports = useQuery(
    api.reports.listOpenAdmin,
    me?.role === "admin" ? {} : "skip",
  );
  const setReportStatus = useMutation(api.reports.setStatus);
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
  const pendingReview =
    listings?.filter(
      (l) =>
        l.status === "published" &&
        (l.trustBadge === "none" || l.trustBadge == null),
    ).length ?? 0;
  const reviewedCount =
    listings?.filter((l) => l.trustBadge === "musas_reviewed").length ?? 0;
  const openPreferential =
    requests?.filter((r) => r.status !== "done" && r.status !== "cancelled")
      .length ?? 0;

  const reviewQueue =
    listings
      ?.filter(
        (l) =>
          l.status === "published" &&
          (l.trustBadge === "none" || l.trustBadge == null),
      )
      .sort((a, b) => b.updatedAt - a.updatedAt) ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Ops Musas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Publican primero → revisas → tag{" "}
            <span className="text-neon">Musas Revisado</span>. Preferencial y
            moderación en la misma cola. Contacto ops:{" "}
            <span className="text-foreground">
              {process.env.NEXT_PUBLIC_OPS_EMAIL ||
                "definir NEXT_PUBLIC_OPS_EMAIL"}
            </span>
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {reports?.length ?? 0} reportes · {pendingReview} por revisar ·{" "}
            {reviewedCount} revisados · {openPreferential} Preferencial ·{" "}
            {publishedCount} publicadas · {listingCount} fichas
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
        <h2 className="text-lg font-semibold text-foreground">
          Reportes de fichas
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Paridad anti-fake vs referente: el comprador reporta; tú pausas o
          descartas.
        </p>
        {(reports?.length ?? 0) === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            Sin reportes abiertos.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(reports ?? []).map((r) => (
              <li
                key={r._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200/20 px-4 py-3 text-sm"
              >
                <div>
                  <p className="text-foreground">
                    {r.listingTitle} · {r.reason}
                  </p>
                  {r.details ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {r.details}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {r.listingSlug ? (
                    <Link
                      href={`/inmuebles/${r.listingSlug}`}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground"
                    >
                      Ver
                    </Link>
                  ) : null}
                  {r.listingStatus === "published" ? (
                    <button
                      type="button"
                      className="rounded-full border border-amber-200/40 px-3 py-1.5 text-xs text-amber-200"
                      onClick={() =>
                        void setListingStatus({
                          id: r.listingId,
                          status: "paused",
                        })
                          .then(() =>
                            setReportStatus({
                              id: r._id,
                              status: "reviewed",
                            }),
                          )
                          .then(() => toast.success("Pausado + reporte cerrado"))
                      }
                    >
                      Pausar ficha
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                    onClick={() =>
                      void setReportStatus({
                        id: r._id,
                        status: "dismissed",
                      }).then(() => toast.success("Descartado"))
                    }
                  >
                    Descartar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Cola de verificación
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Soft trust: la ficha ya está a la venta. Revisa fotos, precio y
          descripción; marca Revisado o pausa si es basura.
        </p>
        {reviewQueue.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            Nada pendiente. Las nuevas publicaciones aparecen aquí.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviewQueue.map((l) => (
              <li
                key={l._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm"
              >
                <div>
                  <p className="text-foreground">
                    {l.title} · {l.neighborhood || "sin sector"} · $
                    {l.priceUsd.toLocaleString("en-US")}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {l.type} · {l.cityId} · {l.images.length} foto
                    {l.images.length === 1 ? "" : "s"}
                    {l.contactWhatsapp
                      ? ` · WA ${l.contactWhatsapp}`
                      : " · sin WhatsApp"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/inmuebles/${l.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground hover:bg-accent"
                  >
                    Ver ficha
                  </Link>
                  <button
                    type="button"
                    className="rounded-full bg-neon px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    onClick={() =>
                      void setTrustBadge({
                        id: l._id,
                        trustBadge: "musas_reviewed",
                      })
                        .then(() => toast.success("Musas Revisado"))
                        .catch((e) =>
                          toast.error(
                            e instanceof Error ? e.message : "Error",
                          ),
                        )
                    }
                  >
                    Marcar Revisado
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-amber-200/90"
                    onClick={() =>
                      void setListingStatus({ id: l._id, status: "paused" })
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
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">
          Solicitudes Preferencial
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Acción: lee WhatsApp → actualiza estado → coordina/paga fuera de
          Musas.
        </p>
        {requestCount === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            Sin solicitudes. Cuando llegue una, cambia el estado y escribe al
            teléfono del vendedor.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {(requests ?? []).map((r) => (
              <li
                key={r._id}
                className="rounded-xl border border-border p-4 text-sm"
              >
                <p className="text-foreground">
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
                  <span className="text-xs text-muted-foreground">Estado</span>
                  <select
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground sm:w-auto"
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
        <h2 className="text-lg font-semibold text-foreground">
          Inmuebles (moderación)
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Revoca Revisado o pausa fichas. Solo venta USD en producto.
        </p>
        {listingCount === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
            Sin fichas. Usa «Seed catálogo» arriba o espera la primera
            publicación real desde /publicar.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {(listings ?? []).map((l) => (
              <li
                key={l._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border px-4 py-3 text-sm"
              >
                <span className="text-foreground">
                  {l.title} · {l.status}
                  {l.trustBadge === "musas_reviewed" ? (
                    <span className="ml-2 text-neon">· Revisado</span>
                  ) : null}
                </span>
                <div className="flex flex-wrap gap-3">
                  {l.trustBadge === "musas_reviewed" ? (
                    <button
                      type="button"
                      className="text-muted-foreground hover:underline"
                      onClick={() =>
                        void setTrustBadge({
                          id: l._id,
                          trustBadge: "none",
                        }).then(() => toast.success("Revisado revocado"))
                      }
                    >
                      Quitar Revisado
                    </button>
                  ) : l.status === "published" ? (
                    <button
                      type="button"
                      className="text-neon hover:underline"
                      onClick={() =>
                        void setTrustBadge({
                          id: l._id,
                          trustBadge: "musas_reviewed",
                        }).then(() => toast.success("Musas Revisado"))
                      }
                    >
                      Marcar Revisado
                    </button>
                  ) : null}
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
                </div>
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
