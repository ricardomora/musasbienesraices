"use client";

import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { LeadForm } from "@/components/lead-form";
import { MediaOverlay } from "./media-overlay";

export function Cta() {
  return (
    <section id="acceso" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0">
        <div className="absolute inset-0 w-full">
          <Image
            src="/home-hero.jpg"
            alt=""
            fill
            quality={96}
            className="h-full w-full object-cover object-[55%_40%]"
            sizes="100vw"
            aria-hidden
          />
        </div>
        <MediaOverlay />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
        <div>
          <Reveal>
            <p className="text-xs font-medium tracking-[0.22em] text-neon uppercase">
              Acceso anticipado
            </p>
          </Reveal>
          <TextReveal
            as="h2"
            text="Sé de las primeras personas en vender con Musas."
            className="mt-4 font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-tight tracking-tight text-white"
            delay={0.05}
          />
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">
              Estamos construyendo la primera versión. Déjanos tu correo y te
              avisamos cuando puedas publicar — sin compromiso y sin llamadas
              insistentes.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}
