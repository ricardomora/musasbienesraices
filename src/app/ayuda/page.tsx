import type { Metadata } from "next";
import Link from "next/link";
import { AppChrome } from "@/components/system/app-chrome";

export const metadata: Metadata = {
  title: "Ayuda",
  description:
    "Cómo funciona Musas: publicar, explorar, Musas Revisado y Preferencial.",
};

export const instant = false;

const LINKS = [
  { href: "/#inmuebles", label: "Explorar inmuebles", body: "Filtros, chips de zona y presupuesto." },
  { href: "/mapa", label: "Mapa", body: "Pins por sector (aprox.) en Caracas y otras ciudades." },
  { href: "/publicar", label: "Publicar", body: "Wizard en 3 pasos. Sale a la venta de inmediato." },
  { href: "/dashboard/inmuebles", label: "Mi panel", body: "Tus fichas, edición y estado de publicación." },
  { href: "/dashboard/mensajes", label: "Mensajes", body: "Preguntas de compradores y tus respuestas." },
  { href: "/preferencial", label: "Preferencial", body: "Fotos, legal o acompañamiento con red Musas (cerrada)." },
];

export default function AyudaPage() {
  return (
    <AppChrome>
      <main className="mx-auto max-w-3xl flex-1 space-y-10 px-5 py-12 sm:px-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Ayuda Musas</h1>
          <p className="mt-3 text-muted-foreground">
            Publicas primero; el equipo puede marcar{" "}
            <span className="text-neon">Musas Revisado</span> después (no es
            verificación de agente). En alquiler, el precio es{" "}
            <strong className="text-foreground">USD / mes</strong>. Mapa
            nacional en{" "}
            <Link href="/mapa" className="text-neon hover:underline">
              /mapa
            </Link>
            .
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Rutas útiles</h2>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="block rounded-xl border border-border px-4 py-3 hover:border-neon/35"
                >
                  <span className="font-medium text-neon">{l.label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {l.body}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-2 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">Confianza</h2>
          <p>
            Si una ficha no cuadra (precio, fotos, existencia), usa{" "}
            <strong className="text-foreground">
              «¿Precio o fotos no cuadran?»
            </strong>{" "}
            en la ficha. El equipo Musas la revisa.
          </p>
          <p>
            Preferencial no es un directorio abierto: solicitas un paquete y
            Musas coordina fuera de la app (WhatsApp / pago externo).
          </p>
        </section>
      </main>
    </AppChrome>
  );
}
