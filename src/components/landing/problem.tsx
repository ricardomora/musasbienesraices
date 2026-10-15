import Image from "next/image";

export function Problem() {
  return (
    <section
      id="problema"
      className="relative overflow-hidden border-b border-pine/10 py-20 sm:py-28"
    >
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
          <p className="text-sm font-medium tracking-wide text-pine uppercase">
            El mercado de siempre
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            La gente está cansada de que les cobren de más y les digan poco.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Comisiones opacas, presión para bajar el precio, listados que se
            pierden en portales saturados y agentes que priorizan el cierre
            rápido sobre tu patrimonio. Vender no debería sentirse como
            negociar contra tu propio lado.
          </p>
          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
            <li className="border-l-2 border-pine/50 pl-4">
              Tarifas que aparecen tarde y cambian sin aviso.
            </li>
            <li className="border-l-2 border-pine/50 pl-4">
              Procesos largos donde nunca sabes en qué etapa estás.
            </li>
            <li className="border-l-2 border-pine/50 pl-4">
              Poca transparencia sobre quién ve tu propiedad y por qué.
            </li>
          </ul>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm sm:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src="/section-street.jpg"
            alt="Fachada urbana de edificios residenciales en una calle tranquila"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
