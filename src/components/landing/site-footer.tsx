"use client";

import { Reveal } from "@/components/motion/reveal";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-ink py-12 text-white/55">
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="font-display text-2xl text-white">Musas</p>
            <p className="mt-1 text-sm">Bienes Raíces · LatAm</p>
          </div>
          <p className="text-sm">
            © 2026 · Venta de propiedades, sin el abuso de siempre.
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
