"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

export function Promise() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      id="promesa"
      className="relative overflow-hidden border-b border-white/5 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <Reveal delay={0.08} className="relative order-2 lg:order-1">
          <div
            ref={ref}
            className="relative aspect-[16/11] overflow-hidden"
          >
            <motion.div
              className="absolute inset-0"
              style={reduce ? undefined : { scale }}
            >
              <Image
                src="/section-interior.jpg"
                alt="Interior luminoso de casa moderna con patio y vegetación"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div
              className="absolute inset-0 ring-1 ring-inset ring-neon/15"
              aria-hidden
            />
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="text-sm font-medium tracking-[0.18em] text-neon/90 uppercase">
              La promesa
            </p>
          </Reveal>
          <TextReveal
            as="h2"
            text="Publica. Conecta. Cierra — con el mismo mapa en la mano."
            className="mt-3 font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl"
            delay={0.06}
          />
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Tres pasos claros: creas tu anuncio con fotos y datos reales,
              recibes interés calificado sin intermediarios agresivos, y avanzas
              hacia el cierre viendo cada movimiento. Simple de explicar.
              Difícil de encontrar en el mercado actual.
            </p>
          </Reveal>
          <ol className="mt-8 space-y-5">
            {[
              "Creas el listado en minutos, con precios y condiciones que tú eliges.",
              "Recibes interés filtrado: menos ruido, más conversaciones serias.",
              "Cierras con un historial claro de lo que pasó — para ti y para el comprador.",
            ].map((step, i) => (
              <Reveal key={step} delay={0.14 + i * 0.08} y={18}>
                <li className="flex gap-4 text-sm sm:text-base">
                  <span className="font-display text-2xl leading-none text-neon tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed text-foreground/85">
                    {step}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
