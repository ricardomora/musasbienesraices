import type { Metadata } from "next";
import { PreferentialPage } from "@/components/preferential/preferential-page";

export const metadata: Metadata = {
  title: "Atención Preferencial — Paquetes",
  description:
    "Paquetes Musas: fotos, legal y acompañamiento. Solicita en app; coordinación y pago fuera.",
};

export const instant = false;

export default function Page() {
  return <PreferentialPage />;
}
