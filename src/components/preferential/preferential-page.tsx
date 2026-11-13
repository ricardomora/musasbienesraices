"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { BackendGate } from "@/components/system/backend-gate";
import { AppChrome } from "@/components/system/app-chrome";
import {
  PREFERENTIAL_PACKAGES,
  packageName,
  preferentialStatusLabel,
  type PreferentialPackageKey,
} from "@/lib/preferential-packages";
import { formatUsd } from "@/data/listings";
import { BACKEND_CONFIGURED } from "@/lib/backend";

function PreferentialForm() {
  const { isSignedIn } = useAuth();
  const create = useMutation(api.preferential.create);
  const myListings = useQuery(
    api.listings.myListings,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const myRequests = useQuery(
    api.preferential.myRequests,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const [selected, setSelected] = useState<PreferentialPackageKey[]>([]);
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [listingId, setListingId] = useState<string>("");

  function toggle(key: PreferentialPackageKey) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-neon uppercase">
        Atención Preferencial
      </p>
      <h1 className="mt-3 max-w-2xl text-[clamp(1.8rem,4vw,2.75rem)] font-semibold tracking-tight text-foreground">
        Paquetes claros para vender con respaldo.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Tres paquetes para vender mejor en USD: fotos, legal o acompañamiento.
        Eliges aquí; cotización y pago se cierran fuera de la app.
      </p>

      <aside
        className="mt-6 rounded-xl border border-neon/25 bg-neon/5 px-4 py-3 text-sm leading-relaxed text-foreground"
        role="note"
      >
        <strong className="font-medium text-neon">Cómo funciona:</strong>{" "}
        eliges paquetes → envías solicitud con WhatsApp → Musas te contacta para
        coordinar y pagar fuera de la plataforma. El estado queda visible aquí.
      </aside>

      <p className="mt-10 text-xs tracking-[0.16em] text-muted-foreground uppercase">
        1 · Elige paquetes
      </p>
      <div className="mt-3 grid gap-6 md:grid-cols-3">
        {PREFERENTIAL_PACKAGES.map((pkg) => {
          const on = selected.includes(pkg.key);
          return (
            <button
              key={pkg.key}
              type="button"
              onClick={() => toggle(pkg.key)}
              aria-pressed={on}
              className={`rounded-2xl border p-5 text-left transition ${
                on
                  ? "border-neon bg-neon/10"
                  : "border-border bg-muted/30 hover:border-neon/35"
              }`}
            >
              <h2 className="text-lg font-semibold text-foreground">{pkg.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {pkg.includes}
              </p>
              <p className="mt-4 text-sm text-neon">
                desde {formatUsd(pkg.fromUsd)} · a cotizar
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {on ? "Seleccionado" : "Toca para seleccionar"}
              </p>
            </button>
          );
        })}
      </div>

      {!isSignedIn ? (
        <div className="mt-12 rounded-2xl border border-border bg-muted/30 px-5 py-6">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            2 · Solicitud de contacto
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            <Link href="/sign-in" className="text-neon underline">
              Inicia sesión
            </Link>{" "}
            para enviar tu solicitud con WhatsApp. Sin cobro en la app.
          </p>
        </div>
      ) : (
        <form
          className="mt-12 space-y-4 rounded-2xl border border-border bg-muted/30 px-5 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!phone.trim()) {
              toast.error("Indica un WhatsApp o teléfono para contactarte.");
              return;
            }
            void create({
              packageKeys: selected,
              notes,
              contactPhone: phone.trim(),
              listingId: listingId
                ? (listingId as Id<"listings">)
                : undefined,
            })
              .then(() => {
                toast.success(
                  "Solicitud enviada. Te escribimos por WhatsApp para coordinar.",
                );
                setNotes("");
                setSelected([]);
              })
              .catch((err) =>
                toast.error(err instanceof Error ? err.message : "Error"),
              );
          }}
        >
          <div>
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              2 · Solicitud de contacto
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Cuéntanos cómo contactarte
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Elige al menos un paquete arriba y deja WhatsApp + notas. Ops
              responde fuera de la app.
            </p>
          </div>
          {(myListings?.length ?? 0) > 0 ? (
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Inmueble (opcional)</span>
              <select
                value={listingId}
                onChange={(e) => setListingId(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              >
                <option value="">Sin vincular</option>
                {myListings?.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">WhatsApp / teléfono *</span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="+58 412…"
              autoComplete="tel"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">Notas para cotizar *</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              required
              minLength={10}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="Zona, urgencia y qué paquete te interesa más…"
            />
          </label>
          <button
            type="submit"
            disabled={selected.length === 0}
            className="interactive-surface h-11 rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Enviar solicitud
          </button>
          {selected.length === 0 ? (
            <p className="text-xs text-amber-200/80">
              Selecciona al menos un paquete para habilitar el envío.
            </p>
          ) : null}
          <p className="text-xs text-muted-foreground">
            Al enviar no se cobra nada aquí. Musas te escribe para coordinar y
            pagar fuera de la plataforma.
          </p>
        </form>
      )}

      {(myRequests?.length ?? 0) > 0 ? (
        <section className="mt-14">
          <h2 className="text-lg font-semibold text-foreground">Tus solicitudes</h2>
          <ul className="mt-4 space-y-3">
            {myRequests?.map((r) => (
              <li
                key={r._id}
                className="rounded-xl border border-border px-4 py-3 text-sm"
              >
                <span className="text-neon">
                  {preferentialStatusLabel(r.status)}
                </span>
                {" · "}
                {r.packageKeys.map(packageName).join(" · ")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function PreferentialPage() {
  return (
    <AppChrome>
      <main className="flex-1 bg-background">
        <BackendGate feature="Atención Preferencial">
          <PreferentialForm />
        </BackendGate>
      </main>
    </AppChrome>
  );
}
