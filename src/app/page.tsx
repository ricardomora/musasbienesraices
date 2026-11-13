import { Suspense } from "react";
import type { Metadata } from "next";
import { HomeShell } from "@/components/home/home-shell";

export const metadata: Metadata = {
  title: "Musas — Encuentra tu próximo lugar",
  description:
    "Explora inmuebles en venta en Venezuela: filtra por ciudad, tipo y presupuesto en USD. Guarda favoritos y da el siguiente paso sin complicaciones.",
};

/** Home is client/Convex-driven; skip Instant Navigation validation. */
export const instant = false;

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] flex-1 items-center justify-center bg-background text-muted-foreground">
          Cargando Musas…
        </main>
      }
    >
      <HomeShell />
    </Suspense>
  );
}
