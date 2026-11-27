"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { api } from "../../../convex/_generated/api";
import { BACKEND_CONFIGURED } from "@/lib/backend";
import { AuthGate } from "@/components/auth-gate";

/**
 * Signed-in + Convex role=admin. Complements AuthGate without clerkMiddleware.
 */
function AdminRoleCheck({ children }: { children: ReactNode }) {
  const me = useQuery(api.users.me, BACKEND_CONFIGURED ? {} : "skip");

  if (!BACKEND_CONFIGURED) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Backend no configurado.
      </p>
    );
  }

  if (me === undefined) {
    return (
      <p className="p-10 text-center text-sm text-muted-foreground">
        Comprobando permisos…
      </p>
    );
  }

  if (!me || me.role !== "admin") {
    return (
      <div className="mx-auto max-w-lg space-y-3 p-10 text-center text-sm text-muted-foreground">
        <p>
          Necesitas rol admin. Configura{" "}
          <code className="text-neon">ADMIN_EMAILS</code> en Convex con tu email
          de Clerk.
        </p>
        <Link href="/dashboard/inmuebles" className="text-neon hover:underline">
          Volver al panel
        </Link>
      </div>
    );
  }

  return children;
}

export function AdminGate({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <AdminRoleCheck>{children}</AdminRoleCheck>
    </AuthGate>
  );
}
