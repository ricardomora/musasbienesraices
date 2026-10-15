"use client";

import { Reveal } from "@/components/motion/reveal";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-ink py-10 text-white/60">
      <Reveal>
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="font-display text-lg text-white">Musas Bienes Raíces</p>
          <p className="text-sm">
            © 2026 · Venta de propiedades, sin el abuso de siempre.
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
