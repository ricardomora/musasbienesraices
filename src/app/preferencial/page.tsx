import { Suspense } from "react";
import type { Metadata } from "next";
import { PreferentialPage } from "@/components/preferential/preferential-page";

export const metadata: Metadata = {
  title: "Preferencial — Musas",
  description:
    "Fotos, revisión legal o acompañamiento. Solicita aquí; cotización y coordinación fuera de la app.",
};

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PreferentialPage />
    </Suspense>
  );
}
