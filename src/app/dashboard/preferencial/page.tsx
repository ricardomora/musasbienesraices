"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  packageName,
  preferentialStatusLabel,
} from "@/lib/preferential-packages";

function MyPreferential() {
  const rows = useQuery(api.preferential.myRequests);
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold text-foreground">
        Mis solicitudes Preferencial
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Estado de paquetes. Coordinación y pago fuera de la app.{" "}
        <Link href="/preferencial" className="text-neon hover:underline">
          Nueva solicitud
        </Link>
      </p>
      <ul className="mt-8 space-y-3">
        {(rows ?? []).map((r) => (
          <li
            key={r._id}
            className="rounded-xl border border-border p-4 text-sm"
          >
            <p className="text-neon">{preferentialStatusLabel(r.status)}</p>
            <p className="mt-1 text-foreground">
              {r.packageKeys.map(packageName).join(" · ")}
            </p>
            {r.notes ? (
              <p className="mt-2 text-muted-foreground">{r.notes}</p>
            ) : null}
          </li>
        ))}
        {rows?.length === 0 ? (
          <p className="text-muted-foreground">
            Sin solicitudes.{" "}
            <Link href="/preferencial" className="text-neon hover:underline">
              Elige un paquete
            </Link>
          </p>
        ) : null}
      </ul>
    </div>
  );
}

export default function DashboardPreferencialPage() {
  return (
    <main className="flex-1 bg-background">
      <BackendGate feature="solicitudes Preferencial">
        <DashboardNav />
        <MyPreferential />
      </BackendGate>
    </main>
  );
}
