"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { getGsap } from "@/lib/gsap-client";
import { LetterReveal } from "@/components/motion/letter-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { SiteHeader } from "./site-header";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !sectionRef.current || !mediaRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        mediaRef.current,
        { scale: 1.22, yPercent: 0 },
        {
          scale: 1.02,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
          },
        },
      );

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          yPercent: 18,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, [reduce]);

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      aria-label="Presentación Musas"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div ref={mediaRef} className="absolute inset-[-8%]">
          <Image
            src="/villa-dusk.png"
            alt="Villa moderna al atardecer con piscina infinita y vista a la ciudad"
            fill
            priority
            className="object-cover object-[58%_40%]"
            sizes="100vw"
          />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-ink/40"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent"
          aria-hidden
        />
        <div className="grain absolute inset-0" aria-hidden />
      </div>

      <SiteHeader />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end px-5 pb-24 pt-28 sm:px-8 sm:pb-28 lg:pb-32"
      >
        <p className="font-display text-[clamp(3.5rem,14vw,8.5rem)] leading-[0.9] tracking-tight text-white">
          <LetterReveal text="Musas" delay={0.15} />
        </p>

        <TextReveal
          as="h1"
          text="Vende tu propiedad sin el abuso de siempre."
          className="mt-6 max-w-2xl font-display text-[clamp(1.65rem,4.2vw,2.85rem)] leading-[1.08] tracking-tight text-white"
          delay={0.55}
          trigger="mount"
          stagger={0.04}
        />

        <motion.p
          className="mt-5 max-w-lg text-base leading-relaxed text-white/78 sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          La app que deja atrás portales opacos: claridad, control y un proceso
          que puedes seguir de punta a punta.
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="#acceso"
            className="interactive-surface inline-flex h-12 items-center justify-center rounded-md bg-neon px-7 text-sm font-medium text-primary-foreground shadow-[0_0_48px_-10px_color-mix(in_srgb,var(--neon)_75%,transparent)] hover:bg-white hover:text-ink"
          >
            Pedir acceso anticipado
          </a>
          <a
            href="#experiencia"
            className="interactive-surface inline-flex h-12 items-center justify-center rounded-md border border-white/25 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur-md hover:border-neon/45 hover:bg-white/10"
          >
            Ver la experiencia
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#problema"
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.28em] text-white/55 uppercase"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        aria-label="Continuar"
      >
        Scroll
        <motion.span
          className="block h-10 w-px origin-top bg-gradient-to-b from-neon to-transparent"
          animate={
            reduce
              ? undefined
              : { scaleY: [0.4, 1, 0.4], opacity: [0.35, 1, 0.35] }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
