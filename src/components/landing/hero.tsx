"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ParallaxMedia } from "@/components/motion/parallax-media";
import { TextReveal } from "@/components/motion/text-reveal";
import { SiteHeader } from "./site-header";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Presentación Musas"
    >
      <ParallaxMedia
        src="/hero-property.jpg"
        alt="Residencia moderna con fachada de piedra y vegetación, luz de atardecer"
        priority
        scaleFrom={1.14}
        scaleTo={1.02}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-ink/35"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
        aria-hidden
      />

      <SiteHeader />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-20 pt-28 sm:px-8 sm:pb-24 lg:pb-28">
        <motion.p
          className="font-display text-5xl leading-none tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          initial={reduce ? false : { opacity: 0, y: 36, clipPath: "inset(100% 0 0 0)" }}
          animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
          transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
        >
          Musas
        </motion.p>

        <TextReveal
          as="h1"
          text="Vende tu propiedad sin el abuso de siempre."
          className="mt-5 max-w-2xl font-display text-3xl leading-tight tracking-tight text-white sm:text-4xl md:text-[2.75rem]"
          delay={0.28}
        />

        <motion.p
          className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            delay: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          Claridad, control y trato justo: la app que reemplaza portales opacos
          y procesos de otra época.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <a
            href="#acceso"
            className="interactive-surface inline-flex h-12 items-center justify-center rounded-md bg-neon px-6 text-sm font-medium text-primary-foreground shadow-[0_0_40px_-12px_color-mix(in_srgb,var(--neon)_70%,transparent)] hover:bg-white hover:text-ink"
          >
            Pedir acceso anticipado
          </a>
          <a
            href="#diferencia"
            className="interactive-surface inline-flex h-12 items-center justify-center rounded-md border border-white/25 bg-white/5 px-6 text-sm font-medium text-white backdrop-blur-md hover:border-neon/40 hover:bg-white/10"
          >
            Cómo funciona Musas
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#problema"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.2em] text-white/55 uppercase"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Continuar al siguiente bloque"
      >
        <span>Explorar</span>
        <motion.span
          className="block h-8 w-px bg-gradient-to-b from-neon/80 to-transparent"
          animate={reduce ? undefined : { scaleY: [0.55, 1, 0.55], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ originY: 0 }}
        />
      </motion.a>
    </section>
  );
}
