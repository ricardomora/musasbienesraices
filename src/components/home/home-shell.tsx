"use client";

import { BACKEND_CONFIGURED } from "@/lib/backend";
import { ConvexHomeApp } from "./convex-home-app";

/**
 * Prod/beta always use Convex. Offline mock HomeApp is no longer mounted
 * (demo catalog only via admin seed).
 */
export function HomeShell() {
  if (!BACKEND_CONFIGURED) {
    return (
      <main className="flex flex-1 items-center justify-center bg-background px-6 py-20 text-center">
        <div className="max-w-md space-y-3">
          <h1 className="text-xl font-semibold text-foreground">
            Musas no está configurado
          </h1>
          <p className="text-sm text-muted-foreground">
            Faltan{" "}
            <code className="text-neon">NEXT_PUBLIC_CONVEX_URL</code> y/o{" "}
            <code className="text-neon">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
            en el entorno.
          </p>
        </div>
      </main>
    );
  }
  return <ConvexHomeApp />;
}
