import { Home } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Descubre lo que va contigo",
    body: "Filtra por ciudad, tipo y presupuesto en USD. Guarda los espacios que te hacen sentir en casa.",
  },
  {
    n: "02",
    title: "Conoce cada detalle",
    body: "Consulta áreas, distribución, precio de venta y administración en USD. Sin perseguir la información.",
  },
  {
    n: "03",
    title: "Da el siguiente paso",
    body: "Abre la ficha, prepara tus preguntas y contacta con claridad antes de visitar.",
  },
];

type HowItWorksProps = {
  onPublish?: () => void;
  /** Convex live: CTAs de producto, no waitlist/demo. */
  productLive?: boolean;
};

export function HowItWorks({ onPublish, productLive = false }: HowItWorksProps) {
  return (
    <>
      <section
        id="como-funciona"
        className="scroll-mt-24 border-t border-border bg-background py-20 sm:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-neon uppercase">
                <span className="h-px w-8 bg-neon" aria-hidden />
                El camino a tu nuevo hogar
              </p>
              <h2 className="mt-4 max-w-xl text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-semibold tracking-tight text-foreground">
                Una gran decisión.
                <br className="hidden sm:block" /> Un proceso más simple.
              </h2>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground lg:text-right">
              Solo venta en USD. Alquiler no está en esta versión.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step) => (
              <article key={step.n} className="space-y-3">
                <p className="text-sm font-medium text-neon tabular-nums">
                  {step.n}
                </p>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="publicar"
        className="scroll-mt-24 border-t border-border bg-background py-14"
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
          <div>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              ¿Tienes un inmueble para vender?
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              {productLive
                ? "Publica en venta con checklist clara: datos, precio en USD y fotos. Opcional: paquetes Preferencial."
                : "Con keys Musas activas publicas desde la app. Mientras tanto, deja tus datos en la landing."}
            </p>
          </div>
          <button
            type="button"
            onClick={onPublish}
            className="interactive-surface inline-flex h-11 items-center rounded-full bg-neon px-5 text-sm font-semibold text-primary-foreground hover:bg-white"
          >
            {productLive ? "Publicar inmueble" : "Pedir acceso para publicar"}
          </button>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="inline-flex items-center gap-2 text-foreground">
            <span className="inline-flex size-7 items-center justify-center rounded-full border border-neon/40 text-neon">
              <Home className="size-3.5" aria-hidden />
            </span>
            <span className="font-semibold">
              musas<span className="text-neon">.</span>
            </span>
          </div>
          <p>Venezuela · venta en USD · sin alquiler en esta versión</p>
          <p>© 2026 Musas</p>
        </div>
      </footer>
    </>
  );
}
