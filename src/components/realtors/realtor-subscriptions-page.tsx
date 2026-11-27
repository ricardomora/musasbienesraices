"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { AppChrome } from "@/components/system/app-chrome";
import { BackendGate } from "@/components/system/backend-gate";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import {
  REALTOR_ANNUAL_DISCOUNT,
  REALTOR_ANNUAL_PRICE,
  REALTOR_MONTHLY_PRICE,
  REALTOR_PAGO_MOVIL,
  REALTOR_PLAN_BENEFITS,
  isRealtorPlanPeriodActive,
  realtorAmountLabel,
  realtorBillingLabel,
  realtorPeriodEndsLabel,
  realtorPlanName,
  realtorStatusLabel,
  type RealtorBillingPeriod,
} from "@/lib/realtor-plans";
import { cn } from "@/lib/utils";

const RETURN_TO = "/suscripciones";
const signInHref = `/sign-in?redirect_url=${encodeURIComponent(RETURN_TO)}`;
const signUpHref = `/sign-up?redirect_url=${encodeURIComponent(RETURN_TO)}`;

function PaymentInstructions({
  amount,
  period,
}: {
  amount: string;
  period: string | undefined;
}) {
  return (
    <aside
      className="rounded-xl border border-neon/25 bg-neon/5 px-4 py-4 text-sm text-foreground"
      role="note"
    >
      <p className="font-medium text-neon">Pago móvil</p>
      <p className="mt-2 text-muted-foreground">
        Monto:{" "}
        <span className="text-foreground">
          {amount}
          {period === "annual" ? " (anual)" : " (mensual)"}
        </span>
      </p>
      <ul className="mt-3 space-y-1 text-muted-foreground">
        <li>
          <span className="text-foreground">{REALTOR_PAGO_MOVIL.company}</span>
        </li>
        <li>Banco: {REALTOR_PAGO_MOVIL.bank}</li>
        <li>Teléfono: {REALTOR_PAGO_MOVIL.phone}</li>
        <li>RIF: {REALTOR_PAGO_MOVIL.rif}</li>
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Realiza el pago y registra la referencia abajo. Musas confirma y te
        avisa en notificaciones.
      </p>
    </aside>
  );
}

