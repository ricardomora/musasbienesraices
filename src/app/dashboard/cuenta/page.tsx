"use client";

import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { BackendGate } from "@/components/system/backend-gate";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

function CuentaPanel() {
  const me = useQuery(api.users.me);
  const setAccountKind = useMutation(api.users.setAccountKind);

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

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mi cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {me.email}
          {me.name ? ` · ${me.name}` : ""}
        </p>
      </div>

      <section className="rounded-2xl border border-border p-5">
        <h2 className="text-lg font-semibold text-foreground">Tipo de cuenta</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Actual:{" "}
          <span className="text-neon">
            {me.accountKind === "realtor"
              ? "Realtor"
              : me.accountKind === "particular"
                ? "Particular"
                : "Sin definir"}
          </span>
          {me.accountKind === "realtor" && me.realtorVerified ? (
            <span className="ml-2 text-foreground">· Realtor Verificado</span>
          ) : null}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-neon/40"
            onClick={() =>
              void setAccountKind({ accountKind: "particular" })
                .then(() => toast.success("Cuenta particular"))
                .catch((e) =>
                  toast.error(e instanceof Error ? e.message : "Error"),
                )
            }
          >
            Particular
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:border-neon/40"
            onClick={() =>
              void setAccountKind({ accountKind: "realtor" })
                .then(() => toast.success("Cuenta Realtor"))
                .catch((e) =>
                  toast.error(e instanceof Error ? e.message : "Error"),
                )
            }
          >
            Realtor
          </button>
        </div>
        {me.accountKind === "realtor" ? (
          <p className="mt-4 text-sm text-muted-foreground">
            <Link href="/suscripciones" className="text-neon underline">
              Ver Plan Realtor
            </Link>{" "}
            y solicitar suscripción.
          </p>
        ) : null}
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
