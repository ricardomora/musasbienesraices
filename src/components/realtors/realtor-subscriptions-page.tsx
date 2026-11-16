"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { AppChrome } from "@/components/system/app-chrome";
import { BackendGate } from "@/components/system/backend-gate";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import {
  REALTOR_ANNUAL_DISCOUNT,
  REALTOR_ANNUAL_PRICE,
  REALTOR_MONTHLY_PRICE,
  REALTOR_PLAN_BENEFITS,
  realtorBillingLabel,
  realtorPlanName,
  realtorStatusLabel,
  type RealtorBillingPeriod,
} from "@/lib/realtor-plans";
import { cn } from "@/lib/utils";

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
  const [billingPeriod, setBillingPeriod] =
    useState<RealtorBillingPeriod>("monthly");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");

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
        compradores e inquilinos. Activa el plan profesional cuando quieras los
        beneficios de agente Musas.
      </p>

      <aside
        className="mt-6 rounded-xl border border-neon/25 bg-neon/5 px-4 py-3 text-sm leading-relaxed text-foreground"
        role="note"
      >
        <strong className="font-medium text-neon">Importante:</strong> la
        insignia de agente verificado no es lo mismo que «Musas Revisado» en una
        ficha. Cotización y pago se coordinan fuera de la app.
      </aside>

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
          <p className="mt-2 text-sm text-muted-foreground">
            Flexibilidad mes a mes. Activación fuera de la app.
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
          <p className="mt-2 text-sm text-muted-foreground">
            Equivale a ~{Math.round(REALTOR_ANNUAL_PRICE / 12)}/mes. Mismos
            beneficios, mejor precio.
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
            Crea tu cuenta y vuelve aquí para solicitar el plan{" "}
            {billingPeriod === "annual" ? "anual" : "mensual"}.
          </p>
          <Link
            href="/sign-up"
            className="interactive-surface mt-5 inline-flex h-11 items-center rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground hover:bg-white"
          >
            Registrarme como agente
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link href="/sign-in" className="text-neon underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      ) : (
        <form
          className="mt-12 space-y-4 rounded-2xl border border-border bg-muted/30 px-5 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!phone.trim()) {
              toast.error("Indica un WhatsApp o teléfono.");
              return;
            }
            void create({
              planKey: "plan1",
              billingPeriod,
              notes,
              contactPhone: phone.trim(),
            })
              .then(() => {
                toast.success(
                  "Solicitud enviada. Te escribimos por WhatsApp para activar el plan.",
                );
                setNotes("");
              })
              .catch((err) =>
                toast.error(err instanceof Error ? err.message : "Error"),
              );
          }}
        >
          <div>
            <p className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
              2 · Solicitud
            </p>
            <h2 className="mt-2 text-lg font-semibold text-foreground">
              Solicitar Plan Agente
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Plan seleccionado: {realtorBillingLabel(billingPeriod)}. Deja
              WhatsApp y una nota; activamos fuera de la plataforma.
              {me && me.accountKind !== "realtor"
                ? " Al enviar, tu cuenta pasará a tipo Realtor."
                : ""}
            </p>
          </div>
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
              rows={4}
              required
              minLength={10}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground"
              placeholder="Ciudad, nombre comercial, años de experiencia…"
            />
          </label>
          <button
            type="submit"
            className="interactive-surface h-11 rounded-full bg-neon px-6 text-sm font-semibold text-primary-foreground"
          >
            Solicitar plan
          </button>
          <p className="text-xs text-muted-foreground">
            No se cobra aquí. Coordinación y pago fuera de Musas.
          </p>
        </form>
      )}

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
                <span className="text-neon">
                  {realtorStatusLabel(r.status)}
                </span>
                {" · "}
                {realtorPlanName(r.planKey)}
                {" · "}
                {realtorBillingLabel(r.billingPeriod)}
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
