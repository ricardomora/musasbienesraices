"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { NeonField } from "@/components/motion/neon-field";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";

export function Problem() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);

  return (
    <section
      id="problema"
      className="relative overflow-hidden border-b border-white/5 py-20 sm:py-28"
    >
      <NeonField />
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <p className="text-sm font-medium tracking-[0.18em] text-neon/90 uppercase">
              El mercado de siempre
            </p>
          </Reveal>
          <TextReveal
            as="h2"
            text="La gente está cansada de que les cobren de más y les digan poco."
            className="mt-3 font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl"
            delay={0.08}
          />
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Comisiones opacas, presión para bajar el precio, listados que se
              pierden en portales saturados y agentes que priorizan el cierre
              rápido sobre tu patrimonio. Vender no debería sentirse como
              negociar contra tu propio lado.
            </p>
          </Reveal>
          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
            {[
              "Tarifas que aparecen tarde y cambian sin aviso.",
              "Procesos largos donde nunca sabes en qué etapa estás.",
              "Poca transparencia sobre quién ve tu propiedad y por qué.",
            ].map((item, index) => (
              <Reveal key={item} delay={0.16 + index * 0.08} y={20}>
                <li className="border-l border-neon/40 pl-4">{item}</li>
              </Reveal>
            ))}
          </ul>
        </div>
        <Reveal delay={0.15} className="relative">
          <div
            ref={ref}
            className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]"
          >
            <motion.div
              className="absolute inset-0"
              style={reduce ? undefined : { scale }}
            >
              <Image
                src="/section-street.jpg"
                alt="Fachada urbana de edificios residenciales en una calle tranquila"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div
              className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent"
              aria-hidden
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
