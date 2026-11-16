"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  realtorBillingLabel,
  realtorPlanName,
  realtorStatusLabel,
} from "@/lib/realtor-plans";

function MySubscriptions() {
  const rows = useQuery(api.realtors.myRequests);
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Mis suscripciones Realtor
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estado de solicitudes. Activación y pago fuera de la app.{" "}
        <Link href="/suscripciones" className="text-neon hover:underline">
          Nueva solicitud
        </Link>
      </p>
      <ul className="mt-8 space-y-3">
        {(rows ?? []).map((r) => (
          <li
            key={r._id}
            className="rounded-xl border border-border p-4 text-sm"
          >
            <p className="text-neon">{realtorStatusLabel(r.status)}</p>
            <p className="mt-1 text-foreground">
              {realtorPlanName(r.planKey)} · {realtorBillingLabel(r.billingPeriod)}
            </p>
            {r.notes ? (
              <p className="mt-2 text-muted-foreground">{r.notes}</p>
            ) : null}
          </li>
        ))}
        {rows?.length === 0 ? (
          <p className="text-muted-foreground">
            Sin solicitudes.{" "}
            <Link href="/suscripciones" className="text-neon hover:underline">
              Ver planes
            </Link>
          </p>
        ) : null}
      </ul>
    </div>
  );
}

export default function DashboardSuscripcionesPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="suscripciones Realtor">
        <DashboardNav />
        <MySubscriptions />
      </BackendGate>
    </main>
  );
}
