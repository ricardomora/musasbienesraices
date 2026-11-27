"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { CITIES } from "@/data/cities";
import {
  REALTOR_PLAN_BENEFITS,
  realtorBillingLabel,
  realtorPaymentStartedLabel,
  realtorPeriodEndsLabel,
  realtorPlanName,
} from "@/lib/realtor-plans";
import { BACKEND_CONFIGURED } from "@/lib/backend";

function CuentaPanel() {
  const me = useQuery(api.users.me);
  const plan = useQuery(
    api.realtors.myPlanSummary,
    BACKEND_CONFIGURED ? {} : "skip",
  );
  const updateProfile = useMutation(api.users.updateProfile);
  const ensurePeriod = useMutation(api.realtors.ensurePeriodEndsAt);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [cityId, setCityId] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!me) return;
    setName(me.name ?? "");
    setPhone(me.contactPhone ?? "");
    setInstagram(me.contactInstagram ?? "");
    setCityId(me.cityId ?? "");
  }, [me]);

  useEffect(() => {
    if (!plan?.needsPeriodBackfill) return;
    void ensurePeriod().catch(() => {
      /* silent: display already estimates periodEndsAt */
    });
  }, [plan?.needsPeriodBackfill, ensurePeriod]);

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
  const activePlan = plan?.activePlan;
  const openRequest = plan?.openRequest;
  const expiredPlan = plan?.expiredPlan;
  const canCreate = plan?.canCreateRequest === true;

  async function save() {
    setBusy(true);
    try {
      await updateProfile({
        name,
        contactPhone: phone,
        contactInstagram: instagram,
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
    <div className="mx-auto max-w-5xl space-y-8 px-5 py-10 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa o edita tu perfil de {isRealtor ? "agente" : "usuario"} en
          Musas.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <section className="min-w-0 flex-1 rounded-2xl border border-border p-5 lg:basis-[70%]">
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
            <span className="text-muted-foreground">Instagram</span>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@tuagencia"
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              autoComplete="username"
            />
            <span className="text-xs text-muted-foreground">
              Se muestra en tus fichas si no defines uno distinto al publicar.
            </span>
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

      <section
        id="plan-agente"
        className="scroll-mt-24 w-full shrink-0 rounded-2xl border border-border p-5 lg:sticky lg:top-6 lg:w-[30%] lg:max-w-sm"
      >
        <h2 className="text-lg font-semibold text-foreground">Plan Agente</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {REALTOR_PLAN_BENEFITS.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neon" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {plan === undefined ? (
          <p className="mt-4 text-sm text-muted-foreground">Cargando plan…</p>
        ) : activePlan ? (
          <div className="mt-4 space-y-2 rounded-xl border border-neon/35 bg-neon/5 px-4 py-3 text-sm">
            <p className="font-medium text-neon">Plan activo</p>
            <p className="text-foreground">
              {realtorPlanName(activePlan.planKey)}
            </p>
            <p className="text-muted-foreground">
              {realtorBillingLabel(activePlan.billingPeriod)}
            </p>
            {realtorPaymentStartedLabel(activePlan.paymentApprovedAt) ? (
              <p className="text-muted-foreground">
                Activado el{" "}
                {realtorPaymentStartedLabel(activePlan.paymentApprovedAt)}
              </p>
            ) : null}
            {realtorPeriodEndsLabel(activePlan.periodEndsAt) ? (
              <p className="text-foreground">
                Vence el {realtorPeriodEndsLabel(activePlan.periodEndsAt)}
              </p>
            ) : null}
          </div>
        ) : openRequest ? (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">Solicitud en revisión</p>
            <p className="mt-1 text-muted-foreground">
              {realtorPlanName(openRequest.planKey)} ·{" "}
              {realtorBillingLabel(openRequest.billingPeriod)}
            </p>
            {openRequest.paymentReference ? (
              <p className="mt-1 text-muted-foreground">
                Ref. pago: {openRequest.paymentReference}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              Musas confirmará tu pago y activará el plan.
            </p>
          </div>
        ) : expiredPlan ? (
          <div className="mt-4 rounded-xl border border-amber-500/35 bg-amber-500/5 px-4 py-3 text-sm">
            <p className="font-medium text-foreground">Plan vencido</p>
            <p className="mt-1 text-muted-foreground">
              {realtorPlanName(expiredPlan.planKey)} · venció el{" "}
              {realtorPeriodEndsLabel(expiredPlan.periodEndsAt)}
            </p>
            {canCreate ? (
              <Link
                href="/suscripciones"
                className="interactive-surface mt-3 inline-flex h-10 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground"
              >
                Renovar plan
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            <p>Aún no tienes un plan activo.</p>
            {canCreate ? (
              <Link
                href="/suscripciones"
                className="interactive-surface mt-3 inline-flex h-10 items-center rounded-full border border-neon/45 px-5 text-sm font-medium text-neon hover:bg-neon/10"
              >
                Activar Plan Agente
              </Link>
            ) : null}
          </div>
        )}
      </section>
      </div>
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
