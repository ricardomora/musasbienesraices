"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { CITIES } from "@/data/cities";

function CuentaPanel() {
  const me = useQuery(api.users.me);
  const updateProfile = useMutation(api.users.updateProfile);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cityId, setCityId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!me) return;
    setName(me.name ?? "");
    setPhone(me.contactPhone ?? "");
    setCityId(me.cityId ?? "");
  }, [me]);

  if (me === undefined) {
    return <p className="p-10 text-muted-foreground">Cargando…</p>;
  }
  if (!me) {
    return (
      <p className="p-10 text-muted-foreground">
        No se pudo cargar tu perfil.
      </p>
    );
  }

  const kindLabel =
    me.accountKind === "realtor"
      ? "Realtor"
      : me.accountKind === "particular"
        ? "Particular"
        : "Sin definir";
  const isRealtor = me.accountKind === "realtor";

  async function save() {
    setBusy(true);
    try {
      await updateProfile({
        name,
        contactPhone: phone,
        cityId,
      });
      toast.success("Perfil actualizado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa o edita tu perfil de {isRealtor ? "agente" : "usuario"} en
          Musas.
        </p>
      </div>

      <section className="rounded-2xl border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground">Perfil</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tipo de cuenta:{" "}
          <span className="text-neon">{kindLabel}</span>
          {isRealtor && me.realtorVerified ? (
            <span className="text-foreground"> · Realtor Verificado</span>
          ) : null}
        </p>

        <div className="mt-5 space-y-4">
          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">
              {isRealtor ? "Nombre / inmobiliaria" : "Nombre"}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isRealtor ? "Ej. María Pérez · Agencia XYZ" : "Tu nombre"}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              autoComplete="name"
            />
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Correo</span>
            <input
              value={me.email}
              readOnly
              className="w-full rounded-xl border border-border bg-muted/40 px-4 py-3 text-muted-foreground"
              autoComplete="email"
            />
            <span className="text-xs text-muted-foreground">
              Correo de inicio de sesión. Para cambiarlo, usa la cuenta de
              acceso (Clerk).
            </span>
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">
              {isRealtor ? "WhatsApp / teléfono de contacto" : "Teléfono / WhatsApp"}
            </span>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+58 412…"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              autoComplete="tel"
            />
            {isRealtor ? (
              <span className="text-xs text-muted-foreground">
                Número que verán interesados en tus fichas (si lo activas al
                publicar).
              </span>
            ) : null}
          </label>

          <label className="block space-y-1.5 text-sm">
            <span className="text-muted-foreground">Ciudad principal</span>
            <select
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
            >
              <option value="">Sin definir</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="button"
          disabled={busy}
          onClick={() => void save()}
          className="interactive-surface mt-6 inline-flex h-11 items-center rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          {busy ? "Guardando…" : "Guardar perfil"}
        </button>
      </section>
    </div>
  );
}

export default function DashboardCuentaPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="cuenta">
        <DashboardNav />
        <CuentaPanel />
      </BackendGate>
    </main>
  );
}
