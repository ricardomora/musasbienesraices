"use client";

import { Reveal } from "@/components/motion/reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { NeonField } from "@/components/motion/neon-field";
import { LeadForm } from "@/components/lead-form";

export function Cta() {
  return (
    <section id="acceso" className="relative overflow-hidden py-20 sm:py-28">
      <NeonField />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
        <div>
          <Reveal>
            <p className="text-sm font-medium tracking-[0.18em] text-neon/90 uppercase">
              Acceso anticipado
            </p>
          </Reveal>
          <TextReveal
            as="h2"
            text="Sé de las primeras personas en vender con Musas."
            className="mt-3 font-display text-3xl leading-tight tracking-tight text-foreground sm:text-4xl"
            delay={0.06}
          />
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
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
