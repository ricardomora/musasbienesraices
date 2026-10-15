"use client";

import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { NeonField } from "@/components/motion/neon-field";

export function Difference() {
  const points = [
    {
      title: "Tú defines las reglas",
      body: "Publicas con precios y condiciones claros. Sin letra chica ni presión para aceptar la primera oferta baja.",
    },
    {
      title: "Proceso visible de punta a punta",
      body: "Sabes quién muestra interés, en qué etapa va cada conversación y qué falta para cerrar.",
    },
    {
      title: "Hecha para LatAm",
      body: "Copy, flujos y expectativas pensados para cómo se vende aquí — no un portal genérico traducido.",
    },
  ];

  return (
    <section
      id="diferencia"
      className="relative overflow-hidden border-b border-white/5 bg-pine-deep/40 py-20 sm:py-28"
    >
      <NeonField />
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-sm font-medium tracking-[0.18em] text-neon/90 uppercase">
            Por qué Musas
          </p>
        </Reveal>
        <TextReveal
          as="h2"
          text="Distinto de raíz: menos intermediarios abusivos, más control tuyo."
          className="mt-3 max-w-2xl font-display text-3xl leading-tight tracking-tight text-white sm:text-4xl"
          delay={0.06}
        />
        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Musas no es otro listado infinito. Es una forma de vender donde la
            plataforma trabaja para quien publica — no al revés.
          </p>
        </Reveal>
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {points.map((point, index) => (
            <Reveal
              key={point.title}
              delay={0.1 + index * 0.1}
              className="border-t border-white/15 pt-6"
            >
              <h3 className="font-display text-xl tracking-tight text-white">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">
                {point.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
