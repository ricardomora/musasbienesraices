"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getGsap } from "@/lib/gsap-client";

const STAGES = [
  {
    kicker: "01 — Opacidad",
    title: "Te cobran de más y te explican de menos.",
    body: "Comisiones que aparecen tarde, letra chica y presión para bajar el precio. Vender no debería sentirse como negociar contra tu propio lado.",
  },
  {
    kicker: "02 — Ruido",
    title: "Portales saturados donde tu casa desaparece.",
    body: "Listados infinitos, leads fríos y cero claridad sobre quién mira tu propiedad — o por qué nunca contestan.",
  },
  {
    kicker: "03 — Ceguera",
    title: "Procesos largos sin mapa en la mano.",
    body: "Nunca sabes en qué etapa estás. Musas existe para que el proceso sea visible, justo y bajo tu control.",
  },
];

export function Problem() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(0);

  useLayoutEffect(() => {
    if (reduce || !rootRef.current || !pinRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=260%",
          pin: pinRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(
              STAGES.length - 1,
              Math.floor(self.progress * STAGES.length),
            );
            setStage((prev) => (prev === next ? prev : next));
          },
        },
      });

      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { scale: 1.28, xPercent: 4 },
          { scale: 1.02, xPercent: -2, ease: "none" },
          0,
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  const active = STAGES[stage];

  return (
    <section
      ref={rootRef}
      id="problema"
      className="relative bg-background"
      aria-label="El problema del mercado"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div ref={imageRef} className="absolute inset-[-10%]">
            <Image
              src="/villa-day.png"
              alt="Villa de día con piscina y montañas"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority={false}
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/70 to-ink/25"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-ink/40"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-5 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="min-h-[16rem]">
            <p className="text-xs font-medium tracking-[0.22em] text-neon uppercase">
              El mercado de siempre
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={active.kicker}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="mt-5 text-sm tracking-[0.16em] text-white/55 uppercase">
                  {active.kicker}
                </p>
                <h2 className="mt-3 max-w-xl font-display text-3xl leading-tight tracking-tight text-white sm:text-5xl">
                  {active.title}
                </h2>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/72 sm:text-lg">
                  {active.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-3 lg:justify-end">
            {STAGES.map((item, index) => (
              <div
                key={item.kicker}
                className="h-1 w-10 overflow-hidden rounded-full bg-white/15 sm:w-14"
                aria-hidden
              >
                <motion.div
                  className="h-full bg-neon"
                  animate={{ scaleX: index <= stage ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
