"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getGsap } from "@/lib/gsap-client";
import { MediaOverlay } from "./media-overlay";

const STEPS = [
  {
    n: "01",
    title: "Creas el listado en minutos",
    body: "Fotos reales, precio y condiciones que tú eliges — sin presión para firmar de prisa.",
  },
  {
    n: "02",
    title: "Conectas y cierras con mapa claro",
    body: "Interés filtrado e historial visible: el mismo recorrido para ti y para quien compra.",
  },
];

export function Promise() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
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
          end: "+=120%",
          pin: pinRef.current,
          scrub: 0.65,
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
          <div className="absolute inset-0 w-full">
            <Image
              src="/penthouse-interior.png"
              alt="Interior luminoso de penthouse con vista panorámica"
              fill
              quality={96}
              className="h-full w-full object-cover object-[45%_40%]"
              sizes="100vw"
            />
          </div>
          <MediaOverlay />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-end px-5 py-24 sm:px-8">
          <p className="text-xs tracking-[0.22em] text-neon uppercase">
            La promesa
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-white sm:text-5xl">
            Publica. Conecta. Cierra — con el mismo mapa.
          </h2>

          <div className="mt-10 min-h-[8rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.n}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-5"
              >
                <span className="font-display text-4xl text-neon tabular-nums sm:text-5xl">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-display text-2xl text-white sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                className="h-[2px] max-w-24 flex-1 overflow-hidden bg-white/15"
              >
                <motion.div
                  className="h-full bg-neon"
                  animate={{ scaleX: i <= index ? 1 : 0 }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
