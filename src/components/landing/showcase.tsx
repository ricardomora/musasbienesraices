"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { getGsap } from "@/lib/gsap-client";

const PANELS = [
  {
    src: "/villa-day.png",
    alt: "Villa luminosa con piscina tropical",
    label: "Publica",
    copy: "Tu listado, tus reglas, tu precio — sin intermediarios que te empujen.",
  },
  {
    src: "/penthouse-interior.png",
    alt: "Interior de penthouse con vista a la ciudad",
    label: "Conecta",
    copy: "Interés calificado. Menos ruido. Conversaciones que valen la pena.",
  },
  {
    src: "/villa-dusk.png",
    alt: "Villa al anochecer con vista al valle",
    label: "Cierra",
    copy: "Cada paso visible. El mismo mapa para ti y para quien compra.",
  },
];

export function Showcase() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !rootRef.current || !pinRef.current || !trackRef.current) {
      return;
    }
    const { gsap } = getGsap();
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const scrollTween = gsap.to(track, {
        x: () => -getTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: () => `+=${getTravel() * 1.15}`,
          pin: pinRef.current,
          scrub: 0.9,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>("[data-panel-media]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.2 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-panel-copy]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              containerAnimation: scrollTween,
              start: "left 70%",
              end: "left 25%",
              scrub: true,
            },
          },
        );
      });
    }, rootRef);

    return () => ctx.revert();
  }, [reduce]);

  if (reduce) {
    return (
      <section id="experiencia" className="border-y border-white/5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 md:grid-cols-3">
          {PANELS.map((panel) => (
            <article key={panel.label} className="space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
              <h3 className="font-display text-2xl text-white">{panel.label}</h3>
              <p className="text-sm text-white/70">{panel.copy}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={rootRef}
      id="experiencia"
      className="relative bg-ink"
      aria-label="Experiencia Musas"
    >
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute left-5 top-8 z-20 sm:left-8">
          <p className="text-xs tracking-[0.24em] text-neon/90 uppercase">
            La experiencia
          </p>
          <p className="mt-2 max-w-sm font-display text-2xl text-white/90 sm:text-3xl">
            Tres momentos. Un solo flujo.
          </p>
        </div>

        <div ref={trackRef} className="flex h-full w-max will-change-transform">
          {PANELS.map((panel) => (
            <article
              key={panel.label}
              className="relative h-[100svh] w-screen shrink-0"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div data-panel-media className="absolute inset-[-8%]">
                  <Image
                    src={panel.src}
                    alt={panel.alt}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/25"
                  aria-hidden
                />
              </div>
              <div
                data-panel-copy
                className="absolute inset-x-0 bottom-0 z-10 px-5 pb-16 sm:px-10 sm:pb-20"
              >
                <p className="font-display text-[clamp(3rem,10vw,7rem)] leading-none tracking-tight text-white">
                  {panel.label}
                </p>
                <p className="mt-4 max-w-md text-base text-white/75 sm:text-lg">
                  {panel.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
