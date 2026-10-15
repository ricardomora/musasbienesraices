import { Suspense } from "react";
import type { Metadata } from "next";
import { HomeApp } from "@/components/home/home-app";

export const metadata: Metadata = {
  title: "Musas — Encuentra tu próximo lugar",
  description:
    "Explora inmuebles en Venezuela con claridad: filtra por ciudad, tipo y presupuesto en USD. Guarda favoritos y da el siguiente paso sin complicaciones.",
};

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[50vh] flex-1 items-center justify-center bg-background text-muted-foreground">
          Cargando Musas…
        </main>
      }
    >
      <HomeApp />
    </Suspense>
  );
}
