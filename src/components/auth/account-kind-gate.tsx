"use client";

import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { api } from "../../../convex/_generated/api";
import { BACKEND_CONFIGURED } from "@/lib/backend";

/**
 * Post-login gate: ask particular vs realtor once (D14).
 * Does not block unsigned users or backend-off mode.
 */
export function AccountKindGate({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const me = useQuery(
    api.users.me,
    BACKEND_CONFIGURED && isSignedIn ? {} : "skip",
  );
  const setAccountKind = useMutation(api.users.setAccountKind);
  const [saving, setSaving] = useState(false);

  const needsKind =
    BACKEND_CONFIGURED &&
    isLoaded &&
    isSignedIn &&
    !!me &&
    !me.accountKind;

  async function choose(kind: "particular" | "realtor") {
    setSaving(true);
    try {
      await setAccountKind({ accountKind: kind });
      toast.success(
        kind === "realtor"
          ? "Cuenta Realtor lista. Puedes publicar y ver suscripciones."
          : "Cuenta particular lista.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {children}
      {needsKind ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/90 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
            <p className="text-[11px] tracking-[0.2em] text-neon uppercase">
              Bienvenido a Musas
            </p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              ¿Cómo vas a usar la plataforma?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Ambos pueden explorar y publicar inmuebles. Si eres agente, te
              mostramos el Plan Realtor y la etiqueta profesional.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void choose("particular")}
                className="rounded-2xl border border-border bg-muted/30 p-5 text-left transition hover:border-neon/40 disabled:opacity-50"
              >
                <p className="text-lg font-semibold text-foreground">
                  Particular
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Compro, alquilo o publico mi propio inmueble.
                </p>
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => void choose("realtor")}
                className="rounded-2xl border border-border bg-muted/30 p-5 text-left transition hover:border-neon/40 disabled:opacity-50"
              >
                <p className="text-lg font-semibold text-foreground">Realtor</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Soy agente inmobiliario y quiero publicar y crecer con Musas.
                </p>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
