"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { getGsap } from "@/lib/gsap-client";
import { NeonField } from "@/components/motion/neon-field";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

const POINTS = [
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

export function Difference() {
  const rootRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !rootRef.current || !lineRef.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          transformOrigin: "left center",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            end: "top 20%",
            scrub: true,
          },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={rootRef}
      id="diferencia"
      className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32"
    >
      <NeonField />
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.22em] text-neon uppercase">
            Por qué Musas
          </p>
        </Reveal>
        <TextReveal
          as="h2"
          text="Distinto de raíz: menos intermediarios abusivos, más control tuyo."
          className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight text-white"
          delay={0.05}
          stagger={0.035}
        />
        <div
          ref={lineRef}
          className="mt-10 h-px w-full max-w-xl bg-gradient-to-r from-neon via-neon/50 to-transparent"
          aria-hidden
        />
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            Musas no es otro listado infinito. Es una forma de vender donde la
            plataforma trabaja para quien publica — no al revés.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:grid-cols-3 sm:gap-10">
          {POINTS.map((point, index) => (
            <Reveal
              key={point.title}
              delay={0.08 + index * 0.1}
              className="relative"
            >
              <span className="font-display text-5xl leading-none text-white/10 tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-xl tracking-tight text-white sm:text-2xl">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
                {point.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
