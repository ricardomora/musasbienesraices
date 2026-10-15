export function Difference() {
  const points = [
    {
      title: "Tú defines las reglas",
      body: "Publicas con precios y condiciones claros. Sin letra chica ni presión para aceptar la primera oferta baja.",
    },
    {
      title: "Proceso visible de punta a punta",
      body: "Sabes quién muestra interés, en qué etapa va cada conversación y qué falta para cerrar.",
    },
    {
      title: "Hecha para LatAm",
      body: "Copy, flujos y expectativas pensados para cómo se vende aquí — no un portal genérico traducido.",
    },
  ];

  return (
    <section
      id="diferencia"
      className="relative border-b border-pine/10 bg-pine-deep py-20 text-primary-foreground sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-sm font-medium tracking-wide text-sand/90 uppercase">
          Por qué Musas
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Distinto de raíz: menos intermediarios abusivos, más control tuyo.
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Musas no es otro listado infinito. Es una forma de vender donde la
          plataforma trabaja para quien publica — no al revés.
        </p>
        <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {points.map((point, index) => (
            <article
              key={point.title}
              className="rise-in border-t border-white/20 pt-6"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <h3 className="font-display text-xl tracking-tight text-white">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                {point.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
