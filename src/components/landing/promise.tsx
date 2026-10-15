"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getGsap } from "@/lib/gsap-client";

const STEPS = [
  {
    n: "01",
    title: "Creas el listado en minutos",
    body: "Fotos reales, precio y condiciones que tú eliges — sin que nadie te empuje a firmar de prisa.",
  },
  {
    n: "02",
    title: "Recibes interés filtrado",
    body: "Menos ruido, más conversaciones serias. Ves quién mira y por qué importa.",
  },
  {
    n: "03",
    title: "Cierras con historial claro",
    body: "El mismo mapa para ti y para el comprador. Cada movimiento queda a la vista.",
  },
];

export function Promise() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useLayoutEffect(() => {
    if (reduce || !rootRef.current || !pinRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "+=220%",
          pin: pinRef.current,
          scrub: 0.75,
          anticipatePin: 1,
          onUpdate: (self) => {
            const next = Math.min(
              STEPS.length - 1,
              Math.floor(self.progress * STEPS.length),
            );
            setIndex((prev) => (prev === next ? prev : next));
          },
        },
      });

      if (mediaRef.current) {
        gsap.fromTo(
          mediaRef.current,
          { scale: 1.18, clipPath: "inset(8% 8% 8% 8%)" },
          {
            scale: 1.02,
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "none",
            scrollTrigger: {
              trigger: rootRef.current,
              start: "top top",
              end: "+=220%",
              scrub: 0.75,
            },
          },
        );
      }
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  const step = STEPS[index];

  return (
    <section
      ref={rootRef}
      id="promesa"
      className="relative bg-background"
      aria-label="La promesa Musas"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] items-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div ref={mediaRef} className="absolute inset-0">
            <Image
              src="/penthouse-interior.png"
              alt="Interior luminoso de penthouse con vista panorámica"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/30"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-ink/30"
            aria-hidden
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-end px-5 py-24 sm:px-8">
          <p className="text-xs tracking-[0.22em] text-neon uppercase">
            La promesa
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-white sm:text-5xl">
            Publica. Conecta. Cierra — con el mismo mapa.
          </h2>

          <div className="mt-12 min-h-[9rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-5"
              >
                <span className="font-display text-4xl text-neon tabular-nums sm:text-5xl">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-white sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-10 flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="h-[2px] flex-1 max-w-24 overflow-hidden bg-white/15"
              >
                <motion.div
                  className="h-full bg-neon"
                  animate={{ scaleX: i <= index ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
