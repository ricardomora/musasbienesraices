import Image from "next/image";

export function Promise() {
  return (
    <section
      id="promesa"
      className="relative overflow-hidden border-b border-pine/10 py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 aspect-[16/11] overflow-hidden rounded-sm lg:order-1">
          <Image
            src="/section-interior.jpg"
            alt="Interior luminoso de casa moderna con patio y vegetación"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-medium tracking-wide text-pine uppercase">
            La promesa
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            Publica. Conecta. Cierra — con el mismo mapa en la mano.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Tres pasos claros: creas tu anuncio con fotos y datos reales,
            recibes interés calificado sin intermediarios agresivos, y avanzas
            hacia el cierre viendo cada movimiento. Simple de explicar. Difícil
            de encontrar en el mercado actual.
          </p>
          <ol className="mt-8 space-y-5">
            {[
              "Creas el listado en minutos, con precios y condiciones que tú eliges.",
              "Recibes interés filtrado: menos ruido, más conversaciones serias.",
              "Cierras con un historial claro de lo que pasó — para ti y para el comprador.",
            ].map((step, i) => (
              <li key={step} className="flex gap-4 text-sm sm:text-base">
                <span className="font-display text-2xl leading-none text-pine tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="leading-relaxed text-foreground/90">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