function RealtorSubscriptionsForm() {
  const { isSignedIn } = useAuth();
  const me = useQuery(
    api.users.me,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const create = useMutation(api.realtors.createRequest);
  const myRequests = useQuery(
    api.realtors.myRequests,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const planSummary = useQuery(
    api.realtors.myPlanSummary,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const [billingPeriod, setBillingPeriod] =
    useState<RealtorBillingPeriod>("monthly");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!me) return;
    setPhone((prev) => prev || me.contactPhone || "");
    setNotes((prev) => {
      if (prev) return prev;
      if (!me.name) return prev;
      return `Agente: ${me.name}${me.cityId ? ` · Ciudad: ${me.cityId}` : ""}`;
    });
  }, [me]);

  const openRequest = planSummary?.openRequest ?? null;
  const activePlan = planSummary?.activePlan ?? null;
  const expiredPlan = planSummary?.expiredPlan ?? null;
  const canCreateRequest = planSummary?.canCreateRequest === true;
  const approvedActive =
    activePlan &&
    isRealtorPlanPeriodActive(activePlan.status, activePlan.periodEndsAt);

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-neon uppercase">
        Plan para agentes
      </p>
      <h1 className="mt-3 max-w-2xl text-[clamp(1.8rem,4vw,2.75rem)] font-semibold tracking-tight text-foreground">
        Haz crecer tu negocio inmobiliario.
      </h1>
      <p className="mt-4 max-w-xl text-muted-foreground">
        Publica tus propiedades gratis, gestiona tus consultas y conecta con
        compradores e inquilinos. Activa el plan profesional con pago móvil y
        verificación Musas.
      </p>

      {approvedActive ? (
        <aside className="mt-6 rounded-xl border border-neon/40 bg-neon/10 px-4 py-3 text-sm text-foreground">
          <strong className="text-neon">Listo.</strong> Tu Plan Agente está
          activo
          {me?.realtorVerified ? " y eres Realtor Verificado" : ""}
          {realtorPeriodEndsLabel(activePlan?.periodEndsAt)
            ? ` · vence el ${realtorPeriodEndsLabel(activePlan?.periodEndsAt)}`
            : ""}
          .{" "}
          <Link href="/dashboard/cuenta#plan-agente" className="underline">
            Ver en Cuenta
          </Link>
        </aside>
      ) : expiredPlan ? (
        <aside className="mt-6 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-foreground">
          Tu plan venció
          {realtorPeriodEndsLabel(expiredPlan.periodEndsAt)
            ? ` el ${realtorPeriodEndsLabel(expiredPlan.periodEndsAt)}`
            : ""}
          . Puedes renovar abajo (solo hay un Plan Agente por ahora).
        </aside>
      ) : me?.accountKind === "realtor" && !openRequest ? (
        <aside className="mt-6 rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Tu perfil es de agente, pero el{" "}
          <span className="text-foreground">Plan Agente aún no está activo</span>
          . Paga con los datos abajo y envía la referencia; Musas lo confirma
          desde admin.
        </aside>
      ) : null}

      <p className="mt-10 text-xs tracking-[0.16em] text-muted-foreground uppercase">
        1 · Elige tu plan
      </p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setBillingPeriod("monthly")}
          aria-pressed={billingPeriod === "monthly"}
          className={cn(
            "rounded-2xl border p-5 text-left transition",
            billingPeriod === "monthly"
              ? "border-neon bg-neon/10"
              : "border-border bg-muted/30 hover:border-neon/35",
          )}
        >
          <p className="text-lg font-semibold text-foreground">Mensual</p>
          <p className="mt-2 text-2xl font-semibold text-neon">
            {REALTOR_MONTHLY_PRICE}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / mes
            </span>
          </p>
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod("annual")}
          aria-pressed={billingPeriod === "annual"}
          className={cn(
            "rounded-2xl border p-5 text-left transition",
            billingPeriod === "annual"
              ? "border-neon bg-neon/10"
              : "border-border bg-muted/30 hover:border-neon/35",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-lg font-semibold text-foreground">Anual</p>
            <span className="rounded-full border border-neon/40 px-2 py-0.5 text-[11px] text-neon">
              −{Math.round(REALTOR_ANNUAL_DISCOUNT * 100)}%
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-neon">
            {REALTOR_ANNUAL_PRICE}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              / año
            </span>
          </p>
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-muted/20 px-5 py-6">
        <h2 className="text-lg font-semibold text-foreground">
          Qué incluye el Plan Agente
        </h2>
        <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
          {REALTOR_PLAN_BENEFITS.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-neon" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {!isSignedIn ? (
        <div className="mt-12 rounded-2xl border border-border bg-muted/30 px-5 py-6">
          <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
            2 · Registro
          </p>
          <h2 className="mt-2 text-lg font-semibold text-foreground">
            Empieza como agente Musas
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea tu cuenta o inicia sesión. Te devolvemos aquí para completar
            datos y la referencia del pago en un solo paso.
          </p>
          <Link
            href={signUpHref}
            className="interactive-surface mt-5 inline-flex h-11 items-center rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground hover:bg-white"
          >
            Registrarme como agente
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href={signInHref} className="text-neon underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      ) : canCreateRequest ? (
        <form
          className="mt-12 space-y-4 rounded-2xl border border-border bg-muted/30 px-5 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!phone.trim()) {
              toast.error("Indica un WhatsApp o teléfono.");
              return;
            }
            if (paymentReference.trim().length < 4) {
              toast.error("Indica la referencia del pago móvil.");
              return;
            }
            setBusy(true);
            void create({
              planKey: "plan1",
              billingPeriod,
              notes,
              contactPhone: phone.trim(),
              paymentReference: paymentReference.trim(),
            })
              .then(() => {
                toast.success(
                  "Solicitud y referencia enviadas. Musas confirmará el pago.",
                );
                setNotes("");
                setPaymentReference("");
              })
              .catch((err) =>
                toast.error(err instanceof Error ? err.message : "Error"),
              )
              .finally(() => setBusy(false));
          }}
        >
          <div>
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              2 · Solicitud y pago
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Datos del agente + referencia de pago
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Plan: {realtorBillingLabel(billingPeriod)}. Un solo envío: tus
              datos y la referencia del pago móvil.
            </p>
          </div>
          <PaymentInstructions
            amount={realtorAmountLabel(billingPeriod)}
            period={billingPeriod}
          />
          {me?.email ? (
            <p className="text-sm text-muted-foreground">
              Cuenta:{" "}
              <span className="text-foreground">{me.name || me.email}</span>
            </p>
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
            <span className="text-muted-foreground">Notas *</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              required
              minLength={10}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="Ciudad, nombre comercial, años de experiencia…"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="text-muted-foreground">
              Referencia del pago móvil *
            </span>
            <input
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              required
              minLength={4}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="Ej. 123456789"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="interactive-surface h-11 rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Enviando…" : "Enviar solicitud y referencia"}
          </button>
        </form>
      ) : null}

      {openRequest ? (
        <section className="mt-12 space-y-4 rounded-2xl border border-border bg-muted/30 px-5 py-6">
          <div>
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              Estado
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              {realtorStatusLabel(openRequest.status)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {realtorPlanName(openRequest.planKey)} ·{" "}
              {realtorBillingLabel(openRequest.billingPeriod)}
            </p>
          </div>
          <PaymentInstructions
            amount={realtorAmountLabel(openRequest.billingPeriod)}
            period={openRequest.billingPeriod}
          />
          {openRequest.paymentReference ? (
            <p className="text-sm text-neon">
              Referencia registrada: {openRequest.paymentReference}. Musas
              confirmará el pago y te avisará en notificaciones.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tu solicitud quedó abierta sin referencia. Vuelve a enviar una
              nueva desde soporte u ops si hace falta.
            </p>
          )}
        </section>
      ) : null}

      {(myRequests?.length ?? 0) > 0 ? (
        <section className="mt-14">
          <h2 className="text-lg font-semibold text-foreground">
            Tus solicitudes
          </h2>
          <ul className="mt-4 space-y-3">
            {myRequests?.map((r) => (
              <li
                key={r._id}
                className="rounded-xl border border-border px-4 py-3 text-sm"
              >
                <p className="text-neon">{realtorStatusLabel(r.status)}</p>
                <p className="mt-1 text-foreground">
                  {realtorPlanName(r.planKey)} ·{" "}
                  {realtorBillingLabel(r.billingPeriod)}
                </p>
                {r.paymentReference ? (
                  <p className="mt-1 text-muted-foreground">
                    Ref. pago: {r.paymentReference}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

export function RealtorSubscriptionsPage() {
  return (
    <AppChrome>
      <main className="flex-1 bg-background">
        <BackendGate feature="Suscripciones Realtor">
          <RealtorSubscriptionsForm />
        </BackendGate>
      </main>
    </AppChrome>
  );
}
