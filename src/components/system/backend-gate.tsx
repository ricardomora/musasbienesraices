"use client";

import type { ReactNode } from "react";
import { BACKEND_CONFIGURED } from "@/lib/backend";

export function BackendGate({
  children,
  feature,
}: {
  children: ReactNode;
  feature: string;
}) {
  if (!BACKEND_CONFIGURED) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <h1 className="text-2xl font-semibold text-white">
          Configura Musas primero
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Para {feature} necesitas un proyecto Clerk + Convex + UploadThing{" "}
          <strong>nuevo</strong> (no reutilices Biosite). Copia{" "}
          <code className="text-neon">.env.example</code> →{" "}
          <code className="text-neon">.env.local</code> y corre{" "}
          <code className="text-neon">npx convex dev</code>.
        </p>
      </div>
    );
  }
  return children;
}
