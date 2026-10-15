import { LeadForm } from "@/components/lead-form";

export function Cta() {
  return (
    <section id="acceso" className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
        <div>
          <p className="text-sm font-medium tracking-wide text-pine uppercase">
            Acceso anticipado
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            Sé de las primeras personas en vender con Musas.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Estamos construyendo la primera versión. Déjanos tu correo y te
            avisamos cuando puedas publicar — sin compromiso y sin llamadas
            insistentes.
          </p>
        </div>
        <LeadForm />
      </div>
    </section>
  );
}
